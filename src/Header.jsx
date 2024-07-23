import logo from "./image/logo.png";
import account from "./image/account.png";
import cart from "./image/cart.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
export default function Header({ cartCount }) {
  const [userName, setUserName] = useState();
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    setUserName(localStorage.getItem("username"));
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token đã hết hạn
          localStorage.removeItem("token");
        } else {
          setRole(decoded.role);
          // console.log(decoded);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, [token]);

  const handleClickDangNhap = () => {
    navigate("/dang-nhap");
  };
  const handleClickDangKi = () => {
    navigate("/dang-ki");
  };
  const handleClickDangXuat = () => {
    window.location = "/"; // set return home
    localStorage.clear();
  };
  const handleClickLogo = () => {
    navigate("/");
  };
  const handelClickDoiMatKhau = () => {
    navigate("/doi-mat-khau");
  };
  const handleClickCart = () => {
    navigate("/gio-hang");
  };
  return (
    <div>
      <div className="bg-black border-solid p-2 pr-6 flex items-center justify-end space-x-4">
        {token === null && (
          <h2
            className="text-white cursor-pointer"
            onClick={handleClickDangNhap}
          >
            Đăng nhập
          </h2>
        )}
        {token === null && (
          <h2 className="text-white cursor-pointer" onClick={handleClickDangKi}>
            Đăng kí
          </h2>
        )}
        {token && (
          <h2
            className="text-white cursor-pointer"
            onClick={handelClickDoiMatKhau}
          >
            Đổi mật khẩu
          </h2>
        )}

        {token && (
          <h2
            className="text-white cursor-pointer"
            onClick={handleClickDangXuat}
          >
            Đăng xuất
          </h2>
        )}
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
            <h1 className="cursor-pointer">{userName}</h1>
          </div>
          {role === "GUEST" && (
            <div className="relative cursor-pointer">
              <img
                src={cart}
                alt=""
                className="w-9"
                onClick={handleClickCart}
              />
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {cartCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
