import Header from "../Header";
import NavBar from "../NavBar";
import { useEffect, useState } from "react";
import ManufacturerTable from "./ManufacturerTable";
import Popup from "./PopupThem";

export default function QuanLiNhaSanXuat() {
  const token = localStorage.getItem("token");
  const [manufacturerData, setManufacturerData] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  const handleSave = (addNewManufacturer) => {
    const existingManufacturer = manufacturerData.find(
      (manufacturer) =>
        manufacturer.manufacturerId === addNewManufacturer.manufacturerId
    );

    if (!existingManufacturer) {
      const updatedManufacturers = [...manufacturerData, addNewManufacturer];
      setManufacturerData(updatedManufacturers);
    } else {
      console.log("Manufacturer with this ID already exists.");
    }
  };

  useEffect(() => {
    fetch(`api/product/manufacturer/get-all-manufacturer`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setManufacturerData(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token]);

  return (
    <div>
      <Header />
      <NavBar />
      <div className="border-solid pt-2 pr-6 flex items-center justify-end space-x-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={togglePopup}
        >
          Thêm nhà sản xuất
        </button>
      </div>
      <ManufacturerTable
        data={manufacturerData}
        setManufacturerData={setManufacturerData}
      />
      <Popup
        show={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
