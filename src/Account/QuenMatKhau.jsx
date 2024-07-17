import Header from "../Header";
import Footer from "../Footer";
import { useState } from "react";
import visibility from "../image/visibility.png";
import visibility_off from "../image/visibility_off.png";

export default function QuenMatKhau() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordNewVisible, setPasswordNewVisible] = useState(false);
  const [fillEmail, setFillEmail] = useState(true);
  const [fillUserName, setFillUserName] = useState(true);
  const [fillPasswordNew, setFillPasswordNew] = useState(true);
  const togglePasswordNewVisibility = () => {
    setPasswordNewVisible(!passwordNewVisible);
  };

  const [resetPasswordOk, setResetPasswordOk] = useState(null);
  const [resetPasswordError, setResetPasswordError] = useState(null);
  const handleClickDatLaiMK = () => {
    if (email !== "") setFillEmail(true);
    else setFillEmail(false);
    if (userName !== "") setFillUserName(true);
    else setFillUserName(false);
    if (passwordNew !== "") setFillPasswordNew(true);
    else setFillPasswordNew(false);
    // console.log(email);
    // console.log(userName);
    // console.log(passwordNew);
    if (email !== "" && userName !== "" && passwordNew !== "") {
      console.log("abc");
      fetch(`/api/information-service/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          email: email,
          newPassword: passwordNew,
        }),
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setResetPasswordOk(data);
            console.log(data);
          });
        } else {
          res.json().then((data) => {
            setResetPasswordError(data);
            console.log(data);
          });
        }
      });
    }
  };
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center bg-gray-100 py-16">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h2>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Email
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
                placeholder="Nhập email đã đăng kí"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value !== "") setFillEmail(true);
                  else setFillEmail(false);
                  setResetPasswordOk(null);
                  setResetPasswordError(null);
                }}
              />
            </div>
            {!fillEmail && <h2 className="text-red-500">Nhập email</h2>}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Tên đăng nhập
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={userName}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
                placeholder="Nhập tên đăng nhập"
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (e.target.value !== "") setFillUserName(true);
                  else setFillUserName(false);
                  setResetPasswordOk(null);
                  setResetPasswordError(null);
                }}
              />
            </div>
            {!fillUserName && (
              <h2 className="text-red-500">Nhập tên đăng nhập</h2>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Mật khẩu mới
            </label>
            <div className="relative flex items-center">
              <input
                type={passwordNewVisible ? "text" : "password"}
                value={passwordNew}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
                placeholder="Nhập mật khẩu"
                onChange={(e) => {
                  setPasswordNew(e.target.value);
                  if (e.target.value !== "") setFillPasswordNew(true);
                  else setFillPasswordNew(false);
                  setResetPasswordOk(null);
                  setResetPasswordError(null);
                }}
              />
              <button
                type="button"
                onClick={togglePasswordNewVisibility}
                className="absolute right-0 pr-3 flex items-center text-sm leading-5"
              >
                {passwordNewVisible ? (
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
            {!fillPasswordNew && (
              <h2 className="text-red-500">Nhập mật khẩu mới</h2>
            )}
            {resetPasswordOk && (
              <h2 className="text-red-500">{resetPasswordOk.value}</h2>
            )}
            {resetPasswordError && (
              <h2 className="text-red-500">{resetPasswordError.value}</h2>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleClickDatLaiMK}
            >
              Đặt lại mật khẩu
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
