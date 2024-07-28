import React, { useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import OrderBarChart from "./OrderBarChart";

export default function ThongKeDonHang() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const getApiEndpoint = () => {
    switch (selectedPeriod) {
      case "7days":
        return "api/product-service/admin/status-counts/this-week";
      case "5weeks":
        return "api/product-service/admin/status-counts/last-five-weeks";
      case "3months":
        return "api/product-service/admin/status-counts/last-three-months";
      default:
        return "api/product-service/admin/status-counts/this-week";
    }
  };

  const getTitle = () => {
    switch (selectedPeriod) {
      case "7days":
        return "Số lượng đơn hàng 7 ngày";
      case "5weeks":
        return "Số lượng đơn hàng 5 tuần";
      case "3months":
        return "Số lượng đơn hàng 3 tháng";
      default:
        return "Số lượng đơn hàng 7 ngày";
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
            <option value="7days">Số lượng đơn hàng 7 ngày</option>
            <option value="5weeks">Số lượng đơn hàng 5 tuần</option>
            <option value="3months">Số lượng đơn hàng 3 tháng</option>
          </select>
        </div>
        <OrderBarChart apiEndpoint={getApiEndpoint()} title={getTitle()} />
      </div>
    </div>
  );
}
