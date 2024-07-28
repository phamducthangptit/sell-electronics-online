// src/components/CategoryGrid.jsx
import React, { useState, useEffect, useRef } from "react";
import CategoryCard from "./CategoryCard";
import { useDrag } from "@use-gesture/react";

const CategoryGrid = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState([]);
  const containerRef = useRef(null);

  const bind = useDrag(
    ({ movement: [mx], memo = containerRef.current.scrollLeft }) => {
      containerRef.current.scrollLeft = memo - mx;
      return memo;
    },
    { axis: "x", filterTaps: true }
  );

  useEffect(() => {
    fetch(`api/product-service/guest/category/get-all-category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
            setCategories(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-x-hidden whitespace-nowrap touch-none"
      {...bind()}
    >
      <div className="flex flex-nowrap space-x-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.categoryId}
            categoryId={category.categoryId}
            image={category.image}
            name={category.name}
            onClick={onCategoryClick}
            className="flex-none"
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
