import edit from "../image/edit.png";
import dele from "../image/delete.png";
import { useEffect, useState } from "react";
import defaultproduct from "../image/defaultproduct.jpg";
import PopupXoa from "./PopupXoa";
import { useNavigate } from "react-router-dom";

const CategoryTable = ({ data, setProductData }) => {
  const [isPopupXoaOpen, setPopupXoaOpen] = useState(false);
  const [currentItemXoa, setCurrentItemXoa] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (data && data.length > 0) {
      setProductData(data);
    }
  }, [data, setProductData]);

  const togglePopupXoa = (category) => {
    setCurrentItemXoa(category);
    setPopupXoaOpen(!isPopupXoaOpen);
    console.log(category);
  };

  const handleClickEdit = (product) => {
    fetch(
      `api/product-service/employee/product/product-detail?id=${product.productId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            navigate("/chinh-sua-san-pham", {
              state: { productDetail: data },
            });
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleSaveDelete = (dataDelete) => {
    const updateProduct = data.filter(
      (product) => product.productId !== dataDelete.productId
    );
    setProductData(updateProduct);
  };

  return (
    <div className="container mx-auto mt-2 pl-4 pr-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border border-gray-200">STT</th>
            <th className="px-4 py-2 border border-gray-200 w-[250px]">Ảnh</th>
            <th className="px-4 py-2 border border-gray-200">Tên</th>
            <th className="px-4 py-2 border border-gray-200">Hãng</th>
            <th className="px-4 py-2 border border-gray-200">Mô tả</th>
            <th className="px-4 py-2 border border-gray-200">Giá</th>
            <th className="px-4 py-2 border border-gray-200">SL</th>
            <th className="px-4 py-2 border border-gray-200">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  {index + 1}
                </div>
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  <img
                    src={product.image ? product.image[0] : defaultproduct}
                    alt=""
                  />
                </div>
              </td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.manufacturerName}</td>
              <td className="border px-4 py-2">{product.description}</td>
              <td className="border px-4 py-2">{product.price}</td>
              <td className="border px-4 py-2">{product.stock}</td>
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  <img
                    src={edit}
                    alt=""
                    className="w-9 cursor-pointer"
                    onClick={() => handleClickEdit(product)}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={dele}
                    alt=""
                    className="w-9 cursor-pointer"
                    onClick={() => togglePopupXoa(product)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PopupXoa
        show={isPopupXoaOpen}
        onClose={() => setPopupXoaOpen(false)}
        item={currentItemXoa}
        onSave={handleSaveDelete}
      />
    </div>
  );
};
export default CategoryTable;
