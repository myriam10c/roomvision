export const dynamic = "force-dynamic"
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { PLAN_CREDITS } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { Plan } from '@prisma/client'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const plan = session.metadata?.plan as Plan

      if (userId && plan) {
        const credits = PLAN_CREDITS[plan] || 3
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            credits,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        })
        await prisma.creditTransaction.create({
          data: {
            amount: credits,
            type: 'PURCHASE',
            reason: `Subscription ${plan}`,
            userId,
          },
        })
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
      if (user) {
        const status = subscription.status
        if (status === 'active') {
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeSubscriptionId: subscription.id },
          })
        }
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          plan: 'FREE',
          credits: PLAN_CREDITS.FREE,
          stripeSubscriptionId: null,
        },
      })
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.billing_reason === 'subscription_cycle') {
        const customerId = invoice.customer as string
        const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
        if (user) {
          const credits = PLAN_CREDITS[user.plan] || 3
          await prisma.user.update({
            where: { id: user.id },
            data: { credits },
          })
          await prisma.creditTransaction.create({
            data: {
              amount: credits,
              type: 'MONTHLY_RESET',
              reason: `Monthly reset — ${user.plan}`,
              userId: user.id,
            },
          })
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
