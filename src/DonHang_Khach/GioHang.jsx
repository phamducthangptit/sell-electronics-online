import Header from "../Header";
import Footer from "../Footer";
import NavBar from "../NavBar";
import { useEffect, useState } from "react";
import GioHangTable from "./GioHangTable";
import EmptyCart from "../image/empty-cart.webp";
export default function GioHang() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username");
  const [cartCountTmp, setCartCountTmp] = useState(null);
  const [productInCart, setProductInCart] = useState([]);
  useEffect(() => {
    fetch(
      `api/product-service/guest/cart/get-all-product-in-cart?username=${userName}`,
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
            setProductInCart(data);
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token, userName]);
  useEffect(() => {
    callAPIGetCartCount();
  }, [productInCart]);

  const handleQuantityChange = (product, newQuantity) => {
    if (newQuantity === 0) {
      // Xóa sản phẩm khỏi danh sách khi số lượng là 0
      setProductInCart(productInCart.filter((p) => p !== product));
    } else {
      // Cập nhật số lượng sản phẩm
      setProductInCart(
        productInCart.map((p) =>
          p === product ? { ...p, quantity: newQuantity } : p
        )
      );
    }
  };

  const callAPIGetCartCount = () => {
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
  };
  return (
    <div>
      <Header cartCount={cartCountTmp && cartCountTmp.value} />
      <NavBar />
      {productInCart.length > 0 ? (
        <GioHangTable
          data={productInCart}
          onQuantityChange={handleQuantityChange}
        />
      ) : (
        <div className="flex justify-center items-center mt-10 mb-9">
          <img
            src={EmptyCart}
            alt="Empty Cart"
            className="w-[495px] h-[351px]"
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
