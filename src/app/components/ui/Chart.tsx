"use client";

import React from "react";
import { 
  ResponsiveContainer, 
  BarChart, Bar, 
  LineChart, Line, 
  PieChart, Pie, 
  Tooltip, XAxis, YAxis, Legend, Cell 
} from "recharts";

interface ChartProps {
  data: { [key: string]: string | number }[];
  type: "bar" | "line" | "pie";
  title?: string;
  xKey?: string;
  yKey?: string;
  valueKey?: string;
  colors?: string[];
}

const Chart: React.FC<ChartProps> = ({ data, type, title, xKey, yKey, valueKey, colors }) => {
  const defaultColors = ["#E26713", "#0A273A", "#CC5329", "#4CAF50", "#FF9800"];

  return (
    <div className="w-full h-[300px] bg-card rounded-lg p-4 shadow-md">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <>
          {type === "bar" && xKey && yKey && (
            <BarChart data={data}>
              <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill={colors?.[0] || defaultColors[0]} />
            </BarChart>
          )}

          {type === "line" && xKey && yKey && (
            <LineChart data={data}>
              <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={yKey} 
                stroke={colors?.[0] || defaultColors[1]} 
                strokeWidth={2} 
              />
            </LineChart>
          )}

          {type === "pie" && valueKey && (
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie 
                data={data} 
                dataKey={valueKey} 
                nameKey={xKey} 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                fill={colors?.[0] || defaultColors[2]}
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors?.[index % colors.length] || defaultColors[index % defaultColors.length]} 
                  />
                ))}
              </Pie>
            </PieChart>
          )}
        </>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

