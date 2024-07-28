import { useEffect, useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import GuestTable from "./GuestTable";

export default function QuanLiKhachHang() {
  const token = localStorage.getItem("token");
  const [guestData, setGuestData] = useState([]);

  useEffect(() => {
    fetch(`api/information-service/employee/list-guest`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setGuestData(data);
            console.log(data);
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
      <GuestTable data={guestData} />
    </div>
  );
}
