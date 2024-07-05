import Header from "../Header";
import Footer from "../Footer";
import { useState } from "react";
import visibility from "../image/visibility.png";
import visibility_off from "../image/visibility_off.png";
import NavBar from "../NavBar";

export default function QuenMatKhau() {
  const userName = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [passwordOldVisible, setPasswordOldVisible] = useState(false);
  const [passwordNewVisible, setPasswordNewVisible] = useState(false);
  const [passwordNewRepeatVisible, setPasswordNewRepeatVisible] =
    useState(false);
  const [passwordOld, setPasswordOld] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordNewRepeat, setPasswordNewRepeat] = useState("");

  const [confirmPassword, setConfirmPassword] = useState(true);
  const [fillPasswordOld, setFillPasswordOld] = useState(true);
  const [fillPasswordNew, setFillPasswordNew] = useState(true);

  const [errorDoiMatKhau, setErrorDoiMatKhau] = useState("");
  const [okDoiMatKhau, setOkDoiMatKhau] = useState("");
  const togglePasswordOldVisibility = () => {
    setPasswordOldVisible(!passwordOldVisible);
  };
  const togglePasswordNewVisibility = () => {
    setPasswordNewVisible(!passwordNewVisible);
  };
  const togglePasswordNewRepeatVisibility = () => {
    setPasswordNewRepeatVisible(!passwordNewRepeatVisible);
  };
  const handleClickDoiMatKhau = () => {
    if (passwordOld === "") setFillPasswordOld(false);
    else setFillPasswordOld(true);
    if (passwordNew === "") setFillPasswordNew(false);
    else setFillPasswordNew(true);
    if (!passwordNewRepeat) setConfirmPassword(false);
    if (passwordOld !== "" && passwordNew !== "" && confirmPassword) {
      console.log("abc");
      fetch(`/api/information/user/change-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          oldPassword: passwordOld,
          newPassword: passwordNew,
        }),
      }).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setOkDoiMatKhau(data);
            console.log(data);
          });
        } else {
          res.json().then((data) => {
            setErrorDoiMatKhau(data);
            console.log(data);
          });
        }
      });
    }
  };
  return (
    <div>
      <Header />
      <NavBar />
      <div className="flex items-center justify-center bg-gray-100 py-16">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Đổi mật khẩu</h2>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Mật khẩu cũ
            </label>
            <div className="relative flex items-center">
              <input
                type={passwordOldVisible ? "text" : "password"}
                value={passwordOld}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
                placeholder="Nhập mật khẩu cũ"
                onChange={(e) => {
                  setPasswordOld(e.target.value);
                  if (e.target.value !== "") setFillPasswordOld(true);
                  else setFillPasswordOld(false);
                  setErrorDoiMatKhau(null);
                }}
              />
              <button
                type="button"
                onClick={togglePasswordOldVisibility}
                className="absolute right-0 pr-3 flex items-center text-sm leading-5"
              >
                {passwordOldVisible ? (
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
            {!fillPasswordOld && (
              <h2 className="text-red-500">Nhập mật khẩu cũ</h2>
            )}
            {errorDoiMatKhau && errorDoiMatKhau.tag === "ErrorOldPassword" && (
              <h2 className="text-red-500">{errorDoiMatKhau.value}</h2>
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
                placeholder="Nhập mật khẩu mới"
                onChange={(e) => {
                  setPasswordNew(e.target.value);
                  if (e.target.value !== "") setFillPasswordNew(true);
                  else setFillPasswordNew(false);
                  if (e.target.value !== passwordNewRepeat)
                    setConfirmPassword(false);
                  else setConfirmPassword(true);
                  setErrorDoiMatKhau(null);
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
            {errorDoiMatKhau &&
              errorDoiMatKhau.tag === "ErrorRepeatPassword" && (
                <h2 className="text-red-500">{errorDoiMatKhau.value}</h2>
              )}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Nhập lại mật khẩu mới
            </label>
            <div className="relative flex items-center">
              <input
                type={passwordNewRepeatVisible ? "text" : "password"}
                value={passwordNewRepeat}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:shadow-lg"
                placeholder="Nhập mật lại mật khẩu mới"
                onChange={(e) => {
                  setPasswordNewRepeat(e.target.value);
                  if (passwordNew !== e.target.value) {
                    setConfirmPassword(false);
                  } else setConfirmPassword(true);
                }}
              />
              <button
                type="button"
                onClick={togglePasswordNewRepeatVisibility}
                className="absolute right-0 pr-3 flex items-center text-sm leading-5"
              >
                {passwordNewRepeatVisible ? (
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
            {!confirmPassword && (
              <h2 className="text-red-500">Mật khẩu nhập lại chưa đúng</h2>
            )}
            {okDoiMatKhau && okDoiMatKhau.tag === "ChangePasswordOk" && (
              <h2 className="text-red-500">{okDoiMatKhau.value}</h2>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleClickDoiMatKhau}
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
