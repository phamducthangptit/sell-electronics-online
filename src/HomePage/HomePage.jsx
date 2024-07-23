import Header from "../Header";
import Footer from "../Footer";
import NavBar from "../NavBar";
import CategoryGrid from "./CategoryGrid";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import Popup from "./Popup";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isPopup, setPopupOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username");
  useEffect(() => {
    fetch(`api/product-service/guest/product/get-all-product`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
            setProducts(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
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
            setCartCount(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token, userName]);
  return (
    <div className="container mx-auto">
      <Header cartCount={cartCount.value} />
      <NavBar />
      <div className="pt-6 px-4">
        <div className="w-full max-w-[1200px] mx-auto">
          <CategoryGrid />
        </div>
        <div className="flex flex-wrap -mx-2 pt-4">
          {products.map((product) => (
            <div
              key={product.productId}
              className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4"
            >
              <ProductCard
                product={product}
                setPopupOpen={setPopupOpen}
                setResponse={setResponse}
                setCartCount={setCartCount}
              />
            </div>
          ))}
        </div>
      </div>
      <Popup
        show={isPopup}
        onClose={() => setPopupOpen(false)}
        object={response}
      />
      <Footer />
    </div>
  );
}
