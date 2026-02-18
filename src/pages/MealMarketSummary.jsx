// import React, { useState, useMemo, useEffect } from 'react';
// import { DollarSign, TrendingUp, Calendar, User, Tag, Package } from 'lucide-react';
// import { useMarketingSummaryWithCategoryQuery } from '../features/productCategory/productCategoryApi';
// import { useSelector } from 'react-redux';

// export default function MealExpenseSummary() {
//     const [skip, setSkip] = useState(true);

//     const { user } = useSelector((state) => state.auth);
//     console.log(user)
//     useEffect(() => {
//         if (user && user?._id) {
//             setSkip(false);
//         } else {
//             setSkip(true);
//         }
//     }, [user]);
//     const managerId = user?.role === 'admin' ? user?._id : user?.manager
//     console.log(managerId)
//     const { data: marketingData, isLoading, isError } = useMarketingSummaryWithCategoryQuery(managerId, { skip:skip })
//     const expenseData = marketingData?.data || [];

//     const [selectedCategory, setSelectedCategory] = useState('all');
//     const [selectedUser, setSelectedUser] = useState('all');

//     const summary = useMemo(() => {
//         let filteredData = expenseData;

//         if (selectedCategory !== 'all') {
//             filteredData = filteredData.filter(item =>
//                 item.categoryId === selectedCategory || (!item.categoryId && selectedCategory === 'uncategorized')
//             );
//         }

//         if (selectedUser !== 'all') {
//             filteredData = filteredData.filter(item => item.userId === selectedUser);
//         }

//         const totalExpense = filteredData.reduce((sum, item) => sum + item.unitPrice, 0);
//         const totalItems = filteredData.length;

//         const byCategory = {};
//         const byUser = {};

//         filteredData.forEach(item => {
//             const category = item.categoryName || 'Uncategorized';
//             const user = item.userName;

//             byCategory[category] = (byCategory[category] || 0) + item.unitPrice;
//             byUser[user] = (byUser[user] || 0) + item.unitPrice;
//         });

//         return { totalExpense, totalItems, byCategory, byUser, filteredData };
//     }, [selectedCategory, selectedUser]);

//     const categories = [...new Set(expenseData.map(item => ({
//         id: item.categoryId || 'uncategorized',
//         name: item.categoryName || 'Uncategorized'
//     })).map(c => JSON.stringify(c)))].map(c => JSON.parse(c));

//     const users = [...new Set(expenseData.map(item => ({
//         id: item.userId,
//         name: item.userName
//     })).map(u => JSON.stringify(u)))].map(u => JSON.parse(u));
//     console.log(users)
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-4xl font-bold text-slate-800 mb-2">Expense Summary</h1>
//                     <p className="text-slate-600">February 2026 - Track your spending</p>
//                 </div>

//                 {/* Filters */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Category</label>
//                             <select
//                                 value={selectedCategory}
//                                 onChange={(e) => setSelectedCategory(e.target.value)}
//                                 className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
//                             >
//                                 <option value="all">All Categories</option>
//                                 {categories.map(cat => (
//                                     <option key={cat.id} value={cat.id}>{cat.name}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Filter by User</label>
//                             <select
//                                 value={selectedUser}
//                                 onChange={(e) => setSelectedUser(e.target.value)}
//                                 className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
//                             >
//                                 <option value="all">All Users</option>
//                                 {users.map(user => (
//                                     <option key={user.id} value={user.id}>{user.name}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="p-3 bg-white/20 rounded-lg">
//                                 <DollarSign className="w-8 h-8" />
//                             </div>
//                             <TrendingUp className="w-6 h-6 opacity-80" />
//                         </div>
//                         <h3 className="text-sm font-medium opacity-90 mb-1">Total Expenses</h3>
//                         <p className="text-4xl font-bold">৳{summary.totalExpense.toLocaleString()}</p>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="p-3 bg-white/20 rounded-lg">
//                                 <Package className="w-8 h-8" />
//                             </div>
//                             <Calendar className="w-6 h-6 opacity-80" />
//                         </div>
//                         <h3 className="text-sm font-medium opacity-90 mb-1">Total Transactions</h3>
//                         <p className="text-4xl font-bold">{summary.totalItems}</p>
//                     </div>
//                 </div>

//                 {/* Category Breakdown */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//                     <div className="flex items-center mb-4">
//                         <Tag className="w-5 h-5 text-blue-600 mr-2" />
//                         <h2 className="text-xl font-bold text-slate-800">Expenses by Category</h2>
//                     </div>
//                     <div className="space-y-3">
//                         {Object.entries(summary.byCategory).map(([category, amount]) => {
//                             const percentage = (amount / summary.totalExpense) * 100;
//                             return (
//                                 <div key={category} className="space-y-2">
//                                     <div className="flex justify-between items-center">
//                                         <span className="text-slate-700 font-medium">{category}</span>
//                                         <span className="text-slate-900 font-semibold">৳{amount.toLocaleString()}</span>
//                                     </div>
//                                     <div className="w-full bg-slate-200 rounded-full h-2.5">
//                                         <div
//                                             className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
//                                             style={{ width: `${percentage}%` }}
//                                         ></div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* User Breakdown */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//                     <div className="flex items-center mb-4">
//                         <User className="w-5 h-5 text-purple-600 mr-2" />
//                         <h2 className="text-xl font-bold text-slate-800">Expenses by User</h2>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {Object.entries(summary.byUser).map(([user, amount]) => (
//                             <div key={user} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center">
//                                         <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
//                                             {user.charAt(0)}
//                                         </div>
//                                         <span className="font-semibold text-slate-800">{user}</span>
//                                     </div>
//                                     <span className="text-lg font-bold text-purple-600">৳{amount.toLocaleString()}</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Recent Transactions */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6">
//                     <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Transactions</h2>
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead>
//                                 <tr className="border-b border-slate-200">
//                                     <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
//                                     <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Product</th>
//                                     <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Category</th>
//                                     <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">User</th>
//                                     <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Amount</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {summary.filteredData.slice(0, 10).map((item, index) => (
//                                     <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
//                                         <td className="py-3 px-4 text-sm text-slate-600">{item.mealDate}</td>
//                                         <td className="py-3 px-4 text-sm text-slate-800 font-medium">{item.productName}</td>
//                                         <td className="py-3 px-4 text-sm">
//                                             <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
//                                                 {item.categoryName || 'N/A'}
//                                             </span>
//                                         </td>
//                                         <td className="py-3 px-4 text-sm text-slate-700">{item.userName}</td>
//                                         <td className="py-3 px-4 text-sm text-right font-semibold text-slate-900">৳{item?.unitPrice?.toLocaleString()}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useState, useEffect } from "react";

// Simulated API call — replace URL with your real endpoint
const fetchMealData = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            month: 1,
            year: 2026,
            mealDate: "17 February 2026",
            productName: "Fish",
            productCount: "",
            unitPrice: 100,
            category: { categoryId: "699309f3", categoryName: "আমিষ" },
            tags: [
              { tagId: "1", tagName: "Potato" },
              { tagId: "2", tagName: "Tomato" },
            ],
            user: { userId: "1", userName: "Rahat" },
            commentCreatedAt: "2026-02-01T19:26:33.191Z",
          },
          {
            month: 1,
            year: 2026,
            mealDate: "17 February 2026",
            productName: "Tometo, Dhoniya pata",
            productCount: "",
            unitPrice: 50,
            category: { categoryId: "6992c633", categoryName: "কাঁচাবাজার(Wet Market)" },
            tags: [],
            user: { userId: "1", userName: "Rahat" },
            commentCreatedAt: "2026-02-01T19:26:33.191Z",
          },
          {
            month: 1,
            year: 2026,
            mealDate: "6 February 2026",
            productName: "কোল্ড ড্রিক",
            productCount: null,
            unitPrice: 20,
            category: {},
            tags: [],
            user: { userId: "1", userName: "Rahat" },
            commentCreatedAt: "2026-02-01T19:26:33.174Z",
          },
          {
            month: 1,
            year: 2026,
            mealDate: "6 February 2026",
            productName: "পান",
            productCount: null,
            unitPrice: 10,
            category: { categoryId: "69930132", categoryName: "বিবিধ(Miscellaneous)" },
            tags: [],
            user: { userId: "1", userName: "Rahat" },
            commentCreatedAt: "2026-02-01T19:26:33.174Z",
          },
        ]),
      1400
    )
  );

const CATEGORY_STYLES = {
  "আমিষ": {
    pill: "bg-rose-100 text-rose-700 border-rose-200",
    active: "bg-rose-500 border-rose-500 text-white",
    dot: "bg-rose-400",
  },
  "কাঁচাবাজার(Wet Market)": {
    pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
    active: "bg-emerald-500 border-emerald-500 text-white",
    dot: "bg-emerald-400",
  },
  "বিবিধ(Miscellaneous)": {
    pill: "bg-amber-100 text-amber-700 border-amber-200",
    active: "bg-amber-500 border-amber-500 text-white",
    dot: "bg-amber-400",
  },
};

const getCategoryPill = (name) =>
  CATEGORY_STYLES[name]?.pill || "bg-slate-100 text-slate-600 border-slate-200";

const groupByDate = (items) =>
  items.reduce((acc, item) => {
    if (!acc[item.mealDate]) acc[item.mealDate] = [];
    acc[item.mealDate].push(item);
    return acc;
  }, {});

// ── Skeleton card ──────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="relative rounded-xl border border-white/[0.07] bg-white/[0.03] overflow-hidden px-5 py-4 pl-6 animate-pulse">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-white/10 rounded w-2/5" />
          <div className="flex gap-2">
            <div className="h-3 bg-white/5 rounded-full w-16" />
            <div className="h-3 bg-white/5 rounded-full w-12" />
          </div>
        </div>
        <div className="h-5 bg-white/10 rounded w-12" />
      </div>
      <div className="mt-3 pt-3 border-t border-white/[0.05] flex justify-between">
        <div className="h-2.5 bg-white/5 rounded w-16" />
        <div className="h-2.5 bg-white/5 rounded w-12" />
      </div>
    </div>
  );
}

// ── Skeleton filter pill ───────────────────────────────────────
function SkeletonPill({ w = "w-20" }) {
  return <div className={`h-7 ${w} bg-white/5 rounded-full animate-pulse`} />;
}

// ── Main component ─────────────────────────────────────────────
export default function MealTracker() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState("All");

  const load = () => {
    setLoading(true);
    setError(null);
    fetchMealData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch data.");
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  // ── Derived data ────────────────────────────────────────────
  const allCategories = ["All", ...new Set(data.map((d) => d.category?.categoryName).filter(Boolean))];
  const allTags = ["All", ...new Set(data.flatMap((d) => d.tags.map((t) => t.tagName)))];

  const filteredData = data.filter((item) => {
    const catMatch = activeCategory === "All" || item.category?.categoryName === activeCategory;
    const tagMatch = activeTag === "All" || item.tags.some((t) => t.tagName === activeTag);
    return catMatch && tagMatch;
  });

  const filteredTotal = filteredData.reduce((s, i) => s + i.unitPrice, 0);
  const filteredGrouped = groupByDate(filteredData);
  const filteredDates = Object.keys(filteredGrouped);
  const grandTotal = data.reduce((s, i) => s + i.unitPrice, 0);
  const isFiltered = activeCategory !== "All" || activeTag !== "All";

  const filterLabel = [
    activeCategory !== "All" ? activeCategory : null,
    activeTag !== "All" ? `#${activeTag}` : null,
  ]
    .filter(Boolean)
    .join(" + ");

  const categoryTotals = allCategories.reduce((acc, cat) => {
    const subset =
      cat === "All"
        ? data.filter((i) => activeTag === "All" || i.tags.some((t) => t.tagName === activeTag))
        : data.filter(
            (i) =>
              i.category?.categoryName === cat &&
              (activeTag === "All" || i.tags.some((t) => t.tagName === activeTag))
          );
    acc[cat] = subset.reduce((s, i) => s + i.unitPrice, 0);
    return acc;
  }, {});

  const tagTotals = allTags.reduce((acc, tag) => {
    const subset =
      tag === "All"
        ? data.filter((i) => activeCategory === "All" || i.category?.categoryName === activeCategory)
        : data.filter(
            (i) =>
              i.tags.some((t) => t.tagName === tag) &&
              (activeCategory === "All" || i.category?.categoryName === activeCategory)
          );
    acc[tag] = subset.reduce((s, i) => s + i.unitPrice, 0);
    return acc;
  }, {});

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-4 py-10">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-slate-500 mb-1">February 2026</p>
              <h1 className="text-4xl font-bold leading-tight" style={{ letterSpacing: "-0.02em" }}>
                Meal<br />
                <span className="text-[#c8a96e]">Ledger</span>
              </h1>
            </div>

            <div className="text-right">
              <p className="text-xs tracking-widest uppercase text-slate-500 mb-1">
                {isFiltered ? filterLabel : "Total Spent"}
              </p>

              {loading ? (
                <div className="h-9 w-20 bg-white/10 rounded animate-pulse ml-auto" />
              ) : (
                <p className="text-3xl font-bold text-[#c8a96e]">৳{filteredTotal}</p>
              )}

              <p className="text-xs text-slate-500 mt-1">
                {loading ? "loading…" : `${filteredData.length} entries`}
              </p>

              {isFiltered && !loading && (
                <button
                  onClick={() => { setActiveCategory("All"); setActiveTag("All"); }}
                  className="mt-1.5 text-[10px] text-slate-600 hover:text-slate-400 underline underline-offset-2 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* API status badge */}
          <div className="flex items-center gap-2 mt-4">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border ${
                loading
                  ? "border-yellow-700/40 bg-yellow-900/20 text-yellow-400"
                  : error
                  ? "border-red-700/40 bg-red-900/20 text-red-400"
                  : "border-emerald-700/40 bg-emerald-900/20 text-emerald-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  loading ? "bg-yellow-400 animate-pulse" : error ? "bg-red-400" : "bg-emerald-400"
                }`}
              />
              {loading ? "Fetching data…" : error ? "API Error" : `API · ${data.length} records loaded`}
            </span>

            {!loading && (
              <button
                onClick={load}
                className="text-[10px] text-slate-600 hover:text-slate-300 transition-colors flex items-center gap-1"
              >
                ↻ Refresh
              </button>
            )}
          </div>

          <div className="mt-4 h-px bg-gradient-to-r from-[#c8a96e]/40 via-[#c8a96e]/10 to-transparent" />
        </div>

        {/* ── Error state ── */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-800/40 bg-red-900/10 px-5 py-4 text-sm text-red-400 flex items-start gap-3">
            <span className="text-lg leading-none mt-0.5">⚠</span>
            <div>
              <p className="font-semibold text-red-300 mb-0.5">Failed to load data</p>
              <p className="text-red-500 text-xs">{error}</p>
              <button
                onClick={load}
                className="mt-2 text-xs text-red-400 hover:text-red-200 underline underline-offset-2 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* ── Filters ── */}
        <div className="space-y-5 mb-8">
          {/* Category */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-slate-600 mb-2.5">Category</p>
            {loading ? (
              <div className="flex gap-2">
                <SkeletonPill w="w-10" />
                <SkeletonPill w="w-16" />
                <SkeletonPill w="w-28" />
                <SkeletonPill w="w-24" />
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {allCategories.map((cat) => {
                  const style = CATEGORY_STYLES[cat];
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
                        isActive
                          ? cat === "All"
                            ? "bg-[#c8a96e] border-[#c8a96e] text-[#0f0f13] font-semibold"
                            : `${style?.active || "bg-slate-500 border-slate-500 text-white"} font-semibold`
                          : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {style && !isActive && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
                      {cat}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${isActive ? "bg-black/15" : "bg-white/5 text-slate-500"}`}>
                        ৳{categoryTotals[cat]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="h-px bg-white/5" />

          {/* Tag */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-slate-600 mb-2.5">Tag</p>
            {loading ? (
              <div className="flex gap-2">
                <SkeletonPill w="w-10" />
                <SkeletonPill w="w-20" />
                <SkeletonPill w="w-20" />
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {allTags.map((tag) => {
                  const isActive = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-500 border-indigo-500 text-white font-semibold"
                          : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {tag !== "All" && <span className={`opacity-70 ${isActive ? "" : "text-indigo-400"}`}>#</span>}
                      {tag}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${isActive ? "bg-black/20" : "bg-white/5 text-slate-500"}`}>
                        ৳{tagTotals[tag]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Filter summary ── */}
        {isFiltered && !loading && (
          <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] inline-block" />
            Showing{" "}
            <span className="text-white font-medium">{filteredData.length} result{filteredData.length !== 1 ? "s" : ""}</span>
            {" "}for{" "}
            <span className="text-[#c8a96e]">{filterLabel}</span>
            {" — "}total{" "}
            <span className="text-[#c8a96e] font-semibold">৳{filteredTotal}</span>
          </div>
        )}

        {/* ── Skeleton list ── */}
        {loading && (
          <div className="space-y-8">
            {["17 February 2026", "6 February 2026"].map((date) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-2.5 bg-white/10 rounded w-28 animate-pulse" />
                  <div className="flex-1 h-px bg-white/5" />
                  <div className="h-2.5 bg-white/5 rounded w-10 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && filteredDates.length === 0 && (
          <div className="text-center text-slate-600 text-sm italic py-16 border border-white/5 rounded-xl">
            No entries match the selected filters.
            <br />
            <button
              onClick={() => { setActiveCategory("All"); setActiveTag("All"); }}
              className="mt-3 text-xs text-[#c8a96e] underline underline-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Grouped entries ── */}
        {!loading &&
          filteredDates.map((date) => {
            const items = filteredGrouped[date];
            const dayTotal = items.reduce((s, i) => s + i.unitPrice, 0);
            return (
              <div key={date} className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs tracking-[0.2em] uppercase text-[#c8a96e]/70">{date}</span>
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-xs text-slate-500">৳{dayTotal}</span>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#c8a96e]/30 group-hover:bg-[#c8a96e]/70 transition-colors duration-300" />

                      <div className="px-5 py-4 pl-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white/90 leading-tight">{item.productName}</h3>
                            <div className="flex items-center flex-wrap gap-2 mt-2">
                              {item.category?.categoryName && (
                                <button
                                  onClick={() => setActiveCategory(item.category.categoryName)}
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border transition-all duration-150 ${
                                    activeCategory === item.category.categoryName
                                      ? "ring-1 ring-offset-1 ring-offset-[#0f0f13] ring-white/20"
                                      : "opacity-80 hover:opacity-100"
                                  } ${getCategoryPill(item.category.categoryName)}`}
                                >
                                  {item.category.categoryName}
                                </button>
                              )}
                              {item.tags?.map((tag) => (
                                <button
                                  key={tag.tagId}
                                  onClick={() => setActiveTag(tag.tagName)}
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] border transition-all duration-150 ${
                                    activeTag === tag.tagName
                                      ? "bg-indigo-500/30 text-indigo-200 border-indigo-500/60 font-semibold"
                                      : "bg-indigo-900/40 text-indigo-300 border-indigo-700/30 hover:bg-indigo-800/50"
                                  }`}
                                >
                                  # {tag.tagName}
                                </button>
                              ))}
                              {!item.category?.categoryName && item.tags?.length === 0 && (
                                <span className="text-[10px] text-slate-600 italic">Uncategorized</span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold text-[#c8a96e]">৳{item.unitPrice}</p>
                            {item.productCount && (
                              <p className="text-[10px] text-slate-500">×{item.productCount}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-[#c8a96e]/20 flex items-center justify-center">
                              <span className="text-[8px] text-[#c8a96e] font-bold">{item.user.userName[0]}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">{item.user.userName}</span>
                          </div>
                          <span className="text-[10px] text-slate-600">
                            {new Date(item.commentCreatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {/* ── Summary bar ── */}
        {!loading && !error && filteredDates.length > 0 && (
          <div className="mt-6 rounded-xl border border-[#c8a96e]/20 bg-[#c8a96e]/5 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-widest uppercase text-[#c8a96e]/60 mb-1">
                  {isFiltered ? "Filtered Total" : "Month Total"}
                </p>
                <p className="text-2xl font-bold text-[#c8a96e]">৳{filteredTotal}</p>
                {isFiltered && (
                  <p className="text-[10px] text-slate-500 mt-1">of ৳{grandTotal} month total</p>
                )}
              </div>
              <div className="text-right text-xs text-slate-500 space-y-1">
                {filteredDates.map((d) => (
                  <div key={d} className="flex items-center gap-3">
                    <span>{d}</span>
                    <span className="text-slate-400">
                      ৳{filteredGrouped[d].reduce((s, i) => s + i.unitPrice, 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}