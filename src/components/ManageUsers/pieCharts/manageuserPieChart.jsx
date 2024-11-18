import React, { useEffect, useState } from "react";
import { ManageUserPieChartWrap } from "./manageuserPieChart.Styles";
import { getDataByStates } from "../../../service/userPageApi"; // Ensure this import path is correct
import { Pie } from "@ant-design/plots"; // Make sure @ant-design/plots is installed

function ManageUserPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDataByStates();
        const chartData = response.usersByState.map((item) => ({
          type: item._id, // State name
          value: item.count, // User count
        }));
        setData(chartData);
      } catch (error) {
        console.error("Error fetching data for pie chart:", error.message);
      }
    };
    fetchData();
  }, []);

  const config = {
    appendPadding: 7,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.8,
    label: {
      type: "inner",
      offset: "-30%",
      content: "{value}",
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [{ type: "element-active" }],
  };

  return (
    <ManageUserPieChartWrap>
      <Pie {...config} />
    </ManageUserPieChartWrap>
  );
}

export default ManageUserPieChart;
