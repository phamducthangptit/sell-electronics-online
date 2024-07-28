import { useEffect, useState } from "react";

const Popup = ({ show, onClose, item }) => {
  const token = localStorage.getItem("token");
  //   const [dataInformation, setDataInformation] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (show) {
      fetch(`api/information-service/user/get-information?user-name=${item}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              console.log(data);
              //   setDataInformation(data);
              setFormData({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                email: data.email || "",
                address: data.address || "",
                phoneNumber: data.phone || "",
              });
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  }, [token, show, item]);
  const handleClickSaveInfomation = () => {
    fetch(`api/information-service/user/update-information`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: item,
        lastName: formData.lastName,
        firstName: formData.firstName,
        email: formData.email,
        address: formData.address,
        phone: formData.phoneNumber,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          onClose();
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
          <h2 className="text-xl font-bold text-blue-700">Thông tin cá nhân</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-blue-700">Họ: </label>
            <input
              type="text"
              name="firstName"
              defaultValue={formData.firstName}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-blue-700">Tên:</label>
            <input
              type="text"
              name="lastName"
              defaultValue={formData.lastName}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-blue-700">Email:</label>
            <input
              type="email"
              name="email"
              defaultValue={formData.email}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-blue-700">Địa chỉ:</label>
            <input
              type="text"
              name="address"
              defaultValue={formData.address}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-blue-700">SĐT:</label>
            <input
              type="text"
              name="phoneNumber"
              defaultValue={formData.phoneNumber}
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleClickSaveInfomation}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
