import { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa";
import HeaderBookStore from "./Header";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [shipping, setShipping] = useState(5);
  const [promo, setPromo] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("product")) || [];
    setCartItems(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("product", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("storage")); // Update Header count
  }, [cartItems]);

  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item => item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
    );
  };

  const removeItem = id => setCartItems(prev => prev.filter(item => item._id !== id));

  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCost = itemsTotal + shipping;

  return (
    <>
      <HeaderBookStore />
      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shopping Cart */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
            Shopping Cart <span className="text-gray-500">{cartItems.length} Items</span>
          </h2>
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
            ) : (
              cartItems.map(item => (
                <div key={item._id} className="grid grid-cols-6 gap-4 items-center border-b pb-3">
                  <div className="col-span-2 flex items-center gap-4">
                   <img src={`https://bookmart-backend-o98w.onrender.com/allImg/${item.prImg}`} alt={item.name} className="w-20 h-20 object-cover rounded-lg"/>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <button className="text-red-500 text-sm mt-1 flex items-center gap-1" onClick={() => removeItem(item._id)}>
                        <FaTrashAlt /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center gap-2">
                    <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => updateQuantity(item._id, -1)}><FaMinus/></button>
                    <span>{item.quantity}</span>
                    <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => updateQuantity(item._id, 1)}><FaPlus/></button>
                  </div>

                  <div className="col-span-1 font-medium">${item.price.toFixed(2)}</div>
                  <div className="col-span-1 font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between">
            <span>Items {cartItems.length}</span>
            <span>${itemsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Shipping</span>
            <select className="border rounded px-2 py-1" value={shipping} onChange={e => setShipping(Number(e.target.value))}>
              <option value={5}>Standard Delivery - $5</option>
              <option value={10}>Express Delivery - $10</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Promo Code</label>
            <input type="text" className="w-full border rounded px-2 py-1 mt-1" placeholder="Enter your code" value={promo} onChange={e => setPromo(e.target.value)}/>
            <button className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold">Apply</button>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total Cost</span>
            <span>${totalCost.toFixed(2)}</span>
          </div>
          <button className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded font-semibold">Checkout</button>
        </div>
      </div>
    </>
  );
}

export default CartPage;
