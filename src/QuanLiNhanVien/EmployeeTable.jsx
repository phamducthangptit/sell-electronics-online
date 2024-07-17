import active from "../image/active.png";
import inactive from "../image/inactive.png";
import edit from "../image/edit.png";
import { useEffect, useState } from "react";
import Popup from "./PopupChinhSua";

const EmployeeTable = ({ data }) => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const togglePopup = (item) => {
    setCurrentItem(item);
    setPopupOpen(!isPopupOpen);
  };
  useEffect(() => {
    if (data && data.length > 0) {
      setUsers(data);
    }
  }, [data]);

  const toggleStatus = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].status = updatedUsers[index].status === 1 ? 0 : 1;
    setUsers(updatedUsers);
    const userId = updatedUsers[index].accountId;
    const status = updatedUsers[index].status;

    console.log(userId);
    console.log(status);
    // call api update status in database
    fetch(`api/information-service/admin/update-status-account`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        status: status,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("change status ok");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleSave = (updatedData) => {
    const updatedUsers = users.map((user) =>
      user.email === currentItem.email ? { ...user, ...updatedData } : user
    );
    setUsers(updatedUsers);
  };

  return (
    <div className="container mx-auto mt-2 pl-4 pr-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border border-gray-200">STT</th>
            <th className="px-4 py-2 border border-gray-200">Họ</th>
            <th className="px-4 py-2 border border-gray-200">Tên</th>
            <th className="px-4 py-2 border border-gray-200">Email</th>
            <th className="px-4 py-2 border border-gray-200">Địa chỉ</th>
            <th className="px-4 py-2 border border-gray-200">SĐT</th>
            <th className="px-4 py-2 border border-gray-200">Ngày tạo</th>
            <th className="px-4 py-2 border border-gray-200">Trạng thái</th>
            <th className="px-4 py-2 border border-gray-200">Chỉnh sửa</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="even:bg-gray-100">
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  {index + 1}
                </div>
              </td>
              <td className="border px-4 py-2">{user.firstName}</td>
              <td className="border px-4 py-2">{user.lastName}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.address}</td>
              <td className="border px-4 py-2">{user.phoneNumber}</td>
              <td className="border px-4 py-2">{user.createAt}</td>
              <td className="border px-4 py-2">
                <div
                  className="flex justify-center items-center"
                  onClick={() => toggleStatus(index)}
                >
                  <img
                    src={user.status ? active : inactive}
                    alt=""
                    className="w-9 cursor-pointer"
                  />
                </div>
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center items-center">
                  <img
                    src={edit}
                    alt=""
                    className="w-9 cursor-pointer"
                    onClick={() => togglePopup(user)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Popup
        show={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        item={currentItem}
        onSave={handleSave}
      />
    </div>
  );
};
export default EmployeeTable;
