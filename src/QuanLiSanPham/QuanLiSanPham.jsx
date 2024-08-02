import { useEffect, useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import ProductTable from "./ProductTable";
import { useNavigate, useLocation } from "react-router-dom";
export default function QuanLiSanPham() {
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

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
            const categoryFromState = location.state?.selectedCategory;
            if (categoryFromState) {
              setSelectedCategory(categoryFromState);
            } else {
              setSelectedCategory(data[0].categoryId);
            }
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token, location.state]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  useEffect(() => {
    console.log(selectedCategory);
    fetch(
      `api/product-service/employee/product/get-all-product-by-category?id=${selectedCategory}`,
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
            setProductData(data);
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token, selectedCategory]);

  const handleClickThemSanPham = () => {
    navigate("/them-san-pham");
  };
  return (
    <div>
      <Header />
      <NavBar />
      <div className="border-solid pt-2 pr-6 flex items-center space-x-4">
        <div className="flex-grow flex justify-center items-center space-x-2">
          <span className="text-gray-700">Lọc theo loại sản phẩm:</span>
          <select
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            {categoryData.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleClickThemSanPham}
        >
          Thêm sản phẩm
        </button>
      </div>
      <ProductTable data={productData} setProductData={setProductData} />
    </div>
  );
}
