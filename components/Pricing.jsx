'use client'
import { CheckIcon } from 'lucide-react'
import Link from 'next/link'
import Title from './Title'

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: '',
        caption: 'Always free',
        features: [
            'Limited Coupons',
            'Limited Discounts',
            'No Early Access to Sales',
            'Limited Cashback & Rewards',
            'Paid Shipping',
        ],
        cta: 'Get Started',
        href: '/shop',
        highlighted: false,
    },
    {
        name: 'Plus',
        price: '$4',
        period: '/month',
        caption: 'Billed annually',
        features: [
            'Member-Exclusive Coupons',
            'Exclusive Discounts',
            'Early Access to Sales',
            'Cashback & Rewards Boost',
            'Free or Faster Shipping',
        ],
        cta: 'Start 7-day free trial',
        href: '/pricing',
        highlighted: true,
    },
]

const Pricing = () => {
    return (
        <div className='px-6 my-30 max-w-4xl mx-auto'>
            <Title title='Simple, Transparent Pricing' description='Free to start. Upgrade to Plus anytime for exclusive perks and faster shipping.' visibleButton={false} />

            <div className='grid sm:grid-cols-2 gap-6 mt-12'>
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative flex flex-col rounded-2xl p-8 border transition ${
                            plan.highlighted
                                ? 'bg-panel border-accent/60 shadow-lg shadow-accent/10'
                                : 'bg-slate-900 border-slate-800'
                        }`}
                    >
                        {plan.highlighted && (
                            <span className='absolute -top-3 left-8 bg-accent text-slate-900 text-xs font-semibold px-3 py-1 rounded-full'>
                                Most Popular
                            </span>
                        )}

                        <p className='text-xl font-semibold text-white'>{plan.name}</p>
                        <div className='flex items-end gap-1 mt-4'>
                            <span className='text-4xl font-bold text-white'>{plan.price}</span>
                            {plan.period && <span className='text-muted text-sm mb-1'>{plan.period}</span>}
                        </div>
                        <p className='text-muted text-sm mt-1'>{plan.caption}</p>

                        <hr className='border-white/10 my-6' />

                        <ul className='flex flex-col gap-3 flex-1'>
                            {plan.features.map((feature) => (
                                <li key={feature} className='flex items-center gap-2.5 text-sm text-slate-300'>
                                    <CheckIcon size={16} className='text-accent shrink-0' />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href={plan.href}
                            className={`text-center font-medium text-sm px-6 py-3 rounded-lg mt-8 transition-all active:scale-[0.98] ${
                                plan.highlighted
                                    ? 'bg-accent hover:bg-accent-hover text-slate-900 font-bold shadow-md shadow-accent/20'
                                    : 'border border-slate-700 text-slate-100 hover:border-accent hover:text-accent'
                            }`}
                        >
                            {plan.cta}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Pricing
