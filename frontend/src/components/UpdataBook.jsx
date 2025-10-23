import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBookForm() {
    const [name, setName] = useState('');
    const [img, setImage] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');



    const params = useParams();
    const navigate = useNavigate();

    const handleSingleData = () => {
        axios.get(`https://bookmart-backend-o98w.onrender.com/api/products/read/singleproduct/${params.id}`).then((res) => {
            setName(res.data.name);
            setQuantity(res.data.quantity);
            setPrice(res.data.price);
            setCategory(res.data.category);
            setImage(res.data.prImg); // Use setImage instead of SetImage
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("quantity", quantity);
        formData.append("price", price);
        formData.append("category", category);
        if (img) {
            formData.append("img", img);
        }

        axios.put(`https://bookmart-backend-o98w.onrender.com/api/products/update/product/${params.id}`, formData)
            .then(() => {
                alert("Successfully updated");
                navigate("/dash/books");
            })
            .catch((error) => {
                console.error("Error updating product:", error);
                alert("Failed to update product");
            });
    };

    useEffect(() => {
        handleSingleData();
    }, []);

    return (
        <form className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">Update Book</h2>
            <div>
                <label className="block mb-1 font-medium">Product Name</label>
                <input
                    type="text"
                    name="name"
                    className="w-full border border-gray-300 rounded p-2"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    className="w-full border border-gray-300 rounded p-2"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Price</label>
                <input
                    type="number"
                    name="price"
                    className="w-full border border-gray-300 rounded p-2"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Category</label>
                <input
                    type="text"
                    name="category"
                    className="w-full border border-gray-300 rounded p-2"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </div>
            
            <div>
                <label className="block mb-1 font-medium">Image</label>
                <input
                    type="file"
                    name="img"
                    accept="image/*"
                    className="w-full border border-gray-300 rounded p-2"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                {img && <img className="w-60" src={`http://localhost:3000/allImg/${img}`} alt="" />}
            </div>
            <button
                type="submit"
                className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
                onClick={handleUpdate}
            >
                Update Book
            </button>
        </form>
    );
}

export default UpdateBookForm;