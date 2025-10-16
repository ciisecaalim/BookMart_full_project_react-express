import { useState, useEffect } from "react";

// --- StatCard ---
function StatCard({ title, value, change, positive }) {
  return (
    <div className="rounded-2xl bg-white/20 backdrop-blur-md shadow-lg p-6 hover:shadow-xl transition duration-300 cursor-pointer">
      <p className="text-gray-200 text-sm">{title}</p>
      <div className="mt-3 flex items-end gap-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        {change != null && (
          <span className={`text-sm ${positive ? "text-green-400" : "text-red-400"}`}>
            {positive ? "▲" : "▼"} {change}
          </span>
        )}
      </div>
    </div>
  );
}

// --- Progress ---
function Progress({ percent, color }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-800/30">
      <div className="h-2 rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
    </div>
  );
}

// --- Donut ---
function Donut({ percent, color }) {
  return (
    <div
      className="w-28 h-28 rounded-full grid place-items-center"
      style={{
        background: `conic-gradient(${color} ${percent}%, rgba(255,255,255,0.1) 0%)`
      }}
    >
      <div className="w-20 h-20 rounded-full bg-gray-900 grid place-items-center">
        <span className="text-white font-semibold">{percent}%</span>
      </div>
    </div>
  );
}

// --- Mini Bar Chart with daily colors & animation ---
function MiniBarChart({ values }) {
  const max = Math.max(...values);
  const colors = ["#3b82f6", "#06b6d4", "#f97316", "#eab308", "#10b981", "#8b5cf6", "#ec4899"]; // Sat → Fri

  const [animatedHeights, setAnimatedHeights] = useState(values.map(() => 0));

  useEffect(() => {
    values.forEach((v, i) => {
      setTimeout(() => {
        setAnimatedHeights(prev => {
          const newHeights = [...prev];
          newHeights[i] = (v / max) * 100;
          return newHeights;
        });
      }, i * 200); // 200ms delay per bar
    });
  }, [values, max]);

  return (
    <div className="flex items-end gap-2 h-24 mt-2 justify-between">
      {animatedHeights.map((h, i) => (
        <div
          key={i}
          className="w-4 rounded transition-all duration-500"
          style={{
            height: `${h}%`,
            background: colors[i % colors.length],
          }}
        />
      ))}
    </div>
  );
}
 
// --- Dashboard ---
function Dashboard() {
  const totalIncome = 12000;

  const topCustomer = [
    { customer: "John Doe", totalSpent: 1250, orderCount: 5 },
    { customer: "Jane Smith", totalSpent: 980, orderCount: 3 },
    { customer: "Michael Brown", totalSpent: 750, orderCount: 2 },
    { customer: "Emma Wilson", totalSpent: 640, orderCount: 1 },
  ];

  const products = [
    { name: "Product A", quantity: 10, category: "Electronics" },
    { name: "Product B", quantity: 3, category: "Electronics" },
    { name: "Product C", quantity: 0, category: "Furniture" },
    { name: "Product D", quantity: 5, category: "Furniture" },
    { name: "Product E", quantity: 2, category: "Groceries" },
  ];

  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const dayTotals = [50, 25, 75, 50, 100, 50, 50];
  const lineValues = [1200, 1500, 1300, 1800, 2000, 1700, 1600];

  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity < 5).length;

  const categoryToCount = products.reduce((acc, p) => {
    const key = p.category || "Uncategorized";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(categoryToCount);

  return (
    <div className="min-h-screen  bg-purple-700  p-8 space-y-8 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome back, Admin!</h1>

      {/* Top Stats */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Balance" value={`$${(totalIncome * 1.85).toLocaleString()}`} change="12.1%" positive />
        <StatCard title="Income" value={`$${totalIncome.toLocaleString()}`} change="6.3%" positive />
        <StatCard title="Expense" value="$6,222" change="2.4%" />
        <StatCard title="Total Savings" value="$32,913" change="12.1%" positive />
      </div>

      {/* Analytics */}
      <div className="rounded-2xl bg-white/20 backdrop-blur-md shadow-lg p-6">
        <p className="font-semibold text-lg mb-4">Analytics (Flow & Trend)</p>
        <div className="flex justify-between">
          {days.map((d, i) => (
            <span key={i} className="text-xs text-gray-300">{d}</span>
          ))}
        </div>
        <MiniBarChart values={dayTotals} />
       
      </div>

      {/* Budget Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/20 backdrop-blur-md shadow-lg p-6">
          <p className="font-semibold text-lg mb-4">Budget</p>
          <div className="flex items-center gap-6">
            <Donut percent={42} color="#7c3aed" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500"></span>Cafe & Restaurants</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-cyan-500"></span>Entertainment</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span>Investments</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span>Food & Groceries</div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl bg-white/20 backdrop-blur-md shadow-lg p-6 overflow-x-auto">
          <p className="font-semibold mb-4">Recent Transactions</p>
          <table className="w-full text-left text-sm">
            <thead className="text-gray-300">
              <tr>
                <th className="py-2">Customer</th>
                <th className="py-2">Total Spent</th>
                <th className="py-2">Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {topCustomer.length ? topCustomer.map((t, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="py-2">{t.customer}</td>
                  <td className="py-2">${t.totalSpent}</td>
                  <td className="py-2">{t.orderCount}</td>
                </tr>
              )) : (
                <tr><td className="py-3 text-gray-400" colSpan="3">No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Saving Goals */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/20 backdrop-blur-md shadow-lg p-6">
          <p className="font-semibold mb-4">Saving Goals</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm"><span>MacBook Pro</span><span>$1,650</span></div>
              <Progress percent={25} color="#7c3aed" />
            </div>
            <div>
              <div className="flex justify-between text-sm"><span>New Car</span><span>$60,000</span></div>
              <Progress percent={42} color="#06b6d4" />
            </div>
            <div>
              <div className="flex justify-between text-sm"><span>New House</span><span>$150,000</span></div>
              <Progress percent={3} color="#10b981" />
            </div>
          </div>
        </div>

        {/* Stock Overview */}
        <div className="rounded-2xl bg-white/20 backdrop-blur-md shadow-lg p-6">
          <p className="font-semibold mb-4">Stock Overview</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-300 text-sm">Total items</p>
              <p className="text-2xl font-bold">{totalStock}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Low stock</p>
              <p className="text-2xl font-bold text-amber-400">{lowStock}</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">Out of stock</p>
              <p className="text-2xl font-bold text-red-400">{outOfStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-2xl bg-white/20 backdrop-blur-md shadow-lg p-6">
        <p className="font-semibold mb-4">Categories</p>
        {categories.length === 0 ? (
          <div className="text-gray-400">No categories found</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map(([cat, count]) => (
              <div key={cat} className="rounded-lg border border-gray-700 p-3 flex items-center justify-between">
                <span className="truncate">{cat}</span>
                <span className="text-sm text-gray-300">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
