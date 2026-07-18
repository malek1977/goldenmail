"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function DonutChart({ data, height = 280, centerLabel, centerValue }) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={105} paddingAngle={3} dataKey="value" stroke="none">
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "#0d0d1a", border: "1px solid rgba(200, 150, 46, 0.2)", borderRadius: 12, fontFamily: "Cairo, sans-serif" }} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && <p className="text-2xl font-extrabold text-gradient-gold">{centerValue}</p>}
          {centerLabel && <p className="text-xs text-slate-500 mt-1">{centerLabel}</p>}
        </div>
      )}
    </div>
  );
}