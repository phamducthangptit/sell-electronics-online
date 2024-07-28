import { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import NavBar from "../NavBar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DonHangDetail = () => {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username");
  const location = useLocation();
  const [cartCountTmp, setCartCountTmp] = useState(null);
  const [orderDetail, setOrderDetail] = useState([]);
  const navigate = useNavigate();
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
    fetch(
      `api/product-service/guest/order/get-detail-order?order-id=${location.state.order.orderId}`,
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
            setOrderDetail(data);
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [location.state, token]);
  const handleCliCkReview = (orderDetail) => {
    const product = {
      productId: orderDetail.productId,
      image: orderDetail.image,
      activeReview: true,
      orderId: location.state.order.orderId,
    };
    navigate("/chi-tiet-san-pham", { state: { product: product } });
  };
  return (
    <div>
      <Header cartCount={cartCountTmp && cartCountTmp.value} />
      <NavBar />
      <div className="container mx-auto mt-2 pl-4 pr-4 mb-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-2 border border-gray-200">STT</th>
              <th className="px-4 py-2 border border-gray-200">Ảnh</th>
              <th className="px-4 py-2 border border-gray-200">Số sản phẩm</th>
              <th className="px-4 py-2 border border-gray-200">Giá</th>
              <th className="px-4 py-2 border border-gray-200">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {orderDetail.map((detail, index) => (
              <tr key={index} className="even:bg-gray-100">
                <td className="border px-4 py-2">
                  <div className="flex justify-center items-center">
                    {index + 1}
                  </div>
                </td>
                <td className="border px-4 py-2">
                  <div className="flex justify-center items-center">
                    <img src={detail.image} alt="" className="w-20 h-20" />
                  </div>
                </td>
                <td className="border px-4 py-2 text-center">{detail.stock}</td>
                <td className="border px-4 py-2">{detail.price}</td>
                <td className="border px-4 py-2">
                  {detail.checkReview === 1 && (
                    <div className="flex justify-center mt-4">
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => handleCliCkReview(detail)}
                      >
                        Đánh giá
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};
export default DonHangDetail;
