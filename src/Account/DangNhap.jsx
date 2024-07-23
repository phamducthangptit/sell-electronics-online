import React, { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import visibility from "../image/visibility.png";
import visibility_off from "../image/visibility_off.png";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function DangNhap() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [responseLogin, setResponseLogin] = useState();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleClickBtnDangNhap = () => {
    // console.log(userName);
    // console.log(password);
    fetch(`/api/auth-service/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            localStorage.setItem("username", userName);
            localStorage.setItem("token", data.value);
            const decoded = jwtDecode(data.value);
            const role = decoded.role;
            if (role === "ADMIN") {
              navigate("/quan-li-doanh-thu");
            }
            if (role === "EMPLOYEE") {
              navigate("/quan-li-don-hang");
            }
            if (role === "GUEST") {
              navigate("/");
            }
          });
        } else if (res.status === 401) {
          res.json().then((data) => {
            setResponseLogin(data);
          });
        } else if (res.status === 400) {
          res.json().then((data) => {
            setResponseLogin(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
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
              onChange={(e) => {
                setUserName(e.target.value);
                setResponseLogin(null);
              }}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setResponseLogin(null);
                }}
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
            {responseLogin && responseLogin.tag === "ErrorLogin" && (
              <h2 className="text-red-500">{responseLogin.value}</h2>
            )}
            {responseLogin && responseLogin.tag === "ErrorStatus" && (
              <h2 className="text-red-500">{responseLogin.value}</h2>
            )}
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
