'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SellerRevenueChart({ recentOrders, range }) {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const cutoff = Date.now() - range * 24 * 60 * 60 * 1000

    const filtered = recentOrders.filter(
        (order) => new Date(order.createdAt).getTime() >= cutoff
    )

    const revenueByDay = filtered.reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + order.total
        return acc
    }, {})

    const chartData = Object.entries(revenueByDay)
        .map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }))
        .sort((a, b) => a.date.localeCompare(b.date))

    if (chartData.length === 0) {
        return (
            <div className="w-full h-[320px] flex items-center justify-center">
                <p className="text-muted">No revenue in the last {range} days</p>
            </div>
        )
    }

    return (
        <div className="w-full h-[320px] text-xs">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 15, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: '#94a3b8' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        label={{ value: 'Date', position: 'insideBottom', offset: -12, fill: '#94a3b8' }}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fill: '#94a3b8' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickFormatter={(value) => `${currency}${value}`}
                        label={{ value: 'Revenue', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#131316', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }}
                        labelStyle={{ color: '#f1f5f9' }}
                        itemStyle={{ color: '#fbbd0c' }}
                        formatter={(value) => [`${currency}${value}`, 'Revenue']}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#fbbd0c"
                        strokeWidth={2}
                        dot={{ fill: '#fbbd0c', stroke: '#131316', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
