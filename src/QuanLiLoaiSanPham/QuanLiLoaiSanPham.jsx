import { useEffect, useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import CategoryTable from "./CategoryTable";
import Popup from "./PopupThem";
export default function QuanLiLoaiSanPham() {
  const [categoryData, setCategoryData] = useState([]);
  const token = localStorage.getItem("token");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  const handleSave = (addNewCategory) => {
    setCategoryData([...categoryData, addNewCategory]);
  };

  useEffect(() => {
    fetch(`api/product-service/category/get-all-category`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setCategoryData(data);
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token]);
  return (
    <div>
      <Header />
      <NavBar />
      <div className="border-solid pt-2 pr-6 flex items-center justify-end space-x-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={togglePopup}
        >
          Thêm loại sản phẩm
        </button>
      </div>
      <CategoryTable data={categoryData} setCategory={setCategoryData} />
      <Popup
        show={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
