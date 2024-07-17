import React, { useState, useEffect } from "react";

const Popup = ({ show, onClose, item, onSave }) => {
  const token = localStorage.getItem("token");
  const [errorEmail, setErrorEmail] = useState();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        email: item.email || "",
        address: item.address || "",
        phoneNumber: item.phoneNumber || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setErrorEmail(null);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    fetch(`api/information-service/admin/update-information-employee`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.userId,
        lastName: formData.lastName,
        firstName: formData.firstName,
        email: formData.email,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          onSave(formData); // lưu thành công
          onClose();
        } else if (res.status === 400) {
          res.json().then((data) => {
            setErrorEmail(data.value);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-blue-50 rounded-lg shadow-lg p-6 z-10 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">
            Chỉnh sửa thông tin
          </h2>
          <button
            onClick={onClose}
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
            {errorEmail && <h2 className="text-red-500">{errorEmail}</h2>}
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
