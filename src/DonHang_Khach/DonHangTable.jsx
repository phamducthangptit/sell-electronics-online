import detail from "../image/detail.png";
import invoice from "../image/invoice.svg";
import { useNavigate } from "react-router-dom";
const DonHangTable = ({ data, setData }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const handleClickXemChiTietDonHang = (order) => {
    navigate("/chi-tiet-don-hang", { state: { order: order } });
  };
  const handleConfirmOrder = async (orderId) => {
    try {
      fetch(`api/product-service/guest/order/update-status-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            const updatedData = data.map((order) =>
              order.orderId === orderId
                ? {
                    ...order,
                    checkStatus: 0,
                    status: "Hoàn thành",
                    statusPayment: 1,
                  }
                : order
            );
            setData(updatedData);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };
  return (
    <div className="container mx-auto mt-2 pl-4 pr-4 mb-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border border-gray-200">STT</th>
            <th className="px-4 py-2 border border-gray-200">Ngày đặt</th>
            <th className="px-4 py-2 border border-gray-200">Số sản phẩm</th>
            <th className="px-4 py-2 border border-gray-200">
              Giá trị đơn hàng
            </th>
            <th className="px-4 py-2 border border-gray-200">
              Địa chỉ nhận hàng
            </th>
            <th className="px-4 py-2 border border-gray-200">SDT</th>
            <th className="px-4 py-2 border border-gray-200">
              Trạng thái thanh toán
            </th>
            <th className="px-4 py-2 border border-gray-200">Trạng thái</th>
            <th className="px-4 py-2 border border-gray-200">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  {index + 1}
                </div>
              </td>
              <td className="border px-4 py-2 text-center">
                {order.orderDate}
              </td>
              <td className="border px-4 py-2 text-center">
                {order.totalProduct}
              </td>
              <td className="border px-4 py-2 text-center">
                {order.totalAmountPaid}
              </td>
              <td className="border px-4 py-2">{order.address}</td>
              <td className="border px-4 py-2">{order.phone}</td>
              <td className="border px-4 py-2">
                {order.statusPayment === 1
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  <img
                    src={detail}
                    alt=""
                    className="w-9 cursor-pointer"
                    onClick={() => handleClickXemChiTietDonHang(order)}
                  />
                </div>
                {order.checkStatusInvoice === 1 && (
                  <div className="flex justify-center items-center">
                    <img
                      src={invoice}
                      alt=""
                      className="w-7 cursor-pointer mt-4"
                    />
                  </div>
                )}
                {order.checkStatus === 1 && (
                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline whitespace-nowrap"
                      onClick={() => handleConfirmOrder(order.orderId)}
                    >
                      Đã nhận hàng
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DonHangTable;
