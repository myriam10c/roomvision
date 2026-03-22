import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Please add it to your environment variables.'
      )
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return _stripe
}

// Lazy-init proxy so importing stripe doesn't crash at build time
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getStripe() as any)[prop]
  },
})

export const STRIPE_PRICES: Record<string, string> = {
  STARTER: process.env.STRIPE_PRICE_STARTER || '',
  PRO: process.env.STRIPE_PRICE_PRO || '',
  STUDIO: process.env.STRIPE_PRICE_STUDIO || '',
}
