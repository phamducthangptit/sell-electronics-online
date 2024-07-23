const OrderTable = ({ data, setOrderData }) => {
  const token = localStorage.getItem("token");
  const handleConfirmOrder = async (orderId) => {
    try {
      // Gọi API để cập nhật trạng thái đơn hàng
      fetch(`api/product-service/employee/order/update-status-order`, {
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
            const updatedOrders = data.filter(
              (order) => order.orderId !== orderId
            );
            setOrderData(updatedOrders);
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
    <div className="container mx-auto mt-2 pl-4 pr-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border border-gray-200">STT</th>
            <th className="px-4 py-2 border border-gray-200">Sản phẩm </th>
            <th className="px-4 py-2 border border-gray-200">Tổng tiền</th>
            <th className="px-4 py-2 border border-gray-200">Ngày đặt</th>
            <th className="px-4 py-2 border border-gray-200">Tên người nhận</th>
            <th className="px-4 py-2 border border-gray-200">
              Địa chỉ nhận hàng
            </th>
            <th className="px-4 py-2 border border-gray-200">SDT</th>
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
              <td className="border px-4 py-2">
                <div>
                  {order.listProducts.map((product, idx) => (
                    <div
                      key={product.productId}
                      className="flex items-center mb-2 border-b pb-2 last:border-none"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover mr-2"
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-gray-600">Giá: {product.price}</p>
                        <p className="text-gray-600">
                          Số lượng: {product.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
              <td className="border px-4 py-2">{order.totalAmountPaid}</td>
              <td className="border px-4 py-2">{order.orderDate}</td>
              <td className="border px-4 py-2">{order.consigneeName}</td>
              <td className="border px-4 py-2">{order.address}</td>
              <td className="border px-4 py-2">{order.phone}</td>
              <td className="border px-4 py-2">
                {order.checkStatus === 1 && (
                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleConfirmOrder(order.orderId)}
                    >
                      Xác nhận đơn
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
export default OrderTable;
