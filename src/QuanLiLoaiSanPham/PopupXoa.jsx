import React, { useEffect, useState } from "react";

const PopupXoa = ({ show, onClose, item, onSave }) => {
  const [responseDelete, setResponseDelete] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setResponseDelete(null);
  }, [show]);
  const handleXacNhanXoa = () => {
    fetch(
      `api/product-service/category/delete-category?id=${item.categoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
            onSave(item);
            onClose();
          });
        } else if (res.status === 409) {
          res.json().then((data) => setResponseDelete(data));
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
          <h2 className="text-xl font-bold text-blue-700">Xác nhận xóa</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-blue-700">
              Bạn có muốn xóa loại sản phẩm: {item.name}
            </label>
          </div>
          {responseDelete && responseDelete.tag === "DeleteCategoryError" && (
            <h2 className="text-red-500">{responseDelete.value}</h2>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
            onClick={handleXacNhanXoa}
          >
            Xác nhận xóa
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupXoa;
