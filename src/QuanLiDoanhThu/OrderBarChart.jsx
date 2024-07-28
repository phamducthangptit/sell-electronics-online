import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import "tailwindcss/tailwind.css";

// Đăng ký thang đo category
Chart.register(CategoryScale);

const OrderBarChart = ({ apiEndpoint, title }) => {
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
        const statusLabels = Object.keys(data[labels[0]]);
        const datasets = statusLabels.map((status) => ({
          label: status,
          data: labels.map((date) => data[date][status] || 0),
          backgroundColor: getColor(status),
          borderColor: getColor(status, true),
          borderWidth: 1,
        }));

        setChartData({
          labels: labels,
          datasets: datasets,
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the order data!", error);
      });
  }, [apiEndpoint]);

  const getColor = (status, border = false) => {
    const colors = {
      Mới: "rgba(75, 192, 192, 0.4)",
      "Đã xác nhận": "rgba(255, 159, 64, 0.4)",
      "Hoàn thành": "rgba(255, 99, 132, 0.4)",
    };
    return border ? colors[status].replace("0.4", "1") : colors[status];
  };

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

export default OrderBarChart;
