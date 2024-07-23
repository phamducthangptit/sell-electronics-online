import edit from "../image/edit.png";
import dele from "../image/delete.png";
import { useEffect, useState } from "react";
import PopupXoa from "./PopupXoa";
import PopupChinhSua from "./PopupChinhSua";
import defaultproduct from "../image/defaultproduct.jpg";
const CategoryTable = ({ data, setCategory }) => {
  const [isPopupChinhSuaOpen, setPopupChinhSuaOpen] = useState(false);
  const [currentItemChinhSua, setCurrentItemChinhSua] = useState(null);
  const [isPopupXoaOpen, setPopupXoaOpen] = useState(false);
  const [currentItemXoa, setCurrentItemXoa] = useState(null);
  useEffect(() => {
    if (data && data.length > 0) {
      setCategory(data);
    }
  }, [data, setCategory]);

  const togglePopupChinhSua = (category) => {
    setCurrentItemChinhSua(category);
    setPopupChinhSuaOpen(!isPopupChinhSuaOpen);
  };

  const togglePopupXoa = (category) => {
    setCurrentItemXoa(category);
    setPopupXoaOpen(!isPopupXoaOpen);
    console.log(category);
  };

  const handleSave = (dataEdit) => {
    console.log(dataEdit);
    const updateCategory = data.map((item) => {
      if (item.categoryId === dataEdit.categoryId) {
        item.name = dataEdit.name;
        item.detailList = dataEdit.categoryDetails;
        item.image = dataEdit.image;
      }
      return item;
    });
    setCategory(updateCategory);
  };

  const handleSaveDelete = (dataDelete) => {
    const updateCategory = data.filter(
      (category) => category.categoryId !== dataDelete.categoryId
    );
    setCategory(updateCategory);
  };

  return (
    <div className="container mx-auto mt-2 pl-4 pr-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border border-gray-200">STT</th>
            <th className="px-4 py-2 border border-gray-200">Logo</th>
            <th className="px-4 py-2 border border-gray-200">
              Tên loại sản phẩm
            </th>
            <th className="px-4 py-2 border border-gray-200">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((category, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  {index + 1}
                </div>
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  <img
                    src={category.image ? category.image : defaultproduct}
                    alt=""
                    className="w-20 h-20"
                  />
                </div>
              </td>
              <td className="border px-4 py-2">{category.name}</td>
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  <img
                    src={edit}
                    alt=""
                    className="w-9 cursor-pointer"
                    onClick={() => togglePopupChinhSua(category)}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={dele}
                    alt=""
                    className="w-9 cursor-pointer"
                    onClick={() => togglePopupXoa(category)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PopupChinhSua
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
      />
    </div>
  );
};
export default CategoryTable;
