import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import visibility from "./image/visibility.png";
import visibility_off from "./image/visibility_off.png";

export default function DangKi() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [responseErrorEmail, setResponseErrorEmail] = useState("");
  const [responseDangKi, setResponseDangKi] = useState();

  const [fillUserName, setFillUserName] = useState(true);
  const [fillPassword, setFillPassword] = useState(true);
  const [fillFirstName, setFillFirstName] = useState(true);
  const [fillLastName, setFillLastName] = useState(true);
  const [fillEmail, setFillEmail] = useState(true);
  const [fillAddress, setFillAddress] = useState(true);
  const [fillPhoneNumber, setFillPhoneNumber] = useState(true);
  const [fillCode, setFillCode] = useState(true);

  //   const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleClickBtnSendCode = () => {
    setFillEmail(email === "" ? false : true);
    console.log(email);
    if (fillEmail) {
      // call api
      fetch(`/api/auth/send-code?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
          } else if (res.status === 204) {
            setResponseErrorEmail(
              "Đã gửi mã về email này! Vui lòng kiểm tra lại."
            );
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };

  const handleClickBtnDangKi = () => {
    console.log("call api");
    setFillFirstName(firstName === "" ? false : true);
    setFillLastName(lastName === "" ? false : true);
    setFillUserName(userName === "" ? false : true);
    setFillPassword(password === "" ? false : true);
    setFillEmail(email === "" ? false : true);
    setFillAddress(address === "" ? false : true);
    setFillPhoneNumber(phoneNumber === "" ? false : true);
    setFillCode(code === "" ? false : true);
    // console.log(userName);
    // console.log(password);
    if (
      fillFirstName &&
      fillLastName &&
      fillUserName &&
      fillPassword &&
      fillEmail & fillAddress &&
      fillPhoneNumber &&
      fillCode
    ) {
      fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          address: address,
          phoneNumber: phoneNumber,
          roleId: 3,
          userName: userName,
          password: password,
          status: 1,
          code: code,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              console.log(data.value);
              setResponseDangKi(data);
            });
          } else if (res.status === 409) {
            res.json().then((data) => {
              setResponseDangKi(data);
              console.log(data.tag);
              console.log(data.value);
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center bg-gray-100 py-16">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Đăng kí</h2>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Họ
            </label>
            <input
              type="text"
              defaultValue={firstName}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
              placeholder="Họ"
              onChange={(e) => {
                setFirstName(e.target.value);
                setFillFirstName(true);
              }}
              required
            />
            {!fillFirstName && (
              <h2 className="text-red-500">Vui lòng nhập họ</h2>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Tên
            </label>
            <input
              type="text"
              defaultValue={lastName}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
              placeholder="Tên"
              onChange={(e) => {
                setLastName(e.target.value);
                setFillLastName(true);
              }}
            />
            {!fillLastName && (
              <h2 className="text-red-500">Vui lòng nhập tên</h2>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              defaultValue={address}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
              placeholder="Địa chỉ"
              onChange={(e) => {
                setAddress(e.target.value);
                setFillAddress(true);
              }}
            />
            {!fillAddress && (
              <h2 className="text-red-500">Vui lòng nhập địa chỉ</h2>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              defaultValue={phoneNumber}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
              placeholder="Số điện thoại"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setFillPhoneNumber(true);
              }}
            />
            {!fillPhoneNumber && (
              <h2 className="text-red-500">Vui lòng nhập số điện thoại</h2>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              defaultValue={userName}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
              placeholder="Nhập tên đăng nhập"
              onChange={(e) => {
                setUserName(e.target.value);
                setFillUserName(true);
                setResponseDangKi(null);
              }}
            />
            {!fillUserName && (
              <h2 className="text-red-500">Vui lòng nhập tên đăng nhập</h2>
            )}
            {responseDangKi &&
              responseDangKi.tag === "ErrorUserName" &&
              fillUserName && (
                <h2 className="text-red-500">{responseDangKi.value}</h2>
              )}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Email
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                defaultValue={email}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFillEmail(true);
                  setResponseErrorEmail(null);
                  setResponseDangKi(null);
                }}
              />
              <button
                type="button"
                className="whitespace-nowrap ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleClickBtnSendCode}
              >
                Gửi mã
              </button>
            </div>
            {!fillEmail && (
              <h2 className="text-red-500">Vui lòng nhập email</h2>
            )}
            {responseErrorEmail && fillEmail && !responseDangKi && (
              <h2 className="text-red-500">{responseErrorEmail}</h2>
            )}
            {responseDangKi &&
              responseDangKi.tag === "ErrorEmail" &&
              fillEmail && (
                <h2 className="text-red-500">{responseDangKi.value}</h2>
              )}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Mã xác nhận
            </label>
            <input
              type="text"
              defaultValue={code}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
              placeholder="Mã xác nhận"
              onChange={(e) => {
                setCode(e.target.value);
                setFillCode(true);
                setResponseDangKi(null);
              }}
            />
            {!fillCode && (
              <h2 className="text-red-500">Vui lòng nhập mã xác nhận</h2>
            )}
            {responseDangKi &&
              responseDangKi.tag === "ErrorCode" &&
              fillCode && (
                <h2 className="text-red-500">{responseDangKi.value}</h2>
              )}
          </div>
          <div className="mb-3 relative">
            <label className="block text-gray-700 text-sm font-bold mb-1">
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
            {!fillPassword && (
              <h2 className="text-red-500">Vui lòng nhập mật khẩu</h2>
            )}
            {responseDangKi && responseDangKi.tag === "CreateAccountOk" && (
              <h2 className="text-blue-500">{responseDangKi.value}</h2>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleClickBtnDangKi}
            >
              Đăng kí
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
