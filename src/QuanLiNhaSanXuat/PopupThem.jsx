import React, { useEffect, useState } from "react";
import storage from "../FirebaseImage/Config"; // Ensure this is correct path to your Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary methods from firebase/storage

const Popup = ({ show, onClose, onSave }) => {
  const [fillName, setFillName] = useState(false);
  const [fillCountry, setFillCountry] = useState(false);
  const token = localStorage.getItem("token");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setFillName(value !== "" ? true : false);
    if (name === "country") setFillCountry(value !== "" ? true : false);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (show) {
      setFormData({
        name: "",
        country: "",
      });
      setImageFile(null);
      setImagePreview(null);
    }
    setFillName(true);
    setFillCountry(true);
  }, [show]);

  const handleSave = async () => {
    setFillName(formData.name === "" ? false : true);
    setFillCountry(formData.country === "" ? false : true);
    const urls = [];
    const imageRef = ref(storage, `images/manufacturer/${imageFile.name}`); // Create a reference to the file in storage
    await uploadBytes(imageRef, imageFile); // Upload the file to the reference
    const url = await getDownloadURL(imageRef); // Get the download URL
    urls.push(url);

    if (formData.name !== "" && formData.country !== "") {
      fetch(`api/product-service/manufacturer/add-manufacturer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          country: formData.country,
          image: urls[0],
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              console.log(data);
              const newManufacturer = {
                ...formData,
                manufacturerId: data.manufacturerId,
                image: data.image,
              };
              onSave(newManufacturer); // lưu thành công
              onClose();
            });
          } else if (res.status === 400) {
            console.log("bug");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-blue-50 rounded-lg shadow-lg p-6 z-10 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">Thêm nhà sản xuất</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="flex">
          <div className="w-1/2 pr-4">
            <div className="space-y-4">
              <div>
                <label className="block text-blue-700">
                  Tên nhà sản xuất:{" "}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                />
                {!fillName && (
                  <h2 className="text-red-500">
                    Vui lòng nhập tên nhà sản xuất
                  </h2>
                )}
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
                {!fillCountry && (
                  <h2 className="text-red-500">
                    Vui lòng nhập quốc gia nhà sản xuất
                  </h2>
                )}
              </div>
            </div>
          </div>
          <div className="w-1/2 pl-4">
            <div>
              <label className="block text-blue-700">Logo nhà sản xuất:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
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
