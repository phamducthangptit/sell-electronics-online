import { useEffect, useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import OrderTable from "./OrderTable";
export default function QuanLiDonHang() {
  const token = localStorage.getItem("token");
  const [orderData, setOrderData] = useState([]);
  const [searchQuery, setSearchQuery] = useState();
  const [fullData, setFullData] = useState([]);
  const typeOrders = [
    { id: 1, value: "Mới" },
    { id: 2, value: "Đã xác nhận" },
    { id: 3, value: "Hoàn thành" },
    { id: 4, value: "Hủy" },
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
            setFullData(data);
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [selectedType, token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery === "") {
      setOrderData(fullData);
    } else {
      const filteredData = fullData.filter((item) =>
        item.phone.includes(searchQuery)
      );
      setOrderData(filteredData);
    }
  };

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
        <div className="flex justify-end w-auto">
          <form
            className="flex items-center border-2 border-blue-500 rounded overflow-hidden"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="number"
              placeholder="Nhập SDT để tìm kiếm"
              className="w-48 border-none p-2 bg-gray-100 text-gray-700 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 whitespace-nowrap"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>
      <OrderTable data={orderData} setOrderData={setOrderData} />
    </div>
  );
}
