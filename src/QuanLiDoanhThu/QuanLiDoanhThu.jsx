import React, { useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import RevenueBarChart from "./RevenueBarChart";

export default function QuanLiDoanhThu() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const getApiEndpoint = () => {
    switch (selectedPeriod) {
      case "7days":
        return "api/product-service/admin/revenue-this-week";
      case "5weeks":
        return "api/product-service/admin/revenue-last-5-weeks";
      case "3months":
        return "api/product-service/admin/revenue-last-3-months";
      default:
        return "api/product-service/admin/revenue-last-7-days";
    }
  };

  const getTitle = () => {
    switch (selectedPeriod) {
      case "7days":
        return "Doanh thu 7 ngày";
      case "5weeks":
        return "Doanh thu 5 tuần";
      case "3months":
        return "Doanh thu 3 tháng";
      default:
        return "Revenue of Last 7 Days";
    }
  };

  return (
    <div>
      <Header />
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center mb-4">
          <label
            htmlFor="period"
            className="block text-sm font-medium text-gray-700 mr-2"
          >
            Chọn khoảng thời gian
          </label>
          <select
            id="period"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            className="block min-w-[200px] pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7days">Doanh thu 7 ngày</option>
            <option value="5weeks">Doanh thu 5 tuần</option>
            <option value="3months">Doanh thu 3 tháng</option>
          </select>
        </div>
        <RevenueBarChart apiEndpoint={getApiEndpoint()} title={getTitle()} />
      </div>
    </div>
  );
}
