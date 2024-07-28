import logo from "./image/logo.png";
import account from "./image/account.png";
import cart from "./image/cart.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Popup from "./Account/PopupThongTinCaNhan";
export default function Header({ cartCount, onSearch }) {
  const [userName, setUserName] = useState();
  const [role, setRole] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    if (role === "GUEST") {
      navigate("/");
    }
    if (role === "EMPLOYEE") navigate("/quan-li-don-hang");
    if (role === "ADMIN") navigate("/quan-li-nhan-vien");
  };
  const handelClickDoiMatKhau = () => {
    navigate("/doi-mat-khau");
  };
  const handleClickCart = () => {
    navigate("/gio-hang");
  };
  const handleClickThongTinCaNhan = () => {
    if (userName !== null) {
      setPopupOpen(!isPopupOpen);
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
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
        {role !== "EMPLOYEE" && role !== "ADMIN" && (
          <form
            className="flex items-center border-2 border-blue-500 rounded overflow-hidden flex-grow max-w-lg mb-4 md:mb-0 md:ml-8"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm"
              className="flex-grow border-none p-2 bg-gray-100 text-gray-700 focus:outline-none w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 whitespace-nowrap"
            >
              Tìm kiếm
            </button>
          </form>
        )}
        <div className="flex items-center">
          <div
            className="mr-4 flex items-center"
            onClick={() => handleClickThongTinCaNhan()}
          >
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
      <Popup
        show={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        item={userName}
      />
    </div>
  );
}
