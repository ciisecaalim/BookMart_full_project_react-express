import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HeaderBookStore from "./Header";

function CustomerRegistrationForm() {
  const [customerName, setCustomerName] = useState("");
  const [gmail, setGmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState("customer");
  const navigate = useNavigate();

  const handleInsert = async (e) => {
    e.preventDefault();

    const url =
      active === "customer"
        ? "http://localhost:3000/api/customers/create"
        : "http://localhost:3000/api/admin/create";

    const payload =
      active === "customer"
        ? { name: customerName, email: gmail, phone, address, password }
        : { name: customerName, email: gmail, password };

    try {
      const res = await axios.post(url, payload);

      if (active === "admin") localStorage.setItem("admin", JSON.stringify(res.data));

      toast.success(`${active} registered successfully`);
      navigate(active === "customer" ? "/" : "/dash");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <div>
      <HeaderBookStore />

      <form
        onSubmit={handleInsert}
        className="max-w-md mx-auto p-6 mt-28 bg-white rounded-xl shadow-md space-y-4"
      >
        {/* Toggle buttons */}
        <div className="flex gap-5 text-2xl">
          <button
            type="button"
            onClick={() => setActive("customer")}
            className={`px-12 py-3 rounded-lg ${
              active === "customer"
                ? "bg-blue-500 text-white"
                : "border border-black text-black"
            }`}
          >
            Customer
          </button>

          <button
            type="button"
            onClick={() => setActive("admin")}
            className={`px-12 py-3 rounded-lg ${
              active === "admin"
                ? "bg-blue-500 text-white"
                : "border border-black text-black"
            }`}
          >
            Admin
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">
          {active === "customer" ? "Customer Registration" : "Admin Registration"}
        </h2>

        <div>
          <label className="block mb-1 font-medium">
            {active === "customer" ? "Customer Name" : "Admin Name"}
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Gmail</label>
          <input
            type="email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {active === "customer" && (
          <>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          {active === "customer" ? "Register Customer" : "Register Admin"}
        </button>
      </form>
    </div>
  );
}

export default CustomerRegistrationForm;
