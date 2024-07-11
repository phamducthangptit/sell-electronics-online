import React, { useState, useEffect } from "react";

const Popup = ({ show, onClose, item, onSave }) => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    country: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        country: item.country || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // console.log("item id " + item.manufacturerId);
    fetch(`api/product/manufacturer/update-manufacturer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        manufacturerId: item.manufacturerId,
        name: formData.name,
        country: formData.country,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          onSave(formData); // lưu thành công
          onClose();
        } else if (res.status === 400) {
          console.log("bug");
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
            <label className="block text-blue-700">Tên nhà sản xuất: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-blue-700">Quốc gia:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
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
