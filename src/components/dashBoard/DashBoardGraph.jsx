import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { DashBoardGraphWrap } from "./DashBoardGraph.Styles";
import { GraphData } from "../../service/DashboardApi";

const DashBoardGraph = () => {
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GraphData();
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        const formattedData = data.dailyStats.map((entry) => {
          const date = new Date(currentYear, currentMonth, entry.day);
          return {
            ...entry,
            date: date.toISOString().split("T")[0],
            totalOrders: parseInt(entry.totalOrders, 10),
            totalRevenue: parseFloat(entry.totalRevenue),
          };
        });

        setDailyStats(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading graph...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <DashBoardGraphWrap>
      <h2>Sales Graph</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={dailyStats}>
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => {
              const parsedDate = new Date(date);
              return isNaN(parsedDate)
                ? "Invalid Date"
                : parsedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
            }}
          />
          <YAxis
            tickFormatter={(value) => {
              if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`; // Format large numbers as millions
              } else if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}K`; // Format as thousands
              } else {
                return `${value.toFixed(2)}`; // Format revenue with 2 decimal places
              }
            }}
          />

          <Tooltip
            formatter={(value, name) =>
              name === "Total Revenue"
                ? [`$${value.toFixed(2)}`, "Revenue"]
                : [value, "Orders"]
            }
          />
          <Legend verticalAlign="top" height={36} />

          <Area
            type="monotone"
            dataKey="totalOrders"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorOrders)"
            name="Total Orders"
          />
          <Area
            type="monotone"
            dataKey="totalRevenue"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Total Revenue"
          />

          <Line
            type="monotone"
            dataKey="totalOrders"
            stroke="#8884d8"
            strokeWidth={2}
            name="Total Orders"
          />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#82ca9d"
            strokeWidth={2}
            name="Total Revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    </DashBoardGraphWrap>
  );
};

export default DashBoardGraph;
