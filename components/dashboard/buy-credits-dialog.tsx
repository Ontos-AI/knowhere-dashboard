'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/useToast'
import { type CreditsPackage, api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Coins, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

// Default minimum credits purchase if not specified
const MIN_CREDITS_PURCHASE = 1
const PRESET_AMOUNTS = [20, 50, 100, 500]

interface BuyCreditsDialogProps {
  currentCredits?: number
}

export function BuyCreditsDialog({ currentCredits = 0 }: BuyCreditsDialogProps) {
  const t = useTranslations('BuyCredits')
  const toast = useToast()

  // UI State
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Data State
  const [packages, setPackages] = useState<CreditsPackage[]>([])
  const [isFetching, setIsFetching] = useState(false)

  // Selection State
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [isCustom, setIsCustom] = useState(false)
  const [customAmountStr, setCustomAmountStr] = useState<string>('')

  const customInputRef = useRef<HTMLInputElement>(null)

  // Fetch packages on open
  useEffect(() => {
    if (open) {
      fetchPackages()
    } else {
      // Reset state on close
      const timer = setTimeout(() => {
        setIsCustom(false)
        setCustomAmountStr('')
        setSelectedAmount(PRESET_AMOUNTS[0]) // Default to first preset
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Focus custom input
  useEffect(() => {
    if (isCustom && customInputRef.current) {
      customInputRef.current.focus()
    }
  }, [isCustom])

  const fetchPackages = async () => {
    try {
      setIsFetching(true)
      const data = await api.getPriceConfigs('credits_package')
      const pkgs = data.credits_packages || []
      setPackages(pkgs)

      // Default to first preset if not set
      if (!isCustom && !selectedAmount) {
        setSelectedAmount(PRESET_AMOUNTS[0])
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error)
      toast.error('Failed to load credit packages')
    } finally {
      setIsFetching(false)
    }
  }

  // Helpers
  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount)
    setIsCustom(false)
    setCustomAmountStr('')
  }

  const handleCustomSelect = () => {
    setIsCustom(true)
    setSelectedAmount(null)
    setCustomAmountStr('')
  }

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty or valid float/int
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomAmountStr(value)
    }
  }

  // Calculate Multiplier (based on first package's credits_amount)
  const getMultiplier = () => {
    if (packages.length > 0) {
      return packages[0].credits_amount
    }
    return 1 // Default fallback if no packages loaded
  }

  const multiplier = getMultiplier()

  // Calculations
  const getDisplayAmount = () => {
    if (isCustom) {
      return customAmountStr === '' ? '0' : customAmountStr
    }
    if (selectedAmount) {
      return selectedAmount.toString()
    }
    return '0'
  }

  const displayAmount = getDisplayAmount()

  // Validation for Custom Amount
  const currentAmountNum = isCustom ? Number.parseFloat(customAmountStr) : selectedAmount || 0

  // Calculate display credits (based on multiplier)
  const creditsToBuy = Number.isNaN(currentAmountNum)
    ? 0
    : Math.floor(currentAmountNum * multiplier)
  // Quantity for API (based on amount directly)
  const quantity = Number.isNaN(currentAmountNum) ? 0 : Math.floor(currentAmountNum)

  const isValid = isCustom
    ? !Number.isNaN(currentAmountNum) && currentAmountNum >= MIN_CREDITS_PURCHASE
    : !!selectedAmount

  // Purchase Handlers
  const handlePurchase = async () => {
    if (!isValid) return

    try {
      setIsLoading(true)

      // Use the first package ID from the API
      if (packages.length === 0) {
        toast.error('Price configuration not found')
        setIsLoading(false)
        return
      }

      const priceId = packages[0].price_id

      // Call api.buyCreditsPackage with the first priceId and the input amount as quantity
      const response = await api.buyCreditsPackage(priceId, quantity)
      if (response.checkout_url) {
        window.location.href = response.checkout_url
      } else {
        toast.error('Failed to create checkout session')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      toast.error('Purchase failed')
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Coins className="h-4 w-4" />
          <span>
            {currentCredits.toLocaleString()} {t('credits')}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('title')}</DialogTitle>
          <DialogDescription className="text-base pt-2">{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-8">
          {/* Big Amount Display */}
          <div className="text-6xl font-bold tracking-tighter">
            ${Number(displayAmount).toFixed(2)}
          </div>

          {/* Selection Buttons */}
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {isFetching ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                {PRESET_AMOUNTS.map((amount) => {
                  const isSelected = !isCustom && selectedAmount === amount

                  return (
                    <Button
                      key={amount}
                      variant={isSelected ? 'default' : 'outline'}
                      className={cn(
                        'w-[70px]',
                        isSelected
                          ? 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black'
                          : 'bg-transparent'
                      )}
                      onClick={() => handlePresetSelect(amount)}
                    >
                      ${amount}
                    </Button>
                  )
                })}
                <Button
                  variant={isCustom ? 'default' : 'outline'}
                  className={cn(
                    'w-[80px]',
                    isCustom
                      ? 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black'
                      : 'bg-transparent'
                  )}
                  onClick={handleCustomSelect}
                >
                  {t('custom')}
                </Button>
              </>
            )}
          </div>

          {/* Custom Input Animation Container */}
          <div
            className={cn(
              'w-full max-w-[200px] grid transition-[grid-template-rows] duration-300 ease-out',
              isCustom ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
          >
            <div className="overflow-hidden">
              <div
                className={cn(
                  'pt-4 px-1 transition-all duration-300',
                  isCustom ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                )}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    ref={customInputRef}
                    type="text"
                    placeholder={t('amountPlaceholder') || 'Amount'}
                    value={customAmountStr}
                    onChange={handleCustomInputChange}
                    className="pl-7"
                    tabIndex={isCustom ? 0 : -1}
                  />
                </div>
                <p
                  className={cn(
                    'text-xs text-red-500 mt-2 text-center h-4 transition-opacity duration-200',
                    !isValid && customAmountStr !== '' ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  {t('minPurchaseError', { amount: MIN_CREDITS_PURCHASE })}
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {creditsToBuy > 0 ? `≈ ${creditsToBuy.toLocaleString()} Credits` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="h-10"
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
          <Button
            className="h-10 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black min-w-[150px]"
            disabled={(!isCustom && !selectedAmount) || (isCustom && !isValid) || isLoading}
            onClick={handlePurchase}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('processing')}
              </>
            ) : (
              t('purchase')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
