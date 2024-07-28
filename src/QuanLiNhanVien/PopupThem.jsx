import React, { useEffect, useState } from "react";

const Popup = ({ show, onClose, onSave }) => {
  const token = localStorage.getItem("token");
  const [responseAddEmployee, setResponseAddEmployee] = useState();
  const [fillFirstName, setFillFirstName] = useState(true);
  const [fillLastName, setFillLastName] = useState(true);
  const [fillEmail, setFillEmail] = useState(true);
  const [fillAddress, setFillAddress] = useState(true);
  const [fillPhone, setFillPhone] = useState(true);
  const [fillUserName, setFillUserName] = useState(true);
  const [fillPassword, setFillPassword] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    username: "",
    password: "",
    status: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      responseAddEmployee &&
      name === "email" &&
      responseAddEmployee.tag === "ErrorEmail"
    )
      setResponseAddEmployee(null);
    if (
      responseAddEmployee &&
      name === "username" &&
      responseAddEmployee.tag === "ErrorUserName"
    )
      setResponseAddEmployee(null);

    if (name === "firstName") {
      if (value.trim() !== "") setFillFirstName(true);
      else setFillFirstName(false);
    }

    if (name === "lastName") {
      if (value.trim() !== "") setFillLastName(true);
      else setFillLastName(false);
    }

    if (name === "email") {
      if (value.trim() !== "") setFillEmail(true);
      else setFillEmail(false);
    }

    if (name === "address") {
      if (value.trim() !== "") setFillAddress(true);
      else setFillAddress(false);
    }

    if (name === "phoneNumber") {
      if (value.trim() !== "") setFillPhone(true);
      else setFillPhone(false);
    }

    if (name === "username") {
      if (value.trim() !== "") setFillUserName(true);
      else setFillUserName(false);
    }

    if (name === "password") {
      if (value.trim() !== "") setFillPassword(true);
      else setFillPassword(false);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    //call Api
    formData.firstName.trim() !== ""
      ? setFillFirstName(true)
      : setFillFirstName(false);
    formData.lastName.trim() !== ""
      ? setFillLastName(true)
      : setFillLastName(false);
    formData.email.trim() !== "" ? setFillEmail(true) : setFillEmail(false);
    formData.address.trim() !== ""
      ? setFillAddress(true)
      : setFillAddress(false);
    formData.phoneNumber.trim() !== ""
      ? setFillPhone(true)
      : setFillPhone(false);
    formData.username.trim() !== ""
      ? setFillUserName(true)
      : setFillUserName(false);
    formData.password.trim() !== ""
      ? setFillPassword(true)
      : setFillPassword(false);

    if (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.phoneNumber.trim() !== "" &&
      formData.username.trim() !== "" &&
      formData.password.trim() !== ""
    ) {
      fetch(`api/information-service/admin/add-employee`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastName: formData.lastName,
          firstName: formData.firstName,
          email: formData.email,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          roleId: 2,
          userName: formData.username,
          password: formData.password,
          status: 1,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            onSave(formData); // lưu thành công
            onClose();
            res.json().then((data) => {
              setResponseAddEmployee(data);
            });
          } else if (res.status === 409) {
            res.json().then((data) => {
              setResponseAddEmployee(data);
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };
  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      phoneNumber: "",
      username: "",
      password: "",
    });
    onClose();
  };
  useEffect(() => {
    setFillFirstName(true);
    setFillLastName(true);
    setFillAddress(true);
    setFillEmail(true);
    setFillPhone(true);
    setFillUserName(true);
    setFillPassword(true);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>
      <div className="bg-blue-50 rounded-lg shadow-lg p-6 z-10 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">Thêm nhân viên</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-blue-700">Họ:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            {!fillFirstName && (
              <h2 className="text-red-500">Vui lòng nhập họ</h2>
            )}
          </div>
          <div>
            <label className="block text-blue-700">Tên:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            {!fillLastName && (
              <h2 className="text-red-500">Vui lòng nhập tên</h2>
            )}
          </div>
          <div>
            <label className="block text-blue-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            {!fillEmail && (
              <h2 className="text-red-500">Vui lòng nhập email</h2>
            )}
            {responseAddEmployee &&
              responseAddEmployee.tag === "ErrorEmail" && (
                <h2 className="text-red-500">{responseAddEmployee.value}</h2>
              )}
          </div>
          <div>
            <label className="block text-blue-700">Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            {!fillAddress && (
              <h2 className="text-red-500">Vui lòng nhập địa chỉ</h2>
            )}
          </div>
          <div>
            <label className="block text-blue-700">SĐT:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            {!fillPhone && (
              <h2 className="text-red-500">Vui lòng nhập số điện thoại</h2>
            )}
          </div>
          <div>
            <label className="block text-blue-700">Tên đăng nhâp:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            {!fillUserName && (
              <h2 className="text-red-500">Vui lòng nhập tên đăng nhập</h2>
            )}
            {responseAddEmployee &&
              responseAddEmployee.tag === "ErrorUserName" && (
                <h2 className="text-red-500">{responseAddEmployee.value}</h2>
              )}
          </div>
          <div>
            <label className="block text-blue-700">Mật khẩu:</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            {!fillPassword && (
              <h2 className="text-red-500">Vui lòng nhập mật khẩu</h2>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
