"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function AreaChartCard({ data, color = "#c8962e", height = 280, formatY = (v) => `${(v/1000).toFixed(0)}K` }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a26" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} reversed />
        <YAxis tickFormatter={formatY} tickLine={false} axisLine={false} orientation="right" />
        <Tooltip contentStyle={{ background: "#0d0d1a", border: "1px solid rgba(200, 150, 46, 0.2)", borderRadius: 12, fontFamily: "Cairo, sans-serif" }} labelStyle={{ color: "#f0c75e", fontWeight: 700 }} formatter={(v) => [formatY(v), "القيمة"]} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill="url(#goldArea)" dot={{ fill: color, r: 4, strokeWidth: 2, stroke: "#0d0d1a" }} activeDot={{ r: 6 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}