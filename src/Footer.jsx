import shipping from "./image/shipping.png";
import payment from "./image/payment.png";
import support from "./image/support.png";
import paymentcard from "./image/paymentcard.png";
export default function Footer() {
  return (
    <div>
      <div className="bg-white border-solid p-4 md:p-6 flex items-center justify-between flex-wrap">
        <img
          src={shipping}
          alt=""
          className="w-16 h-auto mb-4 md:mb-0 md:mr-1 flex-shrink-0 cursor-pointer"
        />
        <div className="flex flex-col">
          <p className="text-lg font-bold mb-1">Miễn phí vận chuyển</p>
          <p className="text-sm text-gray-600">
            Miễn phí vận chuyển cho mọi đơn hàng
          </p>
        </div>
        <img
          src={payment}
          alt=""
          className="w-16 h-auto mb-4 md:mb-0 md:mr-1 flex-shrink-0 cursor-pointer"
        />
        <div className="flex flex-col">
          <p className="text-lg font-bold mb-1">Hoàn tiền</p>
          <p className="text-sm text-gray-600">
            Đảm bảo hoàn tiền trong vòng 7 ngày.
          </p>
        </div>
        <img
          src={support}
          alt=""
          className="w-16 h-auto mb-4 md:mb-0 md:mr-1 flex-shrink-0 cursor-pointer"
        />
        <div className="flex flex-col">
          <p className="text-lg font-bold mb-1">Hỗ trợ 24/7</p>
          <p className="text-sm text-gray-600">Hỗ trợ Online 24/7</p>
        </div>
        <img
          src={paymentcard}
          alt=""
          className="w-16 h-auto mb-4 md:mb-0 md:mr-1 flex-shrink-0 cursor-pointer"
        />
        <div className="flex flex-col">
          <p className="text-lg font-bold mb-1">Thanh toán</p>
          <p className="text-sm text-gray-600">
            Thông tin thanh toán được bảo mật 100%
          </p>
        </div>
      </div>
    </div>
  );
}
