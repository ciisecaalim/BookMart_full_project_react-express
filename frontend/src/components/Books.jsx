import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

function BookTable() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filterCategory, setFilterCategory] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`https://bookmart-backend-o98w.onrender.com/api/products/read/product`);
      setBooks(res.data);
    } catch (err) {
      setError("⚠️ Failed to load books. Please check your server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showData();
  }, []);

  const totalStock = books.reduce((s, b) => s + Number(b.quantity || 0), 0);
  const lowStock = books.filter((b) => b.quantity > 0 && b.quantity < 5).length;
  const outStock = books.filter((b) => b.quantity === 0).length;
  const totalValue = books.reduce(
    (s, b) => s + Number(b.quantity || 0) * Number(b.price || 0),
    0
  );

  const categoryCounts = books.reduce((acc, b) => {
    const k = b.category || "Uncategorized";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(categoryCounts);

  const filtered = filterCategory
    ? books.filter((b) => (b.category || "Uncategorized") === filterCategory)
    : books;

  const finalBooks = lowStockOnly
    ? filtered.filter((b) => b.quantity > 0 && b.quantity < 5)
    : filtered;

  const totalPages = Math.ceil(finalBooks.length / limit);
  const start = page * limit;
  const currentBooks = finalBooks.slice(start, start + limit);

  const deleteProduct = (id) => {
    setLoading(true);
    axios
      .delete(`http://localhost:3000/api/products/delete/product/${id}`)
      .then(() => {
        setConfirmDelete(null);
        showData();
      })
      .catch(() => setError("❌ Error deleting product"))
      .finally(() => setLoading(false));
  };

  const searchData = (e) => {
    const key = e.target.value.toLowerCase();
    if (!key) return showData();
    setBooks((prev) =>
      prev.filter((b) =>
        [b.name, b.category, String(b.quantity), String(b.price)]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(key))
      )
    );
  };

  return (
    <div className="space-y-10 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white rounded-2xl shadow-lg p-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">📚 Book Management</h2>
        <input
          onChange={searchData}
          type="search"
          placeholder="🔍 Search books..."
          className="w-80 px-4 py-2 rounded-lg text-gray-800 outline-none focus:ring-4 ring-indigo-400"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Stock", value: totalStock, color: "text-blue-700" },
          { label: "Low Stock", value: lowStock, color: "text-amber-600" },
          { label: "Out of Stock", value: outStock, color: "text-red-600" },
          {
            label: "Total Value",
            value: `$${totalValue.toFixed(2)}`,
            color: "text-green-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white shadow-md p-6 hover:scale-[1.02] border-l-4 border-blue-600 transition-transform"
          >
            <p className="text-gray-500">{item.label}</p>
            <p className={`text-2xl font-bold mt-2 ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}

        {/* Filter */}
        <div className="rounded-2xl bg-white shadow-md p-6">
          <p className="text-gray-500 text-sm">Filter by Category</p>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full mt-3 border rounded-lg px-3 py-2 text-sm focus:ring-2 ring-blue-500 outline-none"
          >
            <option value="">All</option>
            {categories.map(([cat]) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={() => setLowStockOnly(!lowStockOnly)}
            />
            <label className="text-sm text-gray-600">Show Low Stock Only</label>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead className="bg-blue-50 text-blue-900 text-sm uppercase sticky top-0 z-10">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.length ? (
              currentBooks.map((book, i) => (
                <tr
                  key={book._id}
                  className="border-t hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="p-2">{start + i + 1}</td>
                  <td className="p-2">
                    <img
                      onClick={() =>
                        setViewImage(`http://localhost:3000/allImg/${book.prImg}`)
                      }
                      src={`http://localhost:3000/allImg/${book.prImg}`}
                      alt={book.name}
                      className="w-14 h-14 mx-auto rounded-lg cursor-pointer hover:scale-105 transition-transform"
                    />
                  </td>
                  <td>{book.name}</td>
                  <td>{book.quantity}</td>
                  <td>${book.price}</td>
                  <td>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {book.category}
                    </span>
                  </td>
                  <td className="flex justify-center items-center gap-2">
                    {book.quantity === 0 ? (
                      <FaTimesCircle className="text-red-600" />
                    ) : book.quantity < 5 ? (
                      <FaExclamationTriangle className="text-amber-500" />
                    ) : (
                      <FaCheckCircle className="text-green-600" />
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        book.quantity === 0
                          ? "bg-red-100 text-red-700"
                          : book.quantity < 5
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {book.quantity === 0
                        ? "Out of Stock"
                        : book.quantity < 5
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </td>
                  <td className="space-x-3">
                    <Link to={`/update/book/${book._id}`}>
                      <i className="fa-solid fa-pen-to-square text-blue-600 cursor-pointer"></i>
                    </Link>
                    <i
                      onClick={() => setConfirmDelete(book._id)}
                      className="fa-solid fa-trash text-red-600 cursor-pointer"
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-10 text-gray-500">
                  <div className="flex flex-col items-center">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4076/4076501.png"
                      alt="Empty"
                      className="w-24 mb-3 opacity-70"
                    />
                    <p>No books found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 text-sm font-medium">Books per page:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(0);
            }}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 ring-blue-500"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`px-6 py-2 rounded-lg text-white ${
              page === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            ← Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {page + 1} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className={`px-6 py-2 rounded-lg text-white ${
              page >= totalPages - 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Add Button */}
      <Link
        to="/add/book"
        className="fixed bottom-10 right-10 bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:scale-110 transition"
      >
        +
      </Link>

      {/* Image Modal */}
      {viewImage && (
        <div
          onClick={() => setViewImage(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <img
            src={viewImage}
            alt="preview"
            className="w-96 h-auto rounded-lg shadow-lg border-4 border-white"
          />
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4 w-80">
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete this book?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProduct(confirmDelete)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookTable;
