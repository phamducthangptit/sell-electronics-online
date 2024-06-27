import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import visibility from "./image/visibility.png";
import visibility_off from "./image/visibility_off.png";
import { useNavigate } from "react-router-dom";

export default function DangNhap() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleClickBtnDangNhap = () => {
    console.log(userName);
    console.log(password);
  };

  const handleClickQuenMatKhau = () => {
    navigate("/quen-mat-khau");
  };

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center bg-gray-100 py-16">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
          <div className="mb-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="username"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              defaultValue={userName}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
              placeholder="Nhập tên đăng nhập"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-3 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <div className="relative flex items-center">
              <input
                type={passwordVisible ? "text" : "password"}
                defaultValue={password}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
                placeholder="Nhập mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0 pr-3 flex items-center text-sm leading-5"
              >
                {passwordVisible ? (
                  <img
                    src={visibility}
                    className="h-5 w-5 text-gray-500"
                    alt=""
                  />
                ) : (
                  <img
                    src={visibility_off}
                    className="h-5 w-5 text-gray-500"
                    alt=""
                  />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleClickBtnDangNhap}
            >
              Đăng nhập
            </button>
            <h3
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
              onClick={handleClickQuenMatKhau}
            >
              Quên mật khẩu?
            </h3>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
