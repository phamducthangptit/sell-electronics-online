import { useEffect, useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import OrderTable from "./OrderTable";
export default function QuanLiDonHang() {
  const token = localStorage.getItem("token");
  const [orderData, setOrderData] = useState([]);
  const typeOrders = [
    { id: 1, value: "Mới" },
    { id: 2, value: "Đã xác nhận" },
    { id: 3, value: "Hoàn thành" },
  ];
  const [selectedType, setSelectedType] = useState(typeOrders[0].value);

  const handleClickChangeType = (event) => {
    setSelectedType(event.target.value);
  };

  useEffect(() => {
    fetch(
      `api/product-service/employee/order/get-all-order-by-type?type=${selectedType}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setOrderData(data);
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [selectedType, token]);

  return (
    <div>
      <Header />
      <NavBar />
      <div className="border-solid pt-2 pr-6 flex items-center space-x-4">
        <div className="flex-grow flex justify-center items-center space-x-2">
          <span className="text-gray-700">Lọc theo trạng thái:</span>
          <select
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            onChange={handleClickChangeType}
          >
            {typeOrders.map((type) => (
              <option key={type.id} value={type.value}>
                {type.value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <OrderTable data={orderData} setOrderData={setOrderData} />
    </div>
  );
}
