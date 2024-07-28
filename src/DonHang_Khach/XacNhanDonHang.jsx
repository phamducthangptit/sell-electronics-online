import Header from "../Header";
import Footer from "../Footer";
import NavBar from "../NavBar";
import defaultproduct from "../image/defaultproduct.jpg";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const XacNhanDonHang = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username");
  const [cartCountTmp, setCartCountTmp] = useState(null);
  const location = useLocation();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [fillName, setFillName] = useState(true);
  const [fillAddress, setFillAddress] = useState(true);
  const [fillPhone, setFillPhone] = useState(true);
  // State để lưu phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (value.trim() === "") setFillName(false);
      else setFillName(true);
    }
    if (name === "address") {
      if (value.trim() === "") setFillAddress(false);
      else setFillAddress(true);
    }
    if (name === "phone") {
      if (value.trim() === "") setFillPhone(false);
      else setFillPhone(true);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  const formatCurrency = (value) => {
    return value
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      .replace("₫", "VNĐ");
  };
  const totalAmount = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  useEffect(() => {
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
            setCartCountTmp(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token, userName]);
  useEffect(() => {
    setSelectedProducts(location.state.selectedProducts);
  }, [location.state]);
  const handleClickDatHang = () => {
    if (formData.name.trim() === "") setFillName(false);
    if (formData.address.trim() === "") setFillAddress(false);
    if (formData.phone.trim() === "") setFillPhone(false);
    if (
      formData.name.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.phone.trim() !== ""
    ) {
      fetch(`api/product-service/guest/order/add-new-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listProducts: selectedProducts,
          name: formData.name,
          userName: userName,
          address: formData.address,
          phone: formData.phone,
          totalAmount: totalAmount,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              if (paymentMethod !== "cod") {
                fetch(`api/product-service/guest/payment/create-payment`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    orderId: data.value,
                    amount: totalAmount,
                  }),
                })
                  .then((res) => {
                    if (res.status === 200) {
                      res.json().then((data) => {
                        window.location.href = data.url;
                      });
                    }
                  })
                  .catch((error) => {
                    console.error("Lỗi khi gọi API:", error);
                  });
              } else navigate("/don-hang");
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };
  return (
    <div>
      <Header cartCount={cartCountTmp && cartCountTmp.value} />
      <NavBar />
      <div className="flex h-auto mt-5">
        {/* Tóm tắt sản phẩm */}
        <div className="flex-1 p-4 border-r border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Tóm tắt đơn hàng</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 border border-gray-200">Ảnh</th>
                <th className="px-4 py-2 border border-gray-200">
                  Tên sản phẩm
                </th>
                <th className="px-4 py-2 border border-gray-200">Giá</th>
                <th className="px-4 py-2 border border-gray-200">Số lượng</th>
                <th className="px-4 py-2 border border-gray-200">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, index) => (
                <tr key={index} className="even:bg-gray-100">
                  <td className="border px-4 py-2">
                    <img
                      src={product.image ? product.image : defaultproduct}
                      alt={product.name}
                      className="w-24 h-24 object-cover"
                    />
                  </td>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {product.quantity}
                  </td>
                  <td className="border px-4 py-2">
                    {formatCurrency(product.quantity * product.price)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100">
                <td colSpan="4" className="text-right px-4 py-2 font-bold">
                  Tổng tiền
                </td>
                <td className="border px-4 py-2 font-bold">
                  {formatCurrency(totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Thông tin cần điền */}
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold mb-4">Thông tin người nhận hàng</h2>
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {!fillName && (
              <h2 className="text-red-500">Vui lòng nhập tên người nhận</h2>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-gray-700">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {!fillAddress && (
              <h2 className="text-red-500">Vui lòng nhập địa chỉ người nhận</h2>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {!fillPhone && (
              <h2 className="text-red-500">
                Vui lòng nhập số điện thoại người nhận
              </h2>
            )}
          </div>
          <div>
            <label htmlFor="payment-method" className="block text-gray-700">
              Phương thức thanh toán
            </label>
            <select
              id="payment-method"
              name="payment-method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="cod">Ship COD</option>
              <option value="online">Thanh toán online</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            onClick={handleClickDatHang}
          >
            Xác nhận đặt hàng
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default XacNhanDonHang;
