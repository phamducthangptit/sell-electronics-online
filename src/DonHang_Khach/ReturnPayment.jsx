import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Return() {
  const navigate = useNavigate();
  const [urlParams, setUrlParams] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUrlParams(params);
  }, []);

  if (!urlParams) {
    return null;
  }

  const vnp_Amount = urlParams.get("vnp_Amount");
  const vnp_BankCode = urlParams.get("vnp_BankCode");
  const vnp_CardType = urlParams.get("vnp_CardType");
  const vnp_OrderInfo = urlParams.get("vnp_OrderInfo");
  const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
  const vnp_TransactionNo = urlParams.get("vnp_TransactionNo");

  if (vnp_ResponseCode === "00" && urlParams) {
    const orderIdMatch = vnp_OrderInfo.match(
      /\[Thanh toan tien hang DH(\d+)\]/
    );
    const orderId = orderIdMatch ? orderIdMatch[1] : null;

    fetch(`/api/product-service/guest/payment/update-status-payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  const amount = parseInt(vnp_Amount) / 100;
  const formattedAmount = amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const handleClickDonHang = () => {
    navigate("/don-hang");
  };

  return (
    <div className="container mx-auto py-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">VNPAY RETURN</h1>
      </div>
      <div className="bg-white shadow-md rounded p-4">
        <h3 className="text-lg font-semibold">Thành tiền: {formattedAmount}</h3>
        <h3 className="text-lg font-semibold">
          Nội dung thanh toán: {vnp_OrderInfo}
        </h3>
        <h3 className="text-lg font-semibold">
          Ngân hàng giao dịch: {vnp_BankCode}
        </h3>
        <h3 className="text-lg font-semibold">
          Mã giao dịch: {vnp_TransactionNo}
        </h3>
        <h3 className="text-lg font-semibold">
          Loại giao dịch: {vnp_CardType}
        </h3>
        <h3 className="text-lg font-semibold">
          Trạng thái giao dịch:{" "}
          {vnp_ResponseCode === "00" ? "Thành công" : "Thất bại"}
        </h3>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleClickDonHang}
        >
          Đơn hàng
        </button>
      </div>
    </div>
  );
}
