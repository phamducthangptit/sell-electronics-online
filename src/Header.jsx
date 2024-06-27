import logo from "./image/logo.png";
import account from "./image/account.png";
import cart from "./image/cart.png";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
  const navigate = useNavigate();
  const handleClickDangNhap = () => {
    // alert("hello");
    navigate("/dang-nhap");
  };
  const handleClickDangKi = () => {
    // alert("hello dang ki");
    navigate("/dang-ki");
  };
  const handleClickDangXuat = () => {
    alert("hello dang xuat");
  };
  const handleClickLogo = () => {
    navigate("/");
  };
  return (
    <div>
      <div className="bg-black border-solid p-2 pr-6 flex items-center justify-end space-x-4">
        <h2 className="text-white cursor-pointer" onClick={handleClickDangNhap}>
          Đăng nhập
        </h2>
        <h2 className="text-white cursor-pointer" onClick={handleClickDangKi}>
          Đăng kí
        </h2>
        <h2 className="text-white cursor-pointer" onClick={handleClickDangXuat}>
          Đăng xuất
        </h2>
      </div>

      <div className="bg-white border-solid p-4 md:p-6 flex items-center justify-between flex-wrap">
        <img
          src={logo}
          alt=""
          className="w-40 h-auto mb-4 md:mb-0 md:mr-8 flex-shrink-0 cursor-pointer"
          onClick={handleClickLogo}
        />
        <form className="flex items-center border-2 border-blue-500 rounded overflow-hidden flex-grow max-w-lg mb-4 md:mb-0 md:ml-8">
          <select className="border-none p-2 bg-gray-100 text-gray-700 focus:outline-none flex-grow">
            <option value="all-categories">All Categories</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
          <input
            type="text"
            placeholder="Search for products"
            className="flex-grow border-none p-2 bg-gray-100 text-gray-700 focus:outline-none w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 whitespace-nowrap"
          >
            Tìm kiếm
          </button>
        </form>
        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <img src={account} alt="" className="w-9" />
            <h1 className="cursor-pointer">Duc Thang Pham</h1>
          </div>
          <div className="cursor-pointer">
            <img src={cart} alt="" className="w-9" />
          </div>
        </div>
      </div>
    </div>
  );
}
