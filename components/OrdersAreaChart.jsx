'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function OrdersAreaChart({ allOrders }) {

    // Group orders by date
    const ordersPerDay = allOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0] // format: YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1
        return acc
    }, {})

    // Convert to array for Recharts
    const chartData = Object.entries(ordersPerDay).map(([date, count]) => ({
        date,
        orders: count
    }))

    return (
        <div className="w-full h-[320px] text-xs">
            <h3 className="text-lg font-medium text-white mb-4"><span className='text-muted'>Orders /</span> Day</h3>
            <ResponsiveContainer width="100%" height="88%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbd0c" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#fbbd0c" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#94a3b8' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={{ stroke: 'rgba(255,255,255,0.1)' }} label={{ value: 'Orders', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#131316', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} labelStyle={{ color: '#f1f5f9' }} itemStyle={{ color: '#fbbd0c' }} />
                    <Area type="monotone" dataKey="orders" stroke="#fbbd0c" fill="url(#ordersFill)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
