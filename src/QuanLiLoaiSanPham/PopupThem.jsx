import { useEffect, useState } from "react";

const Popup = ({ show, onClose, onSave }) => {
  const [inputs, setInputs] = useState("");
  const [inputNameCategory, setInputNameCategory] = useState("");
  const [fillInputName, setFillInputName] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);
  const [errorDuplicateLable, setErrorDuplicateLable] = useState();
  const [responseAddCategory, setResponseAddCategory] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (show) {
      setInputs("");
      setShowInput(false);
      setInputNameCategory("");
      setFillInputName(true);
      setResponseAddCategory(null);
      fetch(`api/product-service/detail/get-all-detail`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              const formattedData = data.map((item) => ({
                detailId: item.detailId,
                name: item.name,
                checked: false,
              }));
              setCheckboxes(formattedData);
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  }, [token, show]);

  const handleAddInput = () => {
    setShowInput(true);
  };

  const handleInputChange = (value) => {
    setInputs(value);
    setErrorDuplicateLable("");
  };
  const isDuplicateLabel = (label) => {
    return checkboxes.some(
      (checkbox) => checkbox.name.toLowerCase() === label.toLowerCase()
    );
  };

  const handleAddCheckbox = () => {
    if (inputs.trim() !== "") {
      if (isDuplicateLabel(inputs.trim())) {
        // Thông báo cho người dùng rằng label đã tồn tại
        setErrorDuplicateLable("Thuộc tính đã tồn tại!");
        return;
      }

      // call api thêm vào database
      // alert(inputs.trim());
      fetch(`api/product-service/detail/add-detail`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inputs.trim(),
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              setCheckboxes([
                ...checkboxes,
                { detailId: data.detailId, name: data.name, checked: false },
              ]);
              setInputs("");
              setShowInput(false);
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };

  const handleRemoveInput = () => {
    setInputs("");
    setShowInput(false);
    setErrorDuplicateLable("");
  };

  const handleCheckboxChange = (index) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index].checked = !newCheckboxes[index].checked;
    setCheckboxes(newCheckboxes);
  };

  if (!show) return null;

  const handleSaveNewCategory = () => {
    const selectedCheckBox = checkboxes.filter((checkbox) => checkbox.checked);
    const formData = {
      categoryId: 0,
      name: inputNameCategory,
      categoryDetails: selectedCheckBox,
    };
    setFillInputName(inputNameCategory === "" ? false : true);
    if (inputNameCategory !== "") {
      fetch(`api/product-service/category/add-category`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          categoryDetails: formData.categoryDetails,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              formData.categoryId = data.categoryId;
              onSave(formData);
              console.log(data);
              onClose();
            });
          }
          if (res.status === 409) {
            res.json().then((data) => setResponseAddCategory(data));
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };

  const selectedCheckboxes = checkboxes.filter((checkbox) => checkbox.checked);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-blue-50 rounded-lg shadow-lg p-6 z-10 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">
            Thêm loại sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div className="p-2">
            <label className="block text-blue-700">Tên loại sản phẩm: </label>
            <input
              type="text"
              className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              onChange={(e) => {
                setInputNameCategory(e.target.value);
                if (e.target.value.trim() === "") setFillInputName(false);
                else setFillInputName(true);
                setResponseAddCategory(!responseAddCategory);
              }}
            />
            {!fillInputName && (
              <h2 className="text-red-500">Vui lòng nhập tên loại sản phẩm</h2>
            )}
            {responseAddCategory &&
              responseAddCategory.tag === "ErrorNameCategory" && (
                <h2 className="text-red-500">{responseAddCategory.value}</h2>
              )}
          </div>

          <div>
            <label className="block text-blue-700">Các thuộc tính có sẵn</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {checkboxes.map((checkbox, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checkbox.checked}
                    onChange={() => handleCheckboxChange(index)}
                    className="mr-2"
                  />
                  <label className="text-blue-700">{checkbox.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-blue-700">Thêm thuộc tính mới</label>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleAddInput}
            >
              Thêm mới
            </button>
          </div>
          {showInput && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-500 ml-2"
                placeholder="Nhập thuộc tính mới"
                value={inputs}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleRemoveInput}
              >
                X
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleAddCheckbox}
              >
                V
              </button>
            </div>
          )}
          {errorDuplicateLable && (
            <h2 className="text-red-500">Thuộc tính đã tồn tại</h2>
          )}
          <div>
            <label className="block text-blue-700">
              Danh sách các thuộc tính
            </label>
            {selectedCheckboxes.length > 0 ? (
              <ul className="list-disc list-inside mt-2">
                {selectedCheckboxes.map((checkbox, index) => (
                  <li key={index} className="text-blue-700">
                    {checkbox.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-blue-700">Không có thuộc tính nào được chọn</p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveNewCategory}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;