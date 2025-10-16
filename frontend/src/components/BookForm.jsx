import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function BookForm() {
  const [name, setName] = useState("");
  const [img, setImage] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");



  const navigate = useNavigate()


  const handlePost = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("category", category);
    if (img) {
      formData.append("img", img);
    }

    axios.post("http://localhost:3000/api/products/create/product", formData)
      .then(() => {
        toast.success("Success register", {
          position: "top-right",
          autoClose: true,
        });

        navigate("/dash/books")


      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to register");
      });
  };

  return (
    <form
      onSubmit={handlePost} // Change to handle the form submission
      encType="multipart/form-data"
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">
        Register a Book
      </h2>

      <div>
        <label className="block mb-1 font-medium">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Price ($)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

       <div>
        <label className="block mb-1 font-medium">category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

       

      <div>
        <label className="block mb-1 font-medium">Image</label>
        <input
          type="file"
          accept="image/*" // Fixed typo here
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
      >
        Register product
      </button>
    </form>
  );
}

export default BookForm;