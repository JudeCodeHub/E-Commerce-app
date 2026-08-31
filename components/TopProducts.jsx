'use client'
import Image from "next/image"

export default function TopProducts({ recentOrders, range }) {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const cutoff = Date.now() - range * 24 * 60 * 60 * 1000

    const filtered = recentOrders.filter(
        (order) => new Date(order.createdAt).getTime() >= cutoff
    )

    const revenueByProduct = {}
    filtered.forEach((order) => {
        order.orderItems.forEach((item) => {
            const key = item.product.id
            if (!revenueByProduct[key]) {
                revenueByProduct[key] = { product: item.product, revenue: 0, units: 0 }
            }
            revenueByProduct[key].revenue += item.price * item.quantity
            revenueByProduct[key].units += item.quantity
        })
    })

    const top5 = Object.values(revenueByProduct)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

    if (top5.length === 0) {
        return (
            <div className="h-[320px] flex items-center justify-center">
                <p className="text-muted text-center">No sales in the last {range} days</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {top5.map(({ product, revenue, units }, index) => (
                <div key={product.id} className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-muted w-4 shrink-0">
                        {index + 1}
                    </span>
                    <div className="size-10 shrink-0 bg-surface-light rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">{product.name}</p>
                        <p className="text-xs text-muted">{units} sold</p>
                    </div>
                    <p className="text-sm font-semibold text-white shrink-0">
                        {currency}{revenue.toFixed(2)}
                    </p>
                </div>
            ))}
        </div>
    )
}
