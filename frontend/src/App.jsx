import { Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/sideNav";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import BookForm from "./components/BookForm";
import CustomerRegistrationForm from "./components/customerRegiter";
import { ToastContainer } from "react-toastify";
import CustomerTable from "./components/CustomerTable";
import UpdateBookForm from "./components/UpdataBook";
import CustomerUpdateForm from "./components/CustomerUpdate";
import AddOrder from "./components/AddOrder";
import CustomerLogin from "./components/customerLogin";
import CartPage from "./components/cartPage";
import LoginDash from "./components/loginDah";
import ProtectedRouter from "./pages/protectedRouter";
import BookTable from "./components/Books";
import OrdersPage from "./components/OrdersPage";
import ReportsPage from "./components/ReportsPage";
import SettingsPage from "./components/SettingsPage";
import CategoryPage from "./components/category";
import AdminRegister from "./components/adminRegetration";
import AdminProfile from "./components/AdminProfileUpdate";
import AboutUs from "./components/about";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/admin" element={<AdminRegister />} />
        <Route path="/CategoryPage" element={<CategoryPage />} />
        <Route path="/CartPage" element={<CartPage />} />
        <Route path="/register" element={<CustomerRegistrationForm />} />
        <Route path="/CustomerLogin" element={<CustomerLogin />} />
        <Route path="/update/book/:id" element={<UpdateBookForm />} />
        <Route path="/update/customer/:id" element={<CustomerUpdateForm />} />
        <Route path="/loginDash" element={<LoginDash />} />

        {/* Protected Admin Routes */}
        <Route
          path="/dash"
          element={
            <ProtectedRouter>
              <Sidebar />
            </ProtectedRouter>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="AdminProfile" element={<AdminProfile />} />
          <Route path="books" element={<BookTable />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="addOrder" element={<AddOrder />} />
          <Route path="add-book" element={<BookForm />} />
          <Route path="customers" element={<CustomerTable />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
