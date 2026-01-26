'use client'

import { format, subDays } from 'date-fns'
import { Activity, CheckCircle2, CreditCard, Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { BuyCreditsDialog } from '@/components/dashboard/buy-credits-dialog'
import { DatePickerWithRange } from '@/components/dashboard/date-range-picker'
import { type UsageRecord, UsageTable } from '@/components/dashboard/usage-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCredits } from '@/contexts/CreditsContext'
import { useTimezone } from '@/contexts/TimezoneContext'
import { useToast } from '@/hooks/useToast'
import { type JobResponse, type ParseUsageResponse, api } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function UsagePage() {
  const t = useTranslations('Usage')
  const tTable = useTranslations('UsageTable')
  const toast = useToast()
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [activeRange, setActiveRange] = useState<'1d' | '7d' | '30d' | null>('30d')
  const { timezone, formatDate } = useTimezone()
  const { credits } = useCredits()
  const [jobs, setJobs] = useState<UsageRecord[]>([])
  const [usageStats, setUsageStats] = useState<ParseUsageResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [totalCount, setTotalCount] = useState(0)

  const handlePageChange = (newPagination: any) => {
    setIsLoading(true)
    setPagination(newPagination)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const params: any = {
          page: pagination.pageIndex + 1,
          page_size: pagination.pageSize,
        }

        if (activeRange) {
          if (activeRange === '1d') params.recent_days = 1
          else if (activeRange === '7d') params.recent_days = 7
          else if (activeRange === '30d') params.recent_days = 30
        } else if (date?.from) {
          params.start_time = date.from.toISOString()
          if (date.to) {
            const endOfDay = new Date(date.to)
            endOfDay.setHours(23, 59, 59, 999)
            params.end_time = endOfDay.toISOString()
          } else {
            const endOfDay = new Date(date.from)
            endOfDay.setHours(23, 59, 59, 999)
            params.end_time = endOfDay.toISOString()
          }
        }

        const [jobsResponse, statsResponse] = await Promise.all([
          api.listJobs(params),
          api.getParseUsage(),
        ])

        setUsageStats(statsResponse)
        if (jobsResponse.total !== undefined) {
          setTotalCount(jobsResponse.total)
        }

        const mappedJobs: UsageRecord[] = jobsResponse.jobs.map((job: JobResponse) => {
          let status: UsageRecord['status'] = 'Running'
          if (job.status === 'done' || job.status === 'succeeded') status = 'Done'
          else if (job.status === 'failed' || job.status === 'error') status = 'Failed'

          // Use file_extension from API if available, otherwise try to infer
          let fileType = job.file_extension || job.source_type?.toUpperCase() || 'UNKNOWN'

          // If source_type is generic like 'file' or 'url' and no extension returned, try to infer from filename
          if (!job.file_extension && (fileType === 'FILE' || fileType === 'URL')) {
            const fileName = job.file_name || job.result_metadata?.file_name || ''
            if (fileName) {
              const ext = fileName.split('.').pop()?.toUpperCase()
              if (ext) fileType = ext
            }
          }

          const fileName =
            job.file_name || job.result_metadata?.file_name || job.source_type || 'Unknown'

          return {
            id: job.job_id,
            date: job.created_at,
            jobId: job.job_id,
            fileName: fileName,
            fileType: fileType,
            model: job.model || job.result_metadata?.model || '-',
            pages: job.result_metadata?.pages || 0,
            ocr: job.ocr_enabled ?? job.result_metadata?.ocr ?? false,
            status: status,
            duration: job.duration_seconds
              ? `${job.duration_seconds.toFixed(2)}s`
              : job.result_metadata?.duration || '-',
            cost: job.credits_spent ?? job.result_metadata?.cost ?? 0,
            apiKey: '-', // API Key is not returned in job list
            resultUrl: job.result_url,
          }
        })

        setJobs(mappedJobs)
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
        toast.error('Failed to fetch usage data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [date, activeRange, pagination.pageIndex, pagination.pageSize])

  // Calculate stats from filtered data
  const totalRequests = jobs.length
  const totalCost = jobs.reduce((acc, item) => acc + item.cost, 0)
  // Assuming 1 credit = $0.02
  const estimatedCost = totalCost * 0.02

  const doneJobs = jobs.filter((i) => i.status === 'Done')
  const successRate = jobs.length > 0 ? ((doneJobs.length / jobs.length) * 100).toFixed(1) : '0'

  const avgDuration =
    doneJobs.length > 0
      ? (
          doneJobs.reduce((acc, item) => {
            const durationStr = String(item.duration).replace('s', '')
            return acc + (Number.parseFloat(durationStr) || 0)
          }, 0) / doneJobs.length
        ).toFixed(1)
      : '0'

  const handleExportCSV = () => {
    // Define headers
    const headers = [
      tTable('date'),
      tTable('jobId'),
      tTable('fileName'),
      tTable('model'),
      tTable('pages'),
      tTable('duration'),
      tTable('cost'),
      tTable('status'),
      tTable('resultUrl'),
    ]

    // Map data to rows
    const rows = jobs.map((item) => [
      formatDate(item.date, 'yyyy-MM-dd HH:mm:ss'),
      item.jobId,
      `"${(item.fileName || '').replace(/"/g, '""')}"`,
      item.model,
      item.pages,
      item.duration,
      item.cost,
      item.status === 'Done'
        ? tTable('statusDone')
        : item.status === 'Failed'
          ? tTable('statusFailed')
          : tTable('statusRunning'),
      item.status === 'Done' ? item.resultUrl || '' : '',
    ])

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

    // Create blob with BOM and download link
    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `usage_export_${format(new Date(), 'yyyyMMdd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <BuyCreditsDialog currentCredits={credits || 0} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalRequests')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageStats
                ? usageStats.request_total.toLocaleString()
                : totalRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {usageStats
                ? t('comparedToLastMonth', {
                    value: `${usageStats.mom_growth >= 0 ? '+' : ''}${usageStats.mom_growth}%`,
                  })
                : t('comparedToLastMonth', { value: '0%' })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalCreditsUsed')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageStats ? usageStats.credits_used.toLocaleString() : totalCost.toLocaleString()}{' '}
              pts
            </div>
            <p className="text-xs text-muted-foreground">
              {usageStats
                ? t('estCost', { cost: `$${usageStats.estimated_amount}` })
                : t('estCost', { cost: `$${estimatedCost.toFixed(2)}` })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('successRate')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageStats ? usageStats.success_rate : successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {usageStats
                ? t('avgProcessingTime', { time: `${usageStats.avg_processing_time}s` })
                : t('avgProcessingTime', { time: `${avgDuration}s` })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <DatePickerWithRange
              date={date}
              setDate={(newDate) => {
                setDate(newDate)
                setActiveRange(null)
              }}
            />
            <div className="flex items-center rounded-lg border bg-card p-1 text-card-foreground shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-7 px-3 text-xs hover:bg-muted',
                  activeRange === '1d' &&
                    'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black'
                )}
                onClick={() => {
                  setDate({ from: subDays(new Date(), 1), to: new Date() })
                  setActiveRange('1d')
                }}
              >
                {t('1d')}
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-7 px-3 text-xs hover:bg-muted',
                  activeRange === '7d' &&
                    'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black'
                )}
                onClick={() => {
                  setDate({ from: subDays(new Date(), 7), to: new Date() })
                  setActiveRange('7d')
                }}
              >
                {t('7d')}
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-7 px-3 text-xs hover:bg-muted',
                  activeRange === '30d' &&
                    'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black'
                )}
                onClick={() => {
                  setDate({ from: subDays(new Date(), 30), to: new Date() })
                  setActiveRange('30d')
                }}
              >
                {t('30d')}
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            {t('exportCSV')}
          </Button>
        </div>

        <UsageTable
          data={jobs}
          timeZone={timezone}
          pageCount={Math.ceil(totalCount / pagination.pageSize)}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          total={totalCount}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
