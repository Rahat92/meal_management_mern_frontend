import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, User, Tag, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMarketingSummaryWithCategoryQuery } from '../features/productCategory/productCategoryApi';
import { useDispatch, useSelector } from 'react-redux';
import { locationPathChanged } from '../features/locationPath';
import { useGetYearMonthQuery } from '../features/bikri/bikriApi';

export default function MealExpenseSummary() {
    const todayMonth = new Date().getMonth() + 1;
    const todayYear = new Date().getFullYear();

    const [selectedUser, setSelectedUser] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTag, setSelectedTag] = useState('all');

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { user } = useSelector((state) => state.auth);
    const [getYear, setGetYear] = useState(todayYear);
    const [getMonth, setGetMonth] = useState(todayMonth);

    const { data: yearMonths } = useGetYearMonthQuery(user?.manager?._id, {
        skip: !user?.manager?._id,
    });

    const getMonthName = (monthNumber) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[parseInt(monthNumber) - 1] || "";
    };

    const [totalExpense, setTotalExpense] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(locationPathChanged(window.location.pathname));
    }, []);

    const {
        data: marketingData,
        isSuccess: marketingDataLoadSuccess,
        isFetching: marketingDataFetching,
    } = useMarketingSummaryWithCategoryQuery(
        {
            year: getYear,
            month: getMonth,
            user: selectedUser === "all" ? "" : selectedUser,
            category: selectedCategory === "all" ? "" : selectedCategory,
            tag: selectedTag === "all" ? "" : selectedTag,
            page,
            limit,
        },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );

    const expenseData = marketingData?.data || {};
    const pagination = marketingData?.pagination || { total: 0, page: 1, limit, totalPages: 1 };

    useEffect(() => {
        if (marketingDataLoadSuccess) {
            setTotalExpense(marketingData?.data?.summary?.[0]?.totalExpense || 0);
            setTotalTransactions(marketingData?.data?.summary?.[0]?.totalTransactions || 0);
        }
    }, [marketingDataLoadSuccess, marketingData]);

    // ============================
    // Reset month/year change: clear every filter
    // ============================
    useEffect(() => {
        setSelectedUser('all');
        setSelectedCategory('all');
        setSelectedTag('all');
    }, [getMonth, getYear]);

    // Any filter or page-size change should snap back to page 1 —
    // otherwise you can get stuck on a page number that no longer exists.
    useEffect(() => {
        setPage(1);
    }, [getMonth, getYear, selectedUser, selectedCategory, selectedTag, limit]);

    // ============================
    // Reset children ONLY when their parent actually changes
    // (not on every expenseData refetch)
    // ============================
    useEffect(() => {
        setSelectedCategory('all');
        setSelectedTag('all');
    }, [selectedUser]);

    useEffect(() => {
        setSelectedTag('all');
    }, [selectedCategory]);

    // ============================
    // User list — built once from the unfiltered summary
    // ============================
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if (users.length === 0 && expenseData?.userSummary?.length) {
            setUsers(expenseData.userSummary.map(item => ({
                id: item.userId || 'unknown',
                name: item.name || 'Unknown'
            })));
        }
    }, [expenseData]);

    // ============================
    // Category options — always come from categoryOptionsSummary, which the
    // backend computes ignoring the category (and tag) filter, so picking a
    // category never removes the other categories from this dropdown.
    // It still narrows to the selected user when one is picked.
    // ============================
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        setCategories((expenseData?.categoryOptionsSummary || []).map(item => ({
            id: item.categoryId || 'uncategorized',
            name: item.name || 'Uncategorized'
        })));
    }, [expenseData]);

    // ============================
    // Tag options — always come from tagOptionsSummary, which the backend
    // computes ignoring the tag filter, so picking a tag never removes the
    // other tags from this dropdown. It still narrows to the selected
    // user and/or category when those are picked.
    // ============================
    const [tags, setTags] = useState([]);
    useEffect(() => {
        setTags((expenseData?.tagOptionsSummary || []).map(item => ({
            tagId: item.tagId,
            tagName: item.tagName
        })));
    }, [expenseData]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Expense Summary</h1>
                    <p className="text-slate-600">{getMonthName(getMonth)} {getYear} - Track your spending</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Filter By Date</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                                value={`${getMonth} ${getYear}`}
                                onChange={(e) => {
                                    setGetYear(e.target.value.split(" ")[1] * 1);
                                    setGetMonth(e.target.value.split(" ")[0] * 1);
                                }}
                            >
                                {yearMonths?.result?.map((ym) => (
                                    <option className='text-slate-700' key={`${ym.year}-${ym.month}`} value={`${ym.month} ${ym.year}`}>
                                        {getMonthName(ym.month)} {ym.year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by User</label>
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                            >
                                <option value="all">All Users</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Tag</label>
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                            >
                                <option value="all">All Tags</option>
                                {tags.map(tag => (
                                    <option key={tag.tagId} value={tag.tagId}>{tag.tagName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <TrendingUp className="w-6 h-6 opacity-80" />
                        </div>
                        <h3 className="text-sm font-medium opacity-90 mb-1">Total Expenses</h3>
                        <p className="text-4xl font-bold">৳{totalExpense}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <Package className="w-8 h-8" />
                            </div>
                            <Calendar className="w-6 h-6 opacity-80" />
                        </div>
                        <h3 className="text-sm font-medium opacity-90 mb-1">Total Transactions</h3>
                        <p className="text-4xl font-bold">{totalTransactions}</p>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <Tag className="w-5 h-5 text-blue-600 mr-2" />
                        <h2 className="text-xl font-bold text-slate-800">Expenses by Category ({expenseData?.categorySummary?.length || 0})</h2>
                    </div>
                    <div className="space-y-3">
                        {expenseData?.categorySummary?.map(({ total, name, categoryId }) => {
                            const percentage = totalExpense ? (total / totalExpense) * 100 : 0;
                            return (
                                <div key={categoryId} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-700 font-medium">{name}</span>
                                        <span className="text-slate-900 font-semibold">৳{total.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* User Breakdown */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <User className="w-5 h-5 text-purple-600 mr-2" />
                        <h2 className="text-xl font-bold text-slate-800">Expenses by User</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {expenseData?.userSummary?.map(({ name, total, userId }) => (
                            <div key={userId} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                            {name?.charAt(0)}
                                        </div>
                                        <span className="font-semibold text-slate-800">{name}</span>
                                    </div>
                                    <span className="text-lg font-bold text-purple-600">৳{total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tag Breakdown */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <User className="w-5 h-5 text-purple-600 mr-2" />
                        <h2 className="text-xl font-bold text-slate-800">Expenses by Tag ({expenseData?.tagSummary?.length || 0})</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {expenseData?.tagSummary?.map(({ tagName, tagId, total }) => (
                            <div key={tagId} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                            {tagName?.charAt(0)}
                                        </div>
                                        <span className="font-semibold text-slate-800">{tagName}</span>
                                    </div>
                                    <span className="text-lg font-bold text-purple-600">৳{total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-600">Rows per page</label>
                            <select
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                {[5, 10, 25, 50, 100].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Product</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Category</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Quantity</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">User</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Amount</th>
                                </tr>
                            </thead>
                            <tbody className={marketingDataFetching ? 'opacity-50' : ''}>
                                {expenseData?.recent?.length ? expenseData.recent.map(({ date, product, category, amount, quantity, user: rowUser }, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 text-sm text-slate-600">{date}</td>
                                        <td className="py-3 px-4 text-sm text-slate-800 font-medium">{product}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                {category || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-700">{quantity}</td>
                                        <td className="py-3 px-4 text-sm text-slate-700">{rowUser}</td>
                                        <td className="py-3 px-4 text-sm text-right font-semibold text-slate-900">৳{amount}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="py-6 text-center text-sm text-slate-500">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-500">
                            {pagination.total === 0
                                ? 'No results'
                                : `Showing ${(pagination.page - 1) * pagination.limit + 1}–${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total}`}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={pagination.page <= 1}
                                className="p-2 rounded-lg border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-slate-600 min-w-[90px] text-center">
                                Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
                            </span>
                            <button
                                type="button"
                                onClick={() => setPage(p => Math.min(pagination.totalPages || 1, p + 1))}
                                disabled={pagination.page >= pagination.totalPages}
                                className="p-2 rounded-lg border border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                aria-label="Next page"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}