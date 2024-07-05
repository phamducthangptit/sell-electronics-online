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
    fetch(`api/information/admin/list-employee`, {
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
            // console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token]);
  console.log(employeeData);
  return (
    <div>
      <Header />
      <NavBar />
      <div className="border-solid pt-2 pr-6 flex items-center justify-end space-x-4">
        <button
          type="submit"
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
        item={currentItem}
        onSave={handleSave}
      />
    </div>
  );
}
