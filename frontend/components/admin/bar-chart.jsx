"use client";

import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function BarChartCard({ data, color = "#c8962e", height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a26" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} reversed />
        <YAxis tickLine={false} axisLine={false} orientation="right" />
        <Tooltip cursor={{ fill: "rgba(200, 150, 46, 0.05)" }} contentStyle={{ background: "#0d0d1a", border: "1px solid rgba(200, 150, 46, 0.2)", borderRadius: 12, fontFamily: "Cairo, sans-serif" }} />
        <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}