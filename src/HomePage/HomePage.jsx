import Header from "../Header";
import Footer from "../Footer";
import NavBar from "../NavBar";
import CategoryGrid from "./CategoryGrid";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import Popup from "./Popup";
import noResult from "../image/no-result.jpg";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isPopup, setPopupOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username");

  const fetchAllProducts = () => {
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
  };

  useEffect(() => {
    fetchAllProducts();
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

  const fetchProducts = (categoryId) => {
    let url = `api/product-service/guest/product/get-all-product`;
    if (categoryId) {
      url = `api/product-service/guest/product/get-product-by-category?category-id=${categoryId}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setProducts(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleCategoryClick = (categoryId) => {
    fetchProducts(categoryId);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortProducts = (products, sortOption) => {
    if (sortOption === "price-asc") {
      return [...products].sort((a, b) => a.priceSale - b.priceSale);
    } else if (sortOption === "price-desc") {
      return [...products].sort((a, b) => b.priceSale - a.priceSale);
    } else if (sortOption === "sales-asc") {
      return [...products].sort((a, b) => a.countSales - b.countSales);
    } else if (sortOption === "sales-desc") {
      return [...products].sort((a, b) => b.countSales - a.countSales);
    }
    return products;
  };

  const sortedProducts = sortProducts(products, sortOption);
  const handleSearch = (query) => {
    if (query.trim().length !== 0) {
      fetch(
        `api/product-service/guest/product/get-all-product-by-query?query=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              setProducts(data);
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };

  return (
    <div className="container mx-auto">
      <Header cartCount={cartCount.value} onSearch={handleSearch} />
      <NavBar />
      <div className="pt-6 px-4">
        <div className="w-full max-w-[1200px] mx-auto">
          <CategoryGrid onCategoryClick={handleCategoryClick} />
        </div>
        <div className="flex justify-end mb-4">
          <select
            onChange={handleSortChange}
            value={sortOption}
            className="border p-2 rounded"
          >
            <option value="">Sắp xếp</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="sales-asc">Lượt bán tăng dần</option>
            <option value="sales-desc">Lượt bán giảm dần</option>
          </select>
        </div>
        <div className="flex flex-wrap -mx-2 pt-4">
          {products.length === 0 && (
            <div className="w-full flex justify-center items-center">
              <img src={noResult} alt="" className="w-[250px] h-[250px]" />
            </div>
          )}
          {sortedProducts.map((product) => (
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
