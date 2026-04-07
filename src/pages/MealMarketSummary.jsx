import React, { useState, useMemo, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, User, Tag, Package } from 'lucide-react';
import { useMarketingSummaryWithCategoryQuery } from '../features/productCategory/productCategoryApi';
import { useDispatch, useSelector } from 'react-redux';
import { locationPathChanged } from '../features/locationPath';
import { useGetYearMonthQuery } from '../features/bikri/bikriApi';

export default function MealExpenseSummary() {
    const todayMonth = new Date().getMonth() + 1;
    const todayYear = new Date().getFullYear();
    const [selectedUser, setSelectedUser] = useState('all');
    console.log(selectedUser)
    const [selectedTag, setSelectedTag] = useState('all');

    const { user } = useSelector((state) => state.auth);
    const [getYear, setGetYear] = useState(todayYear);
    const [getMonth, setGetMonth] = useState(todayMonth);
    
    const { data: yearMonths, isSuccess: yearMonthsSuccess, isLoading: yearMonthsLoading } = useGetYearMonthQuery(user?.manager?._id, {
        skip: !user?.manager?._id,
    });
    const getMonthName = (monthNumber) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[parseInt(monthNumber) - 1] || "";
    };
    const [totalExpense, setTotalExpense] = useState(0)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(locationPathChanged(window.location.pathname));
    }, []);
    const [skip, setSkip] = useState(true);

    const managerId = user?.role === 'admin' ? user?._id : user?.manager._id;
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { data: marketingData, isSuccess: marketingDataLoadSuccess, isLoading, isError } = useMarketingSummaryWithCategoryQuery({ year: getYear, month: getMonth, user: selectedUser === 'all' ? "" : selectedUser, category: selectedCategory === 'all' ? "" : selectedCategory, tag: selectedTag === 'all' ? "" : selectedTag });
    const expenseData = marketingData?.data || [];
    console.log(expenseData)
    const [totalTransactions, setTotalTransactions] = useState(0);
    useEffect(() => {
        if (marketingDataLoadSuccess) {
            setTotalExpense(marketingData?.data?.summary[0]?.totalExpense)
            setTotalTransactions(marketingData?.data?.summary[0]?.totalTransactions)
        }
    }, [marketingDataLoadSuccess, marketingData, getMonth, getYear, selectedUser, selectedCategory, selectedTag])
    // useMemo(() => {
    //     let filteredData = expenseData;
    //     if (selectedCategory !== 'all') {
    //         filteredData = filteredData.categorySummary.filter(item =>
    //             item.categoryId === selectedCategory || (!item.categoryId && selectedCategory === 'uncategorized')
    //         );
    //     }
    //     if (selectedUser !== 'all') {
    //         filteredData = filteredData?.userSummary?.filter(item => item.userId === selectedUser);
    //     }
    //     if (selectedTag !== 'all') {
    //         filteredData = filteredData?.tagSummary?.filter(item => item.tagId === selectedTag);
    //     }

    //     const totalExpense = expenseData;
    //     console.log(totalExpense)
    //     const byCategory = {};
    //     const byUser = {};
    //     const byTag = {};
    //     // filteredData.forEach(item => {
    //     //     const category = item.category.categoryName || 'Uncategorized';
    //     //     const user = item.user.userName;
    //     //     const tagList = item.tags || [];

    //     //     byCategory[category] = (byCategory[category] || 0) + item.unitPrice;
    //     //     byUser[user] = (byUser[user] || 0) + item.unitPrice;
    //     //     tagList.forEach(tag => {
    //     //         console.log(tag)
    //     //         byTag[tag.tagName] = (byTag[tag.tagName] || 0) + item.unitPrice;
    //     //     });
    //     // });

    //     return { totalExpense: 0, totalItems: 0, byCategory, byUser, byTag, filteredData, marketingDataLoadSuccess };
    // }, [selectedCategory, selectedUser, selectedTag]);

    useEffect(() => {
        setSelectedUser('all');
        setSelectedCategory('all');
        setSelectedTag('all');
    }, [getMonth, getYear, yearMonthsSuccess])
    // const categories = [...new Set(expenseData?.categorySummary?.map(item => ({
    //     id: item.categoryId || 'uncategorized',
    //     name: item.name || 'Uncategorized'
    // })).map(c => JSON.stringify(c)))].map(c => JSON.parse(c));

    // const users = [...new Set(expenseData?.userSummary?.map(item => ({
    //     id: item.userId,
    //     name: item.name
    // })).map(u => JSON.stringify(u)))].map(u => JSON.parse(u));
    // let tags = [...new Set(expenseData?.tagSummary?.map(item => item).flat())].filter(Boolean);
    // // Remove duplicate tags based on tagId
    // const uniqueTagsMap = {};
    // tags.forEach(tag => {
    //     if (!uniqueTagsMap[tag.tagId]) {
    //         uniqueTagsMap[tag.tagId] = tag;
    //     }
    // });
    // tags = Object.values(uniqueTagsMap);
    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    console.log(users)
    useEffect(() => {
        if (users.length === 0) {
            setUsers(expenseData?.userSummary?.map(item => ({
                id: item.userId,
                name: item.name
            })) || [])
        }
        if (tags.length === 0) {
            setTags(expenseData?.tagSummary?.map(item => ({
                tagId: item.tagId,
                tagName: item.tagName
            })) || [])
        }
        if (categories.length === 0) {
            setCategories(expenseData?.categorySummary?.map(item => ({
                id: item.categoryId || 'uncategorized',
                name: item.name || 'Uncategorized'
            })) || [])
        }
    }, [marketingDataLoadSuccess, expenseData])
    console.log(marketingDataLoadSuccess)
    console.log(tags)
    console.log(categories)
    console.log(users)
    useEffect(() => {
        if (yearMonthsSuccess && marketingDataLoadSuccess && selectedUser === 'all' && selectedCategory === 'all' && selectedTag === 'all') {
            console.log(yearMonthsSuccess, marketingDataLoadSuccess)
            setUsers(expenseData?.userSummary?.map(item => ({
                id: item.userId,
                name: item.name
            })) || []);
            setTags(expenseData?.tagSummary?.map(item => ({
                tagId: item.tagId,
                tagName: item.tagName
            })) || []);
            setCategories(expenseData?.categorySummary?.map(item => ({
                id: item.categoryId || 'uncategorized',
                name: item.name || 'Uncategorized'
            })) || []);
        }
    }, [yearMonthsSuccess, expenseData])
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Expense Summary</h1>
                    <p className="text-slate-600">February 2026 - Track your spending</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Filter By Date</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                                onChange={(e) => {
                                    setGetYear(e.target.value.split(" ")[1] * 1);
                                    setGetMonth(e.target.value.split(" ")[0] * 1);
                                }}
                            >
                                {yearMonths?.result?.map((ym) => (
                                    <option selected={ym.month === todayMonth && ym.year === todayYear} className='text-slate-700' key={`${ym.year}-${ym.month}`} value={`${ym.month} ${ym.year}`}>
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
                                onChange={(e) => {
                                    console.log(e.target.value)
                                    setSelectedUser(e.target.value)
                                }}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-500"
                            >
                                <option value="all">All Users</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
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
                        <h2 className="text-xl font-bold text-slate-800">Expenses by Category</h2>
                    </div>
                    <div className="space-y-3">
                        {marketingData?.data?.categorySummary?.map(({ total, name, categoryId }) => {
                            const percentage = (total / totalExpense) * 100;
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
                        {marketingData?.data?.userSummary?.map(({ name, total, userId }) => (
                            <div key={userId} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                            {name.charAt(0)}
                                        </div>
                                        <span className="font-semibold text-slate-800">{name}</span>
                                    </div>
                                    <span className="text-lg font-bold text-purple-600">৳{total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <User className="w-5 h-5 text-purple-600 mr-2" />
                        <h2 className="text-xl font-bold text-slate-800">Expenses by Tag</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {console.log(marketingData?.data?.tagSummary)}
                        {marketingData?.data?.tagSummary?.map(({ tagName, tagId, total }) => (
                            <div key={tagId} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                            {tagName.charAt(0)}
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
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Transactions</h2>
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
                            <tbody>
                                {marketingData?.data?.recent?.map(({ date, product, category, amount,quantity, user }, index) => {
                                    return (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-4 text-sm text-slate-600">{date}</td>
                                            <td className="py-3 px-4 text-sm text-slate-800 font-medium">{product}</td>
                                            <td className="py-3 px-4 text-sm">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                    {category || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-slate-700">{quantity}</td>
                                            <td className="py-3 px-4 text-sm text-slate-700">{user}</td>
                                            <td className="py-3 px-4 text-sm text-right font-semibold text-slate-900">৳{amount}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
