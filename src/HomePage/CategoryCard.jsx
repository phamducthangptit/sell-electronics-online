import React from "react";
import defaultproduct from "../image/defaultproduct.jpg";

const CategoryCard = ({ categoryId, image, name, className }) => {
  const hanldeClickCategory = () => {
    alert(categoryId);
  };
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md ${className} flex items-center space-x-4 max-w-[200px] border border-transparent hover:border-blue-500 transition-all duration-300 cursor-pointer`}
      onClick={hanldeClickCategory}
    >
      <img
        src={image ? image : defaultproduct}
        alt={name}
        className="w-16 h-16 object-cover flex-shrink-0"
      />
      <div className="flex-grow">
        <span className="text-lg font-medium truncate">{name}</span>
      </div>
    </div>
  );
};

export default CategoryCard;
