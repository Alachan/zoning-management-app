import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ZONING_COLORS, formatArea } from "../../utils/helpers";

const StatsChart = ({ stats, title = "Zoning Distribution" }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!stats || !stats.areaByZoningType) {
      setChartData([]);
      return;
    }

    // Transform data for the pie chart
    const data = Object.entries(stats.areaByZoningType).map(
      ([name, value]) => ({
        name,
        value: Math.max(value, 0.001), // Ensure small values are visible
      })
    );

    setChartData(data);
  }, [stats]);

  if (
    !stats ||
    !stats.areaByZoningType ||
    Object.keys(stats.areaByZoningType).length === 0
  ) {
    return null;
  }

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-md text-xs">
          <p className="font-medium">{data.name}</p>
          <p>{formatArea(data.value)}</p>
          <p>{`(${((data.value / stats.totalArea) * 100).toFixed(1)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  // Simplified custom label that only shows percentages
  const renderCustomizedLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="w-full h-40 mt-2">
      {" "}
      <h4 className="text-center text-xs font-medium text-gray-600 mb-1">
        {" "}
        {title}
      </h4>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={50}
            paddingAngle={1}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={ZONING_COLORS[entry.name] || ZONING_COLORS.default}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
