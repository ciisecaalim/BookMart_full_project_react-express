import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // <-- Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css';

function LoginDash() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });

      const user = res.data.user;

      if (user.role === "admin") {
        // Haddii admin
        localStorage.setItem("admin", JSON.stringify(res.data));
        navigate("/dash"); // Redirect dashboard
      } else {
        // Sweet alert for non-admin
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Not allowed 👎',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      console.error(err);
      // Sweet alert for login error
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Email or password is incorrect ❌',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Try Again'
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-lg shadow-lg space-y-6 w-96"
      >
        <h2 className="text-2xl font-bold text-center text-green-600">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginDash;
