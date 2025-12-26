"use client"

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Message Volume Chart Component
export function MessageVolumeChart({ data }: { data: Array<{ date: string; received: number; sent: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
        <XAxis dataKey="date" stroke="#a3a3a3" fontSize={12} />
        <YAxis stroke="#a3a3a3" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            border: "1px solid #262626",
            borderRadius: "0.5rem",
          }}
        />
        <Area type="monotone" dataKey="received" stackId="1" stroke="#00d9a3" fill="#00d9a3" fillOpacity={0.6} />
        <Area type="monotone" dataKey="sent" stackId="1" stroke="#ff6b35" fill="#ff6b35" fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Status Pie Chart Component
export function StatusPieChart({ data }: { data: { open: number; awaiting_response: number; resolved: number } }) {
  const chartData = [
    { name: "Open", value: data.open, color: "#ff6b35" },
    { name: "Awaiting", value: data.awaiting_response, color: "#ffd93d" },
    { name: "Resolved", value: data.resolved, color: "#00d9a3" },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            border: "1px solid #262626",
            borderRadius: "0.5rem",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Category Bar Chart Component
export function CategoryBarChart({ data }: { data: { sales: number; support: number; collaboration: number; general: number } }) {
  const chartData = [
    { name: "Sales", value: data.sales, color: "#00d9a3" },
    { name: "Support", value: data.support, color: "#ff6b35" },
    { name: "Collaboration", value: data.collaboration, color: "#9d4edd" },
    { name: "General", value: data.general, color: "#ffd93d" },
  ]

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
        <XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} />
        <YAxis stroke="#a3a3a3" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            border: "1px solid #262626",
            borderRadius: "0.5rem",
          }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}