import React, { useRef, useEffect, useState } from "react";
import {
  useGetMonthlyMealsQuery,
  useGetMonthlyStatsQuery,
  useGetYearMonthQuery,
  useSendSmsMutation,
} from "../features/bikri/bikriApi";
import LoaderComponent from "../components/LoaderComponent";
import { useDispatch, useSelector } from "react-redux";
import { locationPathChanged } from "../features/locationPath";
import { Link } from "react-router-dom";
import getCurrentMonthLength from "../utils/getCurrentMonthLength";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, highlight, positive }) => {
  const valueColor =
    highlight
      ? "text-red-700"
      : positive === true
      ? "text-green-700"
      : positive === false
      ? "text-red-700"
      : "text-gray-900";

  return (
    <div className="bg-gray-100 rounded-xl p-3">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-xl font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
};

// ─── Select Field ─────────────────────────────────────────────────────────────
const FilterSelect = ({ label, value, onChange, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="h-9 px-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm min-w-[110px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {children}
    </select>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AllMonthsStats = () => {
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();
  const { user } = useSelector((state) => state.auth);

  const [mealStatMonthly, setMealStatMonthly] = useState([]);
  const [selectBorder, setSelectBorder] = useState();
  const [display, setDisplay] = useState(false);
  const [nowScroll, setNowScroll] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const [day, setDay] = useState(new Date().getDate());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [overAllCurrentMeal, setOverAllCurrentMeal] = useState(0);
  const [overAllDeposite, setOverAllDeposite] = useState(0);
  const [overAllExpense, setOverAllExpense] = useState(0);
  const [overAllExtraExpense, setOverAllExtraExpense] = useState(0);
  const [overAllMealExpense, setOverAllMealExpense] = useState(0);
  const [mealRate, setMealRate] = useState(0);
  const [overAllMeal, setOverAllMeal] = useState(0);
  console.log(year, month, day)
  const { data: getMonthlyMealStats, isLoading } = useGetMonthlyStatsQuery({
    year,
    mealManager: user?.role === "admin" ? user?._id : user?.manager._id,
    month,
    day,
  });
  console.log(getMonthlyMealStats)
  const { data: monthlyMeals } = useGetMonthlyMealsQuery({
    getMonth: month,
    getYear: 2026,
  });

  const currentBorders = monthlyMeals?.monthlyMeals?.[0]?.border;
  console.log(user)
  const { data: yearMonth } = useGetYearMonthQuery(`${user?.role === 'admin' ? user?._id : user?.manager._id}`);
  const [yearMonthArr, setYearMonthArr] = useState([]);
  const [sendSms] = useSendSmsMutation();

  const mainBodyRef = useRef();
  const dispatch = useDispatch();

  // ── Stats calculation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (getMonthlyMealStats?.data?.length > 0) {
      setOverAllCurrentMeal(
        getMonthlyMealStats.dailyTotals
          .filter((item) => item.day <= 15)
          .reduce((f, c) => f + c.totalBreakfast + c.totalLunch + c.totalDinner, 0)
      );
      setOverAllDeposite(
        getMonthlyMealStats.dailyTotals
          .filter((item) => item.day <= day)
          .reduce((f, c) => f + c.deposit, 0)
      );
      setOverAllMealExpense(
        getMonthlyMealStats.dailyTotals
          .filter((item) => item.day <= day)
          .reduce((f, c) => f + c.mealExpense, 0)
      );
      console.log(getMonthlyMealStats.dailyTotals
          .reduce((f, c) => f + c.overAllExpense, 0))
      setOverAllExpense(
        getMonthlyMealStats.dailyTotals
          .filter((item) => item.day <= day)
          .reduce((f, c) => f + c.overAllExpense, 0)
      );
      setOverAllExtraExpense(
        getMonthlyMealStats.dailyTotals.reduce((f, c) => f + c.extraExpense, 0)
      );
      setOverAllMeal(
        getMonthlyMealStats.dailyTotals
          .filter((item) => item.day <= day)
          .reduce((f, c) => f + c.totalBreakfast + c.totalLunch + c.totalDinner, 0)
      );
    }
  }, [getMonthlyMealStats?.data?.length, day]);
  console.log(overAllExpense, day)
  useEffect(() => {
    if (overAllMeal > 0 && overAllMealExpense > 0) {
      setMealRate((overAllMealExpense / overAllMeal).toFixed(2));
    }
  }, [overAllMeal, overAllMealExpense]);

  useEffect(() => {
    if (todayMonth && todayYear && yearMonth?.yearMonth?.length > 0) {
      setYearMonthArr(
        yearMonth.yearMonth.filter((el) => el.month !== todayMonth)
      );
    }
  }, [yearMonth?.yearMonth?.length, todayMonth, todayYear]);
  console.log(getMonthlyMealStats);
  useEffect(() => {
    if (getMonthlyMealStats?.monthlyMeals?.length > 0) {
      let mealInfo = [];
      let borders = [], breakfasts = [], launchs = [], dinners = [];
      let monthsArr = [], moneys = [], shops = [], extraShops = [];

      getMonthlyMealStats.monthlyMeals.map((el) => {
        monthsArr.push(el._id);
        mealInfo.push([]);
        borders.push(
          el.border.map(
            (itm) => currentBorders?.find((item) => item._id === itm)
          )
        );
        breakfasts.push(el.breakfast);
        launchs.push(el.launch);
        dinners.push(el.dinner);
        moneys.push(el.money);
        shops.push(el.shop);
        extraShops.push(el.extraShop);
      });

      borders.map((border, i) => {
        let arrEle = [], finalArr = [];
        border.map((el, elIndex) => {
          const index = arrEle.findIndex((item) => item.id === el?._id);
          if (index !== -1) {
            const obj = arrEle[index];
            arrEle[index] = {
              ...obj,
              breakfast: obj.breakfast + breakfasts[i][elIndex][0],
              launch: obj.launch + launchs[i][elIndex][0],
              dinner: obj.dinner + dinners[i][elIndex][0],
              money: obj.money + moneys[i][elIndex],
              shop: obj.shop + shops[i][elIndex],
              extraShop: obj.extraShop + extraShops[i][elIndex],
            };
          } else {
            arrEle.push({
              id: el?._id,
              border: el?.name,
              breakfast: breakfasts[i][elIndex][0],
              launch: launchs[i][elIndex][0],
              dinner: dinners[i][elIndex][0],
              money: moneys[i][elIndex],
              shop: shops[i][elIndex],
              extraShop: extraShops[i][elIndex],
            });
          }
          finalArr = arrEle.map((el) => ({
            border: el.border,
            border_id: el.id,
            breakfast: el.breakfast,
            launch: el.launch,
            dinner: el.dinner,
            totalMeal: el.breakfast + el.launch + el.dinner,
            totalMoney: el.money,
            totalShop: el.shop,
            totalExtraShop: el.extraShop,
          }));
        });
        mealInfo[i] = {
          month: monthsArr[i]?.month + " " + monthsArr[i]?.year,
          overAllShop: finalArr.reduce((f, c) => f + c.totalShop, 0),
          overAllExtraShop: finalArr.reduce((f, c) => f + c.totalExtraShop, 0),
          overAllMoney: finalArr.reduce((f, c) => f + c.totalMoney, 0),
          finalArr,
          totalMeal: finalArr.reduce((f, c) => f + c.totalMeal, 0),
          mealRate:
            finalArr.reduce((f, c) => f + c.totalShop, 0) /
            finalArr.reduce((f, c) => f + c.totalMeal, 0),
        };
      });
      setMealStatMonthly(mealInfo);
    }
  }, [getMonthlyMealStats?.monthlyMeals, currentBorders]);

  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);

  useEffect(() => {
    if (mealStatMonthly?.length > 0) {
      const borderIndex = mealStatMonthly[0]?.finalArr.findIndex(
        (item) => item.border === user?.name
      );
      mainBodyRef?.current?.scrollTo({ top: borderIndex * 48, behavior: "smooth" });
      setTimeout(() => setNowScroll(true), 1000);
    }
  }, [mealStatMonthly, user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [month, year, day, pageSize]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const allRows = getMonthlyMealStats?.data || [];
  const totalRows = allRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const paginatedRows = allRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const restBalance = (overAllDeposite - overAllExpense).toFixed(2);

  if (isLoading) return <LoaderComponent />;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 pb-12">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Meal Statistics</h1>
        <p className="text-sm text-gray-500 mt-1">
          {MONTHS[month-1]} {year} &mdash; up to day {day}
        </p>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-end mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <FilterSelect
          label="Year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </FilterSelect>

        <FilterSelect
          label="Month"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
        </FilterSelect>

        <FilterSelect
          label="Up to day"
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
        >
          {new Array(getCurrentMonthLength(0)).fill(0).map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </FilterSelect>

        <FilterSelect
          label="Rows per page"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </FilterSelect>
      </div>

      {getMonthlyMealStats?.data?.length > 0 && (
        <>
          {/* ── Stat cards ─────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
            <StatCard label="Overall meals"   value={overAllMeal} />
            <StatCard label="Total deposit"   value={`৳${overAllDeposite}`} />
            <StatCard label="Total expense"   value={`৳${overAllExpense}`} />
            <StatCard label="Meal rate"       value={`৳${mealRate}`} highlight />
            <StatCard label="Extra expense"   value={`৳${overAllExtraExpense}`} />
            <StatCard label="Meal expense"    value={`৳${overAllMealExpense}`} />
            <StatCard
              label="Rest balance"
              value={`৳${restBalance}`}
              positive={Number(restBalance) >= 0}
            />
            <StatCard label="Total members"   value={getMonthlyMealStats.totalUsers} />
          </div>

          {/* ── Data table ─────────────────────────────────────────────────────── */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">

            {/* Scrollable table area */}
            <div
              ref={mainBodyRef}
              className="overflow-x-auto overflow-y-auto max-h-[420px]"
            >
              <table className="w-full border-collapse text-[13px] min-w-[1100px]">
                <thead>
                  <tr>
                    {[
                      "Name", "Breakfast", "Lunch", "Dinner",
                      "Total meals", "Shopping",
                      "Extra shopping",
                      "Deposit", "Consume", "Balance"
                    ].map((h) => (
                      <th
                        key={h}
                        className={`${h==='Name'?'sticky left-0 top-0 border-r border-gray-200 bg-white z-[21]':''} z-10 px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 whitespace-nowrap`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedRows.map((item) => {
                    const isMe  = item.userId === user?._id;
                    const isSel = user?.role === "superadmin" && item.userId === selectBorder;

                    // Per-person calculations
                    const breakfast = item.meals
                      .filter((m) => m.day <= day)
                      .reduce((f, c) => f + c.breakfast, 0);
                    const lunch = item.meals
                      .filter((m) => m.day <= day)
                      .reduce((f, c) => f + c.lunch, 0);
                    const dinner = item.meals
                      .filter((m) => m.day <= day)
                      .reduce((f, c) => f + c.dinner, 0);
                    const totalMeal = breakfast + lunch + dinner;
                    const shopping = item.meals
                      .filter((m) => m.day <= day)
                      .reduce((f, c) => f + c.expense, 0);
                    const extraShopping = item.meals
                      .filter((m) => m.day <= day)
                      .reduce((f, c) => f + c.exExpense, 0);
                    const deposit = item.meals
                      .filter((m) => m.day <= day)
                      .reduce((f, c) => f + c.deposit, 0);
                    const consume = (
                      item.meals
                        .filter((m) => m.day <= day)
                        .reduce(
                          (f, c) => f + mealRate * (c.breakfast + c.lunch + c.dinner),
                          0
                        ) +
                      overAllExtraExpense / getMonthlyMealStats.totalUsers
                    ).toFixed(2);
                    const balance = (item.totalDeposit - Number(consume)).toFixed(2);
                    const balPos  = Number(balance) >= 0;

                    // Row & sticky-cell background
                    const rowClass = isMe
                      ? "bg-green-100 hover:bg-green-200"
                      : isSel
                      ? "bg-blue-100 hover:bg-blue-200"
                      : "hover:bg-gray-50";
                    const stickyBg = isMe ? "bg-green-100" : isSel ? "bg-blue-100" : "bg-white";

                    return (
                      <tr
                        key={item.userId}
                        onClick={() =>
                          user?.role === "superadmin" && setSelectBorder(item.userId)
                        }
                        className={`border-b border-gray-100 transition-colors ${rowClass} ${
                          user?.role === "superadmin" ? "cursor-pointer" : ""
                        }`}
                      >
                        {/* Sticky name column */}
                        <td
                          className={`sticky left-0 z-[5] text-gray-800 px-3 py-2.5 font-medium whitespace-nowrap border-r border-gray-200 ${stickyBg}`}
                        >
                          <span className="mr-1.5">{item.name}</span>
                          {isMe && (
                            <span className="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 align-middle">
                              me
                            </span>
                          )}
                        </td>

                        <td className="px-3 py-2.5 whitespace-nowrap text-gray-800">{breakfast}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-gray-800">{lunch}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-gray-800">{dinner}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap font-semibold text-gray-900">{totalMeal}</td>

                        {/* Shared overall cells */}

                        <td className="px-3 py-2.5 whitespace-nowrap text-gray-800">{shopping}</td>


                        <td className="px-3 py-2.5 whitespace-nowrap text-gray-800">{extraShopping}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-gray-800">{deposit}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-gray-800">{consume}</td>

                        {/* Per-person balance */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              balPos
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {balPos ? "+" : ""}৳{balance}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
              
            {/* ── Pagination footer ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 border-t border-gray-200 bg-gray-50">
              <span className="text-xs text-gray-500">
                Showing{" "}
                {totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, totalRows)} of {totalRows} members
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 min-w-[32px] px-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ←
                </button>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`e-${i}`} className="px-1 text-gray-400 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`h-8 min-w-[32px] px-2.5 border rounded-lg text-sm flex items-center justify-center transition-colors ${
                        p === currentPage
                          ? "bg-blue-100 text-blue-700 border-blue-300 font-semibold"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 min-w-[32px] px-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Previous months dropdown (original logic) ─────────────────────────── */}
      <div
        id="dropdownInformation"
        className={`${
          display ? "block" : "hidden"
        } mt-3 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 border border-gray-200`}
      >
        <div className="px-4 py-2.5 text-sm font-semibold text-gray-900">
          {MONTHS[todayMonth]} {todayYear}
        </div>
        <ul className="py-1.5 text-sm text-gray-700">
          {yearMonth?.yearMonth
            ?.filter(
              (el) =>
                `${el.month}+${el.year}` !== `${todayMonth}+${todayYear}`
            )
            ?.map((el) => (
              <li key={`${el.month}-${el.year}`}>
                <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  {MONTHS[el.month]} {el.year}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AllMonthsStats;