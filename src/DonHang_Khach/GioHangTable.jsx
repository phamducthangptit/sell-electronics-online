import { useState } from "react";
import defaultproduct from "../image/defaultproduct.jpg";
import { useNavigate } from "react-router-dom";
import Popup from "../HomePage/Popup";

const GioHangTable = ({ data, onQuantityChange }) => {
  const navigate = useNavigate();
  const [isPopup, setPopupOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username");

  const handleCheckboxChange = (product) => {
    if (selectedProducts.some((item) => item.productId === product.productId)) {
      const newSelectedProducts = selectedProducts.filter(
        (item) => item.productId !== product.productId
      );
      setSelectedProducts(newSelectedProducts);
      setSelectAll(newSelectedProducts.length === data.length);
    } else {
      const newSelectedProducts = [...selectedProducts, product];
      setSelectedProducts(newSelectedProducts);
      setSelectAll(newSelectedProducts.length === data.length);
    }
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(data);
    }
    setSelectAll(!selectAll);
  };

  const formatCurrency = (value) => {
    return value
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
      .replace("₫", "VNĐ");
  };

  const handleClickDatHang = () => {
    if (selectedProducts.length > 0) {
      navigate("/xac-nhan-don-hang", {
        state: { selectedProducts: selectedProducts },
      });
    } else {
      setPopupOpen(true);
      const newObject = { value: "Bạn cần chọn sản phẩm để đặt hàng!" };
      setResponse(newObject);
    }
    // console.log(selectedProducts);
  };

  const handleQuantityChange = (product, delta) => {
    const newQuantity = product.quantity + delta;
    console.log(newQuantity);
    if (newQuantity < 0) return; // Không cho số lượng âm

    if (newQuantity === 0) {
      // call api xóa sản phẩm khỏi giỏ hàng
      fetch(
        `api/product-service/guest/cart/delete-product?username=${userName}&productId=${product.productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.status === 200) {
            onQuantityChange(product, newQuantity); // Xóa sản phẩm nếu số lượng là 0
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    } else {
      // api cập nhật số lượng
      fetch(`api/product-service/guest/cart/update-quantity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          productId: product.productId,
          quantity: newQuantity,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            onQuantityChange(product, newQuantity); // cập nhật số lượng sản phẩm
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };

  return (
    <div className="container mx-auto mt-2 pl-4 pr-4 mb-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border border-gray-200">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
                className="w-6 h-6 text-blue-500 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </th>
            <th className="px-4 py-2 border border-gray-200">Ảnh</th>
            <th className="px-4 py-2 border border-gray-200">Tên sản phẩm</th>
            <th className="px-4 py-2 border border-gray-200">Giá</th>
            <th className="px-4 py-2 border border-gray-200">Số lượng</th>
            <th className="px-4 py-2 border border-gray-200">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="border px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product)}
                  onChange={() => handleCheckboxChange(product)}
                  className="w-6 h-6 text-blue-500 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  <img
                    src={product.image ? product.image : defaultproduct}
                    alt=""
                    className="w-40 h-40 object-cover"
                  />
                </div>
              </td>
              <td className="border px-4 py-2">{product.name}</td>

              <td className="border px-4 py-2 text-center">
                {product.priceString}
              </td>
              <td className="border px-4 py-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    className="bg-gray-300 text-gray-600 hover:bg-gray-400 hover:text-gray-700 font-bold py-1 px-3 rounded"
                    onClick={() => handleQuantityChange(product, -1)}
                  >
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    className="bg-gray-300 text-gray-600 hover:bg-gray-400 hover:text-gray-700 font-bold py-1 px-3 rounded"
                    onClick={() => handleQuantityChange(product, 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="border px-4 py-2 text-center">
                {formatCurrency(product.quantity * product.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleClickDatHang}
        >
          Đặt hàng
        </button>
      </div>
      <Popup
        show={isPopup}
        onClose={() => setPopupOpen(false)}
        object={response}
      />
    </div>
  );
};

export default GioHangTable;
