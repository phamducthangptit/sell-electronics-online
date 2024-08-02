import { useEffect, useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import CategoryTable from "./CategoryTable";
import Popup from "./PopupThem";
export default function QuanLiLoaiSanPham() {
  const [categoryData, setCategoryData] = useState([]);
  const token = localStorage.getItem("token");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [fullData, setFullData] = useState([]);
  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  const handleSave = (addNewCategory) => {
    console.log("abc");
    console.log(addNewCategory);
    setCategoryData([...categoryData, addNewCategory]);
  };

  useEffect(() => {
    fetch(`api/product-service/employee/category/get-all-category`, {
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
            setFullData(data);
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
      setCategoryData(fullData);
    } else {
      const filteredData = fullData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCategoryData(filteredData);
    }
  };
  return (
    <div>
      <Header />
      <NavBar />
      <div className="border-solid pt-2 pr-6 flex items-center justify-end space-x-4">
        <div className="flex flex-grow justify-center">
          <form
            className="flex items-center border-2 border-blue-500 rounded overflow-hidden w-full max-w-lg"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="Nhập tên để tìm kiếm"
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
