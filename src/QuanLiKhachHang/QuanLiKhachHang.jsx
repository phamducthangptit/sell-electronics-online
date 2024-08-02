import { useEffect, useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import GuestTable from "./GuestTable";

export default function QuanLiKhachHang() {
  const token = localStorage.getItem("token");
  const [guestData, setGuestData] = useState([]);
  const [searchQuery, setSearchQuery] = useState();
  const [fullData, setFullData] = useState([]);

  useEffect(() => {
    fetch(`api/information-service/employee/list-guest`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setGuestData(data);
            setFullData(data);
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery === "") {
      setGuestData(fullData);
    } else {
      const filteredData = fullData.filter((item) =>
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setGuestData(filteredData);
    }
  };
  return (
    <div>
      <Header />
      <NavBar />
      <div className="bg-white border-solid p-4 md:p-4 flex items-center justify-center">
        <form
          className="flex items-center border-2 border-blue-500 rounded overflow-hidden w-full max-w-lg"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            placeholder="Nhập email để tìm kiếm"
            className="flex-grow border-none p-2 bg-gray-100 text-gray-700 focus:outline-none"
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
      <GuestTable data={guestData} />
    </div>
  );
}
