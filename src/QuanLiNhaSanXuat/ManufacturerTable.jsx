import edit from "../image/edit.png";
import dele from "../image/delete.png";
import { useEffect, useState } from "react";
import PopupChinhSua from "./PopupChinhSua";
import PopupXoa from "./PopupXoa";
import defaultproduct from "../image/defaultproduct.jpg";

const ManufacturerTable = ({ data, setManufacturerData }) => {
  const [isPopupChinhSuaOpen, setPopupChinhSuaOpen] = useState(false);
  const [currentItemChinhSua, setCurrentItemChinhSua] = useState(null);
  const [isPopupXoaOpen, setPopupXoaOpen] = useState(false);
  const [currentItemXoa, setCurrentItemXoa] = useState(null);

  const togglePopupChinhSua = (item) => {
    setCurrentItemChinhSua(item);
    setPopupChinhSuaOpen(!isPopupChinhSuaOpen);
  };

  const togglePopupXoa = (item) => {
    setCurrentItemXoa(item);
    setPopupXoaOpen(!isPopupXoaOpen);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setManufacturerData(data);
    }
  }, [data, setManufacturerData]);

  const handleSave = (updatedData) => {
    const updatedManufacturers = data.map((manufacturer) =>
      manufacturer.manufacturerId === currentItemChinhSua.manufacturerId
        ? { ...manufacturer, ...updatedData }
        : manufacturer
    );
    setManufacturerData(updatedManufacturers);
  };

  const handleSaveDelete = (dataDelete) => {
    const updatedManufacturers = data.filter(
      (manufacturer) =>
        manufacturer.manufacturerId !== dataDelete.manufacturerId
    );
    setManufacturerData(updatedManufacturers);
  };

  return (
    <div className="container mx-auto mt-2 pl-4 pr-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border border-gray-200">STT</th>
            <th className="px-4 py-2 border border-gray-200">Logo</th>
            <th className="px-4 py-2 border border-gray-200">
              Tên nhà sản xuất
            </th>
            <th className="px-4 py-2 border border-gray-200">Quốc gia</th>
            <th className="px-4 py-2 border border-gray-200">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((manufacturer, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  {index + 1}
                </div>
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  <img
                    src={
                      manufacturer.image ? manufacturer.image : defaultproduct
                    }
                    alt=""
                    className="w-20 h-20"
                  />
                </div>
              </td>
              <td className="border px-4 py-2">{manufacturer.name}</td>
              <td className="border px-4 py-2">{manufacturer.country}</td>
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  <img
                    src={edit}
                    alt=""
                    className="w-9 cursor-pointer"
                    onClick={() => togglePopupChinhSua(manufacturer)}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={dele}
                    alt=""
                    className="w-9 cursor-pointer"
                    onClick={() => togglePopupXoa(manufacturer)}
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

export default ManufacturerTable;
