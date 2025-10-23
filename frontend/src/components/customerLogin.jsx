import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import HeaderBookStore from "./Header";

function CustomerLogin() {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState("customer");
  const navigate = useNavigate();

  const handleInsert = async (e) => {
    e.preventDefault();

    const url =
      active === "customer"
        ? "http://localhost:3000/api/customers/login"
        : "http://localhost:3000/api/admin/login";

    const payload = { email: gmail, password };

    try {
      const res = await axios.post(url, payload);

      localStorage.setItem(active, JSON.stringify(res.data));

      toast.success(`${active} logged in successfully`);
      navigate(active === "customer" ? "/" : "/dash");
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div>
      <HeaderBookStore />

      <form
        onSubmit={handleInsert}
        className="max-w-md mx-auto p-6 mt-28 bg-white rounded-xl shadow-md space-y-4"
      >
        <div className="flex gap-5 text-2xl">
          <button
            type="button"
            onClick={() => setActive("customer")}
            className={`px-12 ml-24 py-3 rounded-lg ${
              active === "customer"
                ? "bg-blue-500 text-white"
                : "border border-black text-black"
            }`}
          >
            Customer
          </button>

          {/* <button
            type="button"
            onClick={() => setActive("admin")}
            className={`px-12 py-3 rounded-lg ${
              active === "admin"
                ? "bg-blue-500 text-white"
                : "border border-black text-black"
            }`}
          >
            Admin
          </button> */}
        </div>

        <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">
          {active === "customer" ? "Customer Login" : "Admin Login"}
        </h2>

        <div>
          <label className="block mb-1 font-medium">Gmail</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded p-2"
            required
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
        >
          {active === "customer" ? "Login Customer" : "Login Admin"}
        </button>
      </form>
    </div>
  );
}

export default CustomerLogin;
