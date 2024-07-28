import Header from "../Header";
import Footer from "../Footer";
import NavBar from "../NavBar";
import { useEffect, useState } from "react";
import DonHangTable from "./DonHangTable";
const DonHang = () => {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username");
  const [cartCountTmp, setCartCountTmp] = useState(null);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch(`api/product-service/guest/cart/count-product?username=${userName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setCartCountTmp(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token, userName]);
  useEffect(() => {
    fetch(
      `api/product-service/guest/order/get-all-order?username=${userName}`,
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
            setOrders(data);
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token, userName]);
  return (
    <div>
      <Header cartCount={cartCountTmp && cartCountTmp.value} />
      <NavBar />
      <DonHangTable data={orders} setData={setOrders} />
      <Footer />
    </div>
  );
};
export default DonHang;
