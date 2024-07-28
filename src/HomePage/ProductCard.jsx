import React from "react";
import view from "../image/view.png";
// import compare from "../image/compare.png";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, setPopupOpen, setResponse, setCartCount }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username");
  const handleClickXemChiTietSanPham = () => {
    navigate("/chi-tiet-san-pham", {
      state: { product: product },
    });
  };
  const handleClickThemSpVaoGioHang = () => {
    if (token) {
      fetch(`api/product-service/guest/cart/add-product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          productId: product.productId,
          quantity: 1,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            callAPIGetCartCount();
          }
          res.json().then((data) => {
            console.log(data);
            setResponse(data);
            setPopupOpen(true);
          });
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    } else {
      const newResponse = { value: "Bạn cần đăng nhập để mua hàng!" };
      setResponse(newResponse);
      setPopupOpen(true);
      console.log("abc");
    }
  };
  const callAPIGetCartCount = () => {
    fetch(`api/product-service/guest/cart/count-product?username=${userName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setCartCount(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };
  return (
    <div className="cursor-pointer max-w-sm rounded overflow-hidden shadow-lg border p-6 relative m-2 transition duration-300 ease-in-out transform hover:border-blue-500 hover:shadow-xl">
      <div className="relative">
        <img
          className="w-full h-72 object-contain"
          src={product.image}
          alt={product.name}
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            className="bg-white rounded-full p-2 shadow"
            onClick={handleClickXemChiTietSanPham}
          >
            <img
              className="w-6 h-6"
              src={view}
              alt="icon 1"
              title="Xem chi tiết"
            />
          </button>
          {/* <button className="bg-white rounded-full p-2 shadow">
            <img
              className="w-6 h-6"
              src={compare}
              alt="icon 2"
              title="So sánh"
            />
          </button> */}
        </div>
      </div>
      <div className="px-6 py-4">
        <div
          className="font-bold text-xl mb-2 hover:text-blue-500"
          onClick={handleClickXemChiTietSanPham}
        >
          {product.name}
        </div>
        <p className="text-gray-700 text-base">{product.categoryName}</p>
        <div className="text-red-500 font-bold text-xl">{product.price}</div>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={handleClickThemSpVaoGioHang}
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default ProductCard;
