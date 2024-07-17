import edit from "../image/edit.png";
import dele from "../image/delete.png";
import { useEffect, useState } from "react";
import defaultproduct from "../image/defaultproduct.jpg";
// import PopupXoa from "./PopupXoa";
// import PopupChinhSua from "./PopupChinhSua";
const CategoryTable = ({ data, setProductData }) => {
  const [isPopupChinhSuaOpen, setPopupChinhSuaOpen] = useState(false);
  const [currentItemChinhSua, setCurrentItemChinhSua] = useState(null);
  const [isPopupXoaOpen, setPopupXoaOpen] = useState(false);
  const [currentItemXoa, setCurrentItemXoa] = useState(null);
  useEffect(() => {
    if (data && data.length > 0) {
      setProductData(data);
    }
  }, [data, setProductData]);

  const togglePopupChinhSua = (category) => {
    setCurrentItemChinhSua(category);
    setPopupChinhSuaOpen(!isPopupChinhSuaOpen);
  };

  const togglePopupXoa = (category) => {
    setCurrentItemXoa(category);
    setPopupXoaOpen(!isPopupXoaOpen);
    console.log(category);
  };

  //   const handleSave = () => {};

  //   const handleSaveDelete = (dataDelete) => {
  //     const updateCategory = data.filter(
  //       (category) => category.categoryId !== dataDelete.categoryId
  //     );
  //     setCategory(updateCategory);
  //   };

  return (
    <div className="container mx-auto mt-2 pl-4 pr-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border border-gray-200">STT</th>
            <th className="px-4 py-2 border border-gray-200">Ảnh</th>
            <th className="px-4 py-2 border border-gray-200">Tên sản phẩm</th>
            <th className="px-4 py-2 border border-gray-200">Hãng sản xuất</th>
            <th className="px-4 py-2 border border-gray-200">Mô tả</th>
            <th className="px-4 py-2 border border-gray-200">Giá</th>
            <th className="px-4 py-2 border border-gray-200">Số lượng còn</th>
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
                    src={product.image ? product.image : defaultproduct}
                    alt=""
                    className="w-40 h-40"
                  />
                </div>
              </td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.manufacturerName}</td>
              <td className="border px-4 py-2">{product.description}</td>
              <td className="border px-4 py-2">{product.price}</td>
              <td className="border px-4 py-2">{product.stock}</td>
              {/* <td className="border px-4 py-2">{product.createAt}</td>
              <td className="border px-4 py-2">{product.updateAt}</td> */}
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  <img
                    src={edit}
                    alt=""
                    className="w-9 cursor-pointer"
                    // onClick={() => togglePopupChinhSua(category)}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={dele}
                    alt=""
                    className="w-9 cursor-pointer"
                    // onClick={() => togglePopupXoa(category)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <PopupChinhSua
        show={isPopupChinhSuaOpen}
        onClose={() => setPopupChinhSuaOpen(false)}
        item={currentItemChinhSua}
        onSave={handleSave}
      />
      <PopupXoa
        show={isPopupXoaOpen}
        onClose={() => setPopupXoaOpen(false)}
        item={currentItemXoa}
        onSave={handleSaveDelete}
      /> */}
    </div>
  );
};
export default CategoryTable;
