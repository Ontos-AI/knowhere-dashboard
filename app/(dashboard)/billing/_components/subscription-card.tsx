'use client'

import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { useToast } from '@hooks/useToast'
import type { Subscription, SubscriptionPlan } from '@server/external-api/client'
import { api } from '@server/external-api/client'
import { Check, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type SubscriptionCardProps = {
  plan: SubscriptionPlan
  currentSubscription?: Subscription | null
  onSubscriptionChange?: () => void
}

export function SubscriptionCard({
  plan,
  currentSubscription,
  onSubscriptionChange,
}: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const t = useTranslations('Billing')

  const isCurrentPlan = currentSubscription?.plan_type === plan.id
  const isActive = currentSubscription?.status === 'active'

  const handleSubscribe = async () => {
    if (isCurrentPlan && isActive) {
      toast.info(t('alreadySubscribed'))
      return
    }

    try {
      setIsLoading(true)

      if (plan.id === 'free') {
        // 免费套餐不需要支付
        toast.info(t('freePlanNoPayment'))
        return
      }

      // 调用订阅API
      const response = await api.subscribePlan(plan.id)

      if (response.checkout_url) {
        // 跳转到Stripe Checkout
        window.location.href = response.checkout_url
      } else {
        throw new Error(t('getPaymentLinkFailed'))
      }
    } catch (error) {
      console.error('订阅失败:', error)
      toast.error(t('subscribeError'))
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (isLoading) return t('processing')
    if (isCurrentPlan && isActive) return t('currentPlan')
    if (plan.id === 'free') return t('freePlan')
    return t('subscribeTo', { name: plan.name })
  }

  const getButtonVariant = () => {
    if (isCurrentPlan && isActive) return 'secondary'
    if (plan.popular) return 'default'
    return 'outline'
  }

  return (
    <Card className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
      {plan.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          {t('recommend')}
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>
          {(() => {
            const price =
              typeof plan.price === 'number'
                ? plan.price
                : Number.parseFloat(String(plan.price || 0))
            if (price === 0 || Number.isNaN(price)) {
              return <span className="text-2xl font-bold text-green-600">{t('free')}</span>
            }
            const formattedPrice = price.toFixed(2)
            return (
              <span className="text-2xl font-bold">
                ¥{formattedPrice}
                {plan.period && (
                  <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                )}
              </span>
            )
          })()}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {plan.description && (
          <p className="text-sm text-muted-foreground text-center">{plan.description}</p>
        )}

        {plan.credits !== undefined && (
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{plan.credits.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">{t('creditsPerMonth')}</div>
          </div>
        )}

        {plan.features && plan.features.length > 0 && (
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <Button
          className="w-full"
          variant={getButtonVariant()}
          onClick={handleSubscribe}
          disabled={isLoading || (isCurrentPlan && isActive)}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  )
}
