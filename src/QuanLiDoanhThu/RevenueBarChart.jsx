import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import "tailwindcss/tailwind.css";

// Đăng ký thang đo category
Chart.register(CategoryScale);

const RevenueBarChart = ({ apiEndpoint, title }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const labels = Object.keys(data);
        const revenue = Object.values(data);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Doanh thu",
              data: revenue,
              backgroundColor: "rgba(75, 192, 192, 0.4)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the revenue data!", error);
      });
  }, [apiEndpoint]);

  return (
    <div className="flex justify-center items-center">
      <div className="w-full md:w-2/3 lg:w-1/2">
        <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
        <div
          className="w-full"
          style={{ position: "relative", height: "400px" }}
        >
          <Bar
            data={chartData}
            options={{ maintainAspectRatio: false, responsive: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default RevenueBarChart;
