import { useEffect, useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import EmployeeTable from "./EmployeeTable";
import Popup from "./PopupThem";

export default function QuanLiNhanVien() {
  const token = localStorage.getItem("token");
  const [employeeData, setEmployeeData] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState();
  const [fullData, setFullData] = useState([]);

  const togglePopup = (item) => {
    setCurrentItem(item);
    setPopupOpen(!isPopupOpen);
  };

  const handleSave = (addNewEmployee) => {
    setEmployeeData([...employeeData, addNewEmployee]);
    console.log(employeeData);
    setCurrentItem(null);
  };
  useEffect(() => {
    fetch(`api/information-service/admin/list-employee`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setEmployeeData(data);
            setFullData(data);
            // console.log(data);
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
      setEmployeeData(fullData);
    } else {
      const filteredData = fullData.filter((item) =>
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setEmployeeData(filteredData);
    }
  };
  return (
    <div>
      <Header />
      <NavBar />
      <div className="border-solid pt-2 pr-6 flex items-center justify-center space-x-4">
        <div className="flex flex-grow justify-center">
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
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => togglePopup(currentItem)}
        >
          Thêm nhân viên
        </button>
      </div>
      <EmployeeTable data={employeeData} />
      <Popup
        show={isPopupOpen}
        onClose={() => {
          setPopupOpen(false);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
