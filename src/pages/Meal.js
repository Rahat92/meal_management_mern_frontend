import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { readableDate } from "../utils/readableDate";
import {
  useCreateMealMutation,
  useGetMonthlyMealsQuery,
  useGetMonthlyStatsQuery,
  useGetUsersQuery,
  useGetYearMonthQuery,
  useSignUpMutation,
  useUpdateBreakfastMutation,
  useUpdateDinnerMutation,
  useUpdateExtraShopMoneyMutation,
  useUpdateLunchMutation,
  useUpdateMealMutation,
  useUpdateMoneyMutation,
  useUpdateMyMealStatusMutation,
  useUpdatePersonFullMealMutation,
  useUpdateShopMoneyMutation,
} from "../features/bikri/bikriApi";
import { useDispatch, useSelector } from "react-redux";
import style from "./Meal.module.css";
import { locationPathChanged } from "../features/locationPath";
import FilterBox from "../components/FilterBox";
import getCurrentMonthLength from "../utils/getCurrentMonthLength";
import { createPortal } from "react-dom";
import FoodSelect from "../components/FoodSelect/FoodSelect";
import TableHeader from "../components/Table/TableHeader";
import AllUser from "../components/Table/AllUser/AllUser";
import getDayName from "../utils/getDayName";
import ShopModalPortal from "../components/Modal/ShopModal";
import ExtraShopModalPortal from "../components/Modal/ShopModal";
import DepositModalPortal from "../components/Modal/ShopModal";
const Meal = () => {
  const { user } = useSelector((state) => state.auth);
  const headRef = useRef();
  const tableBodyRef = useRef();
  const dateRef = useRef();
  const nameRef = useRef();
  const [arrOfMeals, setArrOfMeals] = useState([]);
  const [nowScroll, setNowScroll] = useState(false);
  const [item, setItem] = useState({});
  const [borderTotalDeposite, setBorderTotalDeposite] = useState(0);
  const [borderTotalShop, setBorderTotalShop] = useState(0);
  const [borderTotalMeal, setBorderTotalMeal] = useState(0);
  const [borderTotalExtraShop, setBorderTotalExtraShop] = useState(0);
  const [selectDate, setSelectDate] = useState(null)
  const [currentItem, setCurrentItem] = useState({});
  const [headHeight, setHeadHeight] = useState(0);
  const [focusOnShopField, setFocusOnShopField] = useState(false);
  const [focusOnExtraShopField, setFocusOnExtraShopField] = useState(false);
  const [focusOnDepositField, setFocusOnDepositField] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showExtraShopModal, setShowExtraShopModal] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(true);

  const [products, setProducts] = useState([
    { id: 1, removeProduct: false, productName: "", productCount: null, unitPrice: null },
  ]);
  const [extraShops, setExtraShops] = useState([
    { id: 1, removeProduct: false, productName: "", productCount: null, unitPrice: null },
  ]);
  const [deposits, setDeposits] = useState([
    { id: 1, removeDeposit: false, amount: null, reason: "" },
  ]);
  const [currentIndex, setCurrentIndex] = useState();
  const [id, setId] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [isChanged, setIsChanged] = useState(false);
  const [totalMeals, setTotalMeals] = useState([]);
  const [prevArrOfMeals, setPrevArrOfMeals] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [needUpdateObj, setNeedUpdateObj] = useState({});
  const [updatedArrOfMeals, setUpdatedArrOfMeals] = useState([]);
  const [screenWidth, setScreenWidth] = useState(null);
  const [moneyOption, setMoneyOption] = useState("");
  const [selectMeal, setSelectMeal] = useState({
    setMeal: false
  })

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);
  const depositModalRef = useRef(null);
  const extraShopModalRef = useRef(null);

  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();
  const todayDate = new Date().getDate();
  const { data: yearMonth } = useGetYearMonthQuery();
  const [updateLunch, { isLoading: updateLunchLoading, isSuccess: updateLunchSuccess, isError: isUpdateLunchError, error: updateLunchError }] = useUpdateLunchMutation()
  const [updateDinner, { isLoading: updateDinnerLoading, isSuccess: updateDinnerSuccess, isError: isUpdateDinnerError, error: updateDinnerError }] = useUpdateDinnerMutation()
  const [updateBreakfast, { isSuccess: updateBreakfastSuccess, isLoading: updateBreakfastLoading }] = useUpdateBreakfastMutation()
  const [getMonth, setGetMonth] = useState(todayMonth);
  const [getYear, setGetYear] = useState(todayYear);
  const selectMealRef = useRef(null)
  const [
    updateMoney,
    { data: money, isSuccess: isDepositeUpdateSuccess, isError: isUpdateMoneyError, error: updateMoneyError },
  ] = useUpdateMoneyMutation();
  const [
    updateShopMoney,
    { data: shopMoney, isSuccess: isShopMoneyUpdateSuccess, isError: isShopMoneyError, error: shopMoneyError },
  ] = useUpdateShopMoneyMutation();
  const [
    updateExtraShopMMoneMoney,
    {
      data: extraShopMoney,
      isSuccess: isExtraShopMoneyUpdateSuccess,
      isError: isShopExtraMoneyError,
      error: extraShopMoneyError,
    },
  ] = useUpdateExtraShopMoneyMutation();

  const [deposit, setDeposit] = useState({});
  const [shopping, setShopping] = useState({});
  const [extraShopping, setExtraShopping] = useState({});

  const handleClickOutside = (event) => {
    if (selectMealRef.current && !selectMealRef.current.contains(event.target)) {
      setSelectMeal({ ...selectMeal, setMeal: false })
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isUpdateMoneyError) {
      alert(updateMoneyError?.data.message);
    }
    if (isDepositeUpdateSuccess) {
      alert("Deposite updated successfully")
      setShowDepositModal(false)
      // fetch(`http://45.120.38.242/api/sendsms?api_key=01319193270.VXMtkxGPG7XwoldS2a&type=text&phone=${registeredUsers[index].phoneNo}&senderid=URCL&message=Dear ${registeredUsers[index].name} (vai), you are currently deposite ${deposite.money} Tk. Your total deposite is ${borderTotalDeposite} TK. Rahat(Meal Manager)=> Bachelor Point`).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.log(err))
    }
  }, [isUpdateMoneyError, isDepositeUpdateSuccess]);
  useEffect(() => {
    if (isShopMoneyError) {
      alert(shopMoneyError?.data?.message);
    }
    if (isShopMoneyUpdateSuccess) {
      // const copyArrOfMeals = [...arrOfMeals]
      // const desireMeal = copyArrOfMeals.find(item => item.id == shopping.id)
      // const desireMealIndex = copyArrOfMeals.findIndex((item => item.id === shopping.id))
      // const shoppingComment = [...desireMeal.shoppingComments]
      // const updatedComments = { ...shoppingComment[shopping.borderIndex], comment: products.filter(item => !item.removeProduct) };
      // shoppingComment[shopping.borderIndex] = updatedComments;
      // desireMeal.shoppingComments = shoppingComment;
      // copyArrOfMeals[desireMealIndex] = desireMeal;
      // setArrOfMeals([...copyArrOfMeals])
      setShowModal(false)
      alert("Shopping updated successfully")


      // fetch(`http://45.120.38.242/api/sendsms?api_key=01319193270.VXMtkxGPG7XwoldS2a&type=text&phone=${registeredUsers[index].phoneNo}&senderid=URCL&message=Dear ${registeredUsers[index].name} (vai), you are currently deposite ${deposite.money} Tk. Your total deposite is ${borderTotalDeposite} TK. Rahat(Meal Manager)=> Bachelor Point`).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.log(err))
      // fetch(`http://45.120.38.242/api/sendsms?api_key=01319193270.VXMtkxGPG7XwoldS2a&type=text&phone=${registeredUsers[index].phoneNo}&senderid=URCL&message=Dear ${registeredUsers[index].name}, you've done shopping worth ${shopping.shop} taka is added successfully. Rahat(Meal Manager)=> Bachelor Point`).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.log(err))
    }

  }, [isShopMoneyError, isShopMoneyUpdateSuccess]);
  useEffect(() => {
    if (isShopExtraMoneyError) {
      alert(extraShopMoneyError?.data?.message);
    }
    if (isExtraShopMoneyUpdateSuccess) {
      alert("Extra shopping updated successfully")
      setShowExtraShopModal(false)
    }
  }, [isShopExtraMoneyError, isExtraShopMoneyUpdateSuccess]);
  
  useEffect(() => {
    if (products) {
      console.log('wow', products.reduce((f, i) => Number(i.unitPrice) + f, 0))
    }
  }, [JSON.stringify(products)])
  

  const [
    updatePersonFullMeal,
    {
      isSuccess: fullMealUpdateSuccess,
      isError: fullMealUpdateError,
      error: fullMealError,
    },
  ] = useUpdatePersonFullMealMutation();
  const [updateMeal, { isLoading, isSuccess, isError, error }] =
    useUpdateMealMutation();
  const [
    updateMyMealStatus,
    {
      isError: isMealStatusError,
      error: mealStatusError,
      isSuccess: mealStatusSuccess,
    },
  ] = useUpdateMyMealStatusMutation();
  const { data: getMonthlyMealStats } = useGetMonthlyStatsQuery();
  const [signUp] = useSignUpMutation();
  const { data: users } = useGetUsersQuery();
  const [isSkipped, setIsSkipped] = useState(true);
  const { data: monthlyMeals, isLoading: isMealsLoading } =
    useGetMonthlyMealsQuery(
      { getMonth, getYear },
      {
        skip: !isSkipped,
      }
    );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(locationPathChanged(window.location.pathname));
  }, []);
  useEffect(() => {
  }, [yearMonth?.yearMonth]);
  let year = 2026;
  let month = 11;
  const currentDay = new Date().getDate();
  const monthLength = getCurrentMonthLength(month, year)

  useEffect(() => {
    if (isMealStatusError) {
      alert(mealStatusError?.data?.message);
    }
  }, [isMealStatusError]);

  useEffect(() => {
    if (fullMealUpdateError) {
      alert(fullMealError?.data?.message);
    }
  }, [fullMealUpdateError]);

  const [dates, setDates] = useState([]);

  useEffect(() => {
    let days = [];
    for (let i = 1; i <= monthLength; i++) {
      const time = readableDate(new Date(year, month, i));
      const readableYear = time.year;
      const readableMonth = time.month;
      const readableDay = time.day;
      days.push({
        date: `${readableDay} ${readableMonth} ${readableYear}`,
      });
    }
    // setDates(days);
    let borderIds = [];
    if (users?.borders?.length > 0) {
      users.borders.map((el) => {
        borderIds.push(el.name);
      });
      days = days.map((el) => {
        return {
          date: el.date,
          day: el.date.split(" ")[0],
          month,
          year,
          mealManager: "6570001d7e42deb0b24b9657",
        };
      });
    }
    setDates([...days]);
  }, [users?.borders]);
  useEffect(() => {
    if (user && user.role !== "admin" && user && user.role !== "superadmin") {
      setCurrentUser(user.name + " " + user._id);
    } else {
      setCurrentUser("all");
    }
  }, [user]);
  useEffect(() => {
    if (user && registeredUsers?.length > 0) {
      const index = registeredUsers.findIndex(
        (item) => item.name === user.name
      );
      if (user.role !== "admin" && user.role !== "superadmin") {
        setCurrentIndex(index);
      }
    }
  }, [user, registeredUsers]);
  useEffect(() => {
    // updateMeal({data:needUpdateObj,id})
  }, [needUpdateObj]);
  useEffect(() => {
    if (isSuccess) {
      setIsChanged(false);
      setUpdatedArrOfMeals([]);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (updateLunchLoading) {
      setIsChanged(true)
    }
    if (updateLunchSuccess) {
      setIsChanged(false)
      setUpdatedArrOfMeals([]);
    }
  }, [updateLunchSuccess, updateLunchLoading])
  useEffect(() => {
    if (updateDinnerLoading) {
      setIsChanged(true)
    }
    if (updateBreakfastLoading) {
      setIsChanged(true)
    }
    if (updateDinnerSuccess) {
      setIsChanged(false)
      setUpdatedArrOfMeals([]);
    }
    if (updateBreakfastSuccess) {
      setIsChanged(false)
      setUpdatedArrOfMeals([]);
    }
  }, [updateDinnerSuccess, updateDinnerLoading, updateBreakfastSuccess, updateBreakfastLoading])


  useEffect(() => {
    if (monthlyMeals?.monthlyMeals?.length > 0) {
      setRegisteredUsers([
        ...(monthlyMeals &&
          monthlyMeals.monthlyMeals &&
          monthlyMeals.monthlyMeals[0] &&
          monthlyMeals.monthlyMeals[0].border),
      ]);
      const mealsArr = monthlyMeals?.monthlyMeals?.map((el) => {
        return {
          id: el._id,
          date: el.date,
          day: el.day,
          month: el.month,
          year: el.year,
          breakfast: el.breakfast,
          launch: el.launch,
          dinner: el.dinner,
          money: el.money,
          shop: el.shop,
          shoppingComments: el.shoppingComments,
          extraShoppingComments: el.extraShoppingComments,
          depositComment: el.depositComment,
          extraShop: el.extraShop,
        };
      }).sort((a, b) => a.day - b.day);
      setArrOfMeals(mealsArr);
      setPrevArrOfMeals(mealsArr);
    }
  }, [monthlyMeals?.monthlyMeals]);
  // submain branch
  useEffect(() => {
    if (prevArrOfMeals?.length > 0) {
      const changedArr = arrOfMeals.filter((item, i) => {
        if (
          JSON.stringify(item.breakfast) !==
          JSON.stringify(prevArrOfMeals[i].breakfast) ||
          JSON.stringify(item.launch) !==
          JSON.stringify(prevArrOfMeals[i].launch) ||
          JSON.stringify(item.dinner) !==
          JSON.stringify(prevArrOfMeals[i].dinner)
        ) {
          return true;
        }
      });
      setUpdatedArrOfMeals([...changedArr]);
      if (changedArr.length > 0) {
        setIsChanged(true);
      }
    }
  }, [prevArrOfMeals, arrOfMeals]);

  useEffect(() => {
    let totalBorderDeposite = 0;
    let totalBorderShop = 0;
    let totalBorderExtraShop = 0;
    if (arrOfMeals.length > 0) {
      const totalMealsCalc = arrOfMeals.map((el) => {
        const totalBreakfast = el.breakfast.reduce((f, c) => f + c[0], 0);
        const totalLaunch = el.launch.reduce((f, c) => f + c[0], 0);
        const totalDinner = el.dinner.reduce((f, c) => f + c[0], 0);
        totalBorderDeposite += el.money[currentIndex];
        totalBorderShop += el.shop[currentIndex];
        totalBorderExtraShop += el.extraShop[currentIndex];
        return {
          id: el.id,
          date: el.date,
          totalBreakfast,
          totalLaunch,
          totalDinner,
        };
      });
      setTotalMeals([
        ...totalMealsCalc.sort(
          (a, b) => a.date.split(" ")[0] - b.date.split(" ")[0]
        ),
      ]);
    }
    setBorderTotalDeposite(totalBorderDeposite);
    setBorderTotalShop(totalBorderShop);
    setBorderTotalExtraShop(totalBorderExtraShop);
  }, [arrOfMeals, currentIndex]);

  const updateMealHandler = (e, date, id, mealIndex, mealName, type) => {
    if (e.target.value === 'off') {
      setSelectMeal({ ...selectMeal, mealStatus: 'on', e, date, id, mealIndex, mealName, type })
    } else {
      setSelectMeal({ ...selectMeal, mealStatus: 'off', e, date, id, mealIndex, mealName, type })
    }

    setId(id);

    const dateIndex = arrOfMeals.findIndex((item) => item.id === id);
    const copyArrOfMeals = [...arrOfMeals];
    const obj = copyArrOfMeals[dateIndex];
    const mealArr = obj[mealName];
    const copyMealArr = [...mealArr];
    const singleMeal = copyMealArr[mealIndex];
    const copySingleMeal = [...singleMeal];
    const r = copySingleMeal[0] =
      type === "checkbox" && e.target.value === "on"
        ? 0
        : e.target.value === "off"
          ? mealName === "breakfast"
            ? user?.manager?.morningMealCount || user?.morningMealCount
            : 1
          : e.target.value * 1;

    copySingleMeal[1] =
      type === "checkbox" ? (e.target.value === "on" ? "off" : "on") : "on";
    copySingleMeal[3] = 'meat'
    copyMealArr[mealIndex] = copySingleMeal;

    copyArrOfMeals[dateIndex] = { ...obj, [mealName]: copyMealArr };
    setArrOfMeals([...copyArrOfMeals]);
    const updatedDateObj = { ...obj, [mealName]: copyMealArr };
    let mealError = "";

    if (mealError) {
      alert(mealError);
      prevArrOfMeals[dateIndex] = { ...obj, [mealName]: mealArr };
      setArrOfMeals([...prevArrOfMeals]);
      return;
    }
  };
  const saveUpdate = () => {
    updatedArrOfMeals.map((el) => {
      updateMeal({ data: el, id: el.id });
    });
  };
  useEffect(() => {
    if (headRef.current) {
      setHeadHeight(headRef.current.offsetHeight);
    }
  }, [headRef?.current]);

  useEffect(() => {
    setMoneyOption("Deposite");
    setScreenWidth(window.screen.availWidth);
    window.addEventListener("resize", function () {
      setScreenWidth(window.screen.availWidth);
      setMoneyOption((prev) => (prev === "" ? "Deposite" : prev));
      if (window.screen.availWidth > 600) {
        setMoneyOption("Deposite");
      }
    });
  }, [window.screen]);
  useEffect(() => {
    let timer;
    if (arrOfMeals?.length > 0) {
      dateRef?.current?.scrollTo({
        top: (todayDate - 1) * 100,
        behavior: "smooth",
      });
      tableBodyRef?.current?.scrollTo({
        top: (todayDate - 1) * 100 + 5,
        behavior: "smooth",
      });
      timer = setTimeout(() => {
        setNowScroll(true);
      }, (todayDate - 1) * 100);
    }
    return () => clearTimeout(timer)
  }, [arrOfMeals?.length]);
  useEffect(() => {
    if (currentIndex !== undefined) {
      const totalBreakfast = arrOfMeals.filter((item) => item.day <= currentDay).reduce((f, c) => f + c['breakfast'][currentIndex][0], 0)
      const totalLunch = arrOfMeals.filter((item) => item.day <= currentDay).reduce((f, c) => f + c['launch'][currentIndex][0], 0)
      const totalDinner = arrOfMeals.filter((item) => item.day <= currentDay).reduce((f, c) => f + c['dinner'][currentIndex][0], 0)
      setBorderTotalMeal(totalBreakfast + totalLunch + totalDinner)
    }
  }, [currentIndex, isChanged])
  console.log(extraShops)
  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };
  const depositHandleChange = (index, field, value) => {
    const updated = [...deposits];
    updated[index][field] = value;
    setDeposits(updated);
  };
  const extraShopHandleChange = (index, field, value) => {
    const updated = [...extraShops];
    updated[index][field] = value;
    setExtraShops(updated);
  };

  const addProduct = () => {
    setProducts([...products, { id: products.length + 1, removeProduct: false, productName: "", productCount: null, unitPrice: null }]);
  };
  const addExtraShop = () => {
    setExtraShops([...extraShops, { id: extraShops.length + 1, removeExtraShop: false, productName: "", productCount: null, unitPrice: null }]);
  };
  const addDeposit = () => {
    setDeposits([...deposits, { id: deposits.length + 1, removeDeposit: false, amount: null, reason: '' }]);
  };

  const removeProduct = (productId) => {
    const updated = products.map((item, index) => {
      if (item.id === productId) {
        return {
          ...item,
          removeProduct: true,
        }
      } else {
        return {
          ...item
        }
      }
    })

    setProducts(updated);
  };
  const removeExtraShop = (extraShopId) => {
    // const updated = products.filter((_, i) => i !== index);
    const updated = extraShops.map((item, index) => {
      if (item.id === extraShopId) {
        return {
          ...item,
          removeExtraShop: true,
        }
      } else {
        return {
          ...item
        }
      }
    })

    setExtraShops(updated);
  };
  const removeDeposit = (depositId) => {
    // const updated = products.filter((_, i) => i !== index);
    const updated = deposits.map((item, index) => {
      if (item.id === depositId) {
        return {
          ...item,
          removeDeposit: true,
        }
      } else {
        return {
          ...item
        }
      }
    })

    setDeposits(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateShopMoney({
      id: shopping.id,
      year: shopping.year,
      month: shopping.month,
      borderIndex: shopping.borderIndex,
      shop: products.filter(item => !item.removeProduct).reduce((f, i) => Number(i.unitPrice) + f, 0),
      shoppingComments: products.filter(item => !item.removeProduct),
      customerId: currentUser.split(' ')[1]
    });
  };
  const handleExtraShopSubmit = (e) => {
    e.preventDefault();
    updateExtraShopMMoneMoney({
      id: extraShopping.id,
      year: extraShopping.year,
      month: extraShopping.month,
      borderIndex: extraShopping.borderIndex,
      extraShop: extraShops.filter(item => !item.removeExtraShop).reduce((f, i) => Number(i.unitPrice) + f, 0),
      extraShoppingComments: extraShops.filter(item => !item.removeExtraShop),
      customerId: currentUser.split(' ')[1]
    });
  };
  const handleDepositsSubmit = (e) => {
    e.preventDefault();
    updateMoney({
      id: deposit.id,
      year: deposit.year,
      month: deposit.month,
      borderIndex: deposit.borderIndex,
      money: deposits.filter(item => !item.removeDeposit).reduce((f, i) => Number(i.amount) + f, 0),
      depositComment: deposits.filter(item => !item.removeDeposit),
      customerId: currentUser.split(' ')[1]
    });
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.modal-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
    {/* shop modal */}
      {focusOnShopField && (
        <ShopModalPortal>
          <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm ${showModal ? 'flex' : 'hidden'} items-center justify-center z-50 transition-all duration-300`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div
              ref={modalRef}
              className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'default'
              }}
            >
              <div
                className="modal-header cursor-grab active:cursor-grabbing pb-5 border-b-2 border-gray-200 mb-6"
                onMouseDown={handleMouseDown}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Shop Details
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentUser.split(' ')[0]} • {selectDate}
                      </p>
                    </div>
                    <div className="font-bold text-black text-xl">{products?.reduce((f,c) => f+Number(c.unitPrice), 0)}</div>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                <div className="space-y-5">
                  {products?.map((product, index) => (
                    <div
                      key={product.id}
                      className={`bg-white border-2 border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${product.removeProduct ? 'hidden' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <h3 className="font-bold text-lg text-gray-800">
                            Product {index + 1}
                          </h3>
                        </div>
                        {products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(product.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Item Name
                          </label>
                          <input
                            type="text"
                            value={product.productName}
                            onChange={(e) =>
                              handleChange(index, "productName", e.target.value)
                            }
                            placeholder="Enter product name"
                            className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={product.productCount}
                            onChange={(e) =>
                              handleChange(index, "productCount", e.target.value)
                            }
                            placeholder="0"
                            className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Price
                          </label>
                          <input
                            type="number"
                            value={product.unitPrice}
                            onChange={(e) =>
                              handleChange(index, "unitPrice", e.target.value )
                            }
                            placeholder="0.00"
                            className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addProduct}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add More Product
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save All
                </button>
              </div>
            </div>

            <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `}</style>
          </div>

        </ShopModalPortal>
      )}
      {/* extraShop modal */}
      {focusOnExtraShopField && (
        <ExtraShopModalPortal>
          <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm ${showExtraShopModal ? 'flex' : 'hidden'} items-center justify-center z-50 transition-all duration-300`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div
              ref={extraShopModalRef}
              className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'default'
              }}
            >
              <div
                className="modal-header cursor-grab active:cursor-grabbing pb-5 border-b-2 border-gray-200 mb-6"
                onMouseDown={handleMouseDown}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Extra Shop Details
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentUser.split(' ')[0]} • {selectDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                <div className="space-y-5">
                  {extraShops?.map((extraShop, index) => (
                    <div
                      key={extraShop.id}
                      className={`bg-white border-2 border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${extraShop.removeExtraShop ? 'hidden' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <h3 className="font-bold text-lg text-gray-800">
                            Extra Shop {index + 1}
                          </h3>
                        </div>
                        {extraShops.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExtraShop(extraShop.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Item Name
                          </label>
                          <input
                            type="text"
                            value={extraShop.productName}
                            onChange={(e) =>
                              extraShopHandleChange(index, "productName", e.target.value)
                            }
                            placeholder="Enter product name"
                            className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={extraShop.productCount}
                            onChange={(e) =>
                              extraShopHandleChange(index, "productCount", e.target.value)
                            }
                            placeholder="0"
                            className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Price
                          </label>
                          <input
                            type="number"
                            value={extraShop.unitPrice}
                            onChange={(e) =>
                              extraShopHandleChange(index, "unitPrice", e.target.value)
                            }
                            placeholder="0.00"
                            className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addExtraShop}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add More ExtraShop
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowExtraShopModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExtraShopSubmit}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save All
                </button>
              </div>
            </div>

            <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `}</style>
          </div>

        </ExtraShopModalPortal>
      )}
      {/* deposit modal */}
      {focusOnDepositField && (
        <DepositModalPortal>
          <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm ${showDepositModal ? 'flex' : 'hidden'} items-center justify-center z-50 transition-all duration-300`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div
              ref={depositModalRef}
              className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'default'
              }}
            >
              <div
                className="modal-header cursor-grab active:cursor-grabbing pb-5 border-b-2 border-gray-200 mb-6"
                onMouseDown={handleMouseDown}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Shop Details
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentUser.split(' ')[0]} • {selectDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                <div className="space-y-5">
                  {deposits?.map((deposit, index) => (
                    <div
                      key={deposit.id}
                      className={`bg-white border-2 border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${deposit.removeDeposit ? 'hidden' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <h3 className="font-bold text-lg text-gray-800">
                            Amount {index + 1}
                          </h3>
                        </div>
                        {deposits.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDeposit(deposit.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Amount
                          </label>
                          <input
                            type="number"
                            value={deposit.amount}
                            onChange={(e) =>
                              depositHandleChange(index, "amount", e.target.value)
                            }
                            placeholder="0.00"
                            className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            Reason
                          </label>
                          <input
                            type="text"
                            value={deposit.reason}
                            onChange={(e) =>
                              depositHandleChange(index, "reason", e.target.value)
                            }
                            placeholder="Reason"
                            className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addDeposit}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add More Deposit
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDepositsSubmit}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save All
                </button>
              </div>
            </div>

            <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `}</style>
          </div>

        </DepositModalPortal>
      )}
      <FilterBox
        setGetMonth={setGetMonth}
        style={style}
        yearMonth={yearMonth}
        registeredUsers={registeredUsers}
        setCurrentIndex={setCurrentIndex}
        setCurrentUser={setCurrentUser}
        user={user}
        todayMonth={todayMonth}
        todayYear={todayYear}
        isLoading={isLoading}
        isChanged={isChanged}
      />
      {monthlyMeals?.monthlyMeals && monthlyMeals.monthlyMeals.length > 0 ? (
        <div ref={tableBodyRef} className="max-w-[1200px] mx-auto max-h-[80vh] rounded-lg text-black overflow-auto bg-black">
          <table className="">
            {/* table header */}
            <TableHeader
              currentUser={currentUser}
              registeredUsers={registeredUsers}
              screenWidth={screenWidth}
              setMoneyOption={setMoneyOption}
              moneyOption={moneyOption}
              borderTotalDeposite={borderTotalDeposite}
              borderTotalShop={borderTotalShop}
              borderTotalExtraShop={borderTotalExtraShop}
              borderTotalMeal={borderTotalMeal}
            />

            <tbody className="w-full overscroll-auto">
              <tr className={`h-1 bg-gray-300`}>
                {/* Table head bottom border start */}
                <td></td>
                {/* Table head bottom border end */}
                <td className="sticky left-[50px]"></td>
                <td className={""}></td>
                <td className=""></td>
                <td></td>
                <td></td>
                {registeredUsers?.length > 0 && registeredUsers.map(el => {
                  return (
                    <>
                      <td></td>
                      <td className="w-1 bg-gray-300"></td> {/* partial horizontal header border indicator */}
                    </>
                  )
                })}
                {/* problem */}
                <td className="w-1 sticky right-[100px] bg-gray-300 z-[-100]"></td>
              </tr>

              {/* table body rows */}
              {
                arrOfMeals?.length > 0 && arrOfMeals.map((el, i) => {
                  return (
                    <tr key={el.id} onClick={(e) => setSelectDate(el.date)} className={`h-[100px] ${selectDate === el.date ? 'bg-gray-300' : 'bg-gray-200'} ${i !== arrOfMeals.length - 1 && 'border-b-4'}`}> {/* Horizontal body meal border*/}
                      {/* <td className="bg-white text-black sticky left-0">{el.date}</td> */}
                      <td
                        onClick={() => {
                          if (currentUser.split(' ')[1] === user._id) {
                            setSelectMeal({ ...selectMeal, setMeal: true, el, date: el.date })
                          }
                        }}
                        className={`cursor-default ${currentUser === 'all' ? 'w-[50px]' : 'max-w-[50px]'}  text-black sticky left-0 text-center ${el.date.split(" ")[0] == todayDate ? "bg-green-500 text-white" : "bg-white"}`}
                      >
                        {/* {el.date?.split(" ")[0]}  Date body */}
                        <span className={`${getDayName(getYear, getMonth + 1, el.date.split(" ")[0]) === 'Friday' ? 'font-bold text-gray-800 text-2xl' : 'font-semibold'}`}>{getDayName(getYear, getMonth + 1, el.date.split(" ")[0]) === 'Friday' ? 'Fr' : el.date?.split(" ")[0] == currentDay ? <span className="text-[15px]">Today</span> : el.date?.split(" ")[0]}</span>
                      </td>
                      <td className="w-1 bg-gray-300  sticky left-[50px]"></td> {/*date body vertical border*/}
                      <td className={`${selectDate === el.date ? 'bg-gray-300' : 'bg-gray-200'} ${currentUser === 'all' ? 'w-[0px]' : 'w-[200px]'}  text-black md:sticky md:left-[54.39px] border-black h-[100px] pt-[5.5px]`}> {/* meal name body width */}
                        <table className="w-full text-center ml-1 h-full">
                          {['breakfast', 'launch', 'dinner'].map((meal, i) => {
                            return (
                              <tr>
                                <td className="text-left flex items-center">{meal}&nbsp;
                                  <div className="inline-block">
                                    <div className={`cursor-pointer`} >*</div>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </table>
                      </td>
                      <td className={`${currentUser == 'all' ? '' : 'hidden'} bg-gray-300 md:sticky md:left-[134.39px]`}></td> {/* Type body vertical right border element */}
                      <td className={`${currentUser === 'all' ? '' : 'hidden'} bg-gray-300`}></td> {/* first body vertical indicator */}

                      {/* For admin */}
                      <AllUser
                        registeredUsers={registeredUsers}
                        currentUser={currentUser}
                        el={el}
                        item={item}
                        setItem={setItem}
                        updateMealHandler={updateMealHandler}
                        updateLunch={updateLunch}
                        user={user}
                        currentIndex={currentIndex}
                        updateDinner={updateDinner}
                      />

                      {/* For customer */}
                      {registeredUsers?.length > 0 && registeredUsers.map((elem, index) => {
                        if (elem._id === currentUser.split(' ')[currentUser.split(' ').length - 1]) {
                          return (
                            <>
                              <td
                                className={`${currentUser === 'all' ? 'hidden' : ''} pl-5 `}
                                style={{
                                  width: "50px",
                                  textAlign: "center",
                                }}
                              >
                                <table
                                  style={{
                                    width: "100%",
                                    height: "86px",
                                  }}
                                >
                                  {/* breakfast section start */}
                                  <tr>
                                    <td style={{ width: "25%" }}>
                                      <div className="flex justify-start">

                                        {/* breakfast section start */}
                                        <select
                                          value={el.breakfast[index][0]}
                                          onChange={(e) => {
                                            if (
                                              user?.role === "user" &&
                                              new Date() >
                                              new Date(
                                                el.year,
                                                el.month,
                                                el.date.split(" ")[0],
                                                10
                                              )
                                            ) {
                                              alert("You can't change previous Meal!")
                                            }
                                            else {
                                              updateMealHandler(e, el.date, el.id, index, "breakfast")
                                              // updateLunch({id:el.id, borderIndex:index, })
                                              const breakfast = [...el.breakfast[index]]
                                              breakfast[0] = parseInt(e.target.value)
                                              breakfast[1] = parseInt(e.target.value) > 0 ? 'on' : 'off'
                                              breakfast[2] = user.role
                                              updateBreakfast({ id: el.id, borderIndex: index, breakfast })
                                            }
                                          }
                                          }
                                          disabled={
                                            // el.breakfast && el.breakfast[index] && el.breakfast[index][1] === "off"
                                            user?.manager?.morningMealCount === 0 || user?.morningMealCount === 0 || el.breakfast[index][1] == 'off'
                                          }
                                          onMouseEnter={() => {
                                            setItem({
                                              ...item,
                                              type: "text",
                                              borderIndex: index,
                                              date: el.date,
                                              mealName: "breakfast",
                                            });
                                          }}
                                          onMouseLeave={() => {
                                            setItem({});
                                          }}
                                          style={{ marginRight: '.5rem', border: '1px solid black' }} className="appearance-none border border-black-300  rounded h-[27px] w-[40px] text-center">
                                          <option value={el.breakfast[index][0]}>{el.breakfast[index][0] == 0 ? 'off' : el.breakfast[index][0]}</option>
                                          {[1, 2, 3, 0].filter(item => item != el.breakfast[index][0]
                                          ).map(el => <option value={el}>{el == 0 ? 'off' : el}</option>)}
                                        </select>
                                        {/* Breakfast checkbox */}
                                        {1 === 1 && (
                                          <>
                                            {/* &nbsp;&nbsp; */}
                                            <div className="inline-block relative ">

                                              <input
                                                style={{
                                                  paddingLeft: "1rem",
                                                }}
                                                type="checkbox"
                                                onChange={(e) => {

                                                  if (
                                                    user?.role === "user" &&
                                                    new Date() >
                                                    new Date(
                                                      el.year,
                                                      el.month,
                                                      el.date.split(" ")[0],
                                                      10
                                                    )
                                                  ) {
                                                    alert("You can't change previous Meal!")
                                                  }
                                                  else {
                                                    updateMealHandler(
                                                      e,
                                                      el.date,
                                                      el.id,
                                                      index,
                                                      "breakfast",
                                                      "checkbox"
                                                    )
                                                    const breakfast = [...el.breakfast[index]]
                                                    breakfast[0] = e.target.value === 'off' ? (user?.manager?.morningMealCount || user?.morningMealCount) : 0
                                                    breakfast[1] = e.target.value === 'off' ? 'on' : 'off'
                                                    breakfast[2] = user.role
                                                    updateBreakfast({ id: el.id, borderIndex: index, breakfast })
                                                  }


                                                }

                                                }
                                                value={el.breakfast[index][1]}
                                                checked={el.breakfast[index][1] === "on" ? true : false}
                                              />

                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                  {/* breakfast section end */}

                                  {/* Customer Launch section start */}
                                  <tr style={{}}>
                                    <td style={{ width: '25%' }}>
                                      <div className={`flex justify-start items-center`}>                                        <select
                                        value={el.launch[index][0]}
                                        onChange={(e) => {
                                          if (
                                            user?.role === "user" &&
                                            new Date() >
                                            new Date(
                                              el.year,
                                              el.month,
                                              el.date.split(" ")[0],
                                              10
                                            )
                                          ) {
                                            alert("You can't change previous Meal!")
                                          }

                                          else {
                                            updateMealHandler(e, el.date, el.id, index, "launch")
                                            // updateLunch({id:el.id, borderIndex:index, })
                                            const lunch = [...el.launch[index]]
                                            lunch[0] = parseInt(e.target.value)
                                            lunch[1] = parseInt(e.target.value) > 0 ? 'on' : 'off'
                                            lunch[2] = user.role
                                            updateLunch({ id: el.id, borderIndex: index, lunch })
                                          }
                                        }
                                        }
                                        disabled={
                                          el.launch && el.launch[index] && el.launch[index][1] === "off"
                                        }
                                        onMouseEnter={() => {
                                          setItem({
                                            ...item,
                                            type: "text",
                                            borderIndex: index,
                                            date: el.date,
                                            mealName: "launch",
                                          });
                                        }}
                                        onMouseLeave={() => {
                                          setItem({});
                                        }}
                                        style={{ marginRight: '.5rem', border: '1px solid black' }} className="appearance-none border border-black-300  rounded h-[27px] w-[40px] text-center">
                                        <option value={el.launch[index][0]}>{el.launch[index][0] == 0 ? 'off' : el.launch[index][0]}</option>
                                        {[1, 2, 3, 0].filter(item => item != el.launch[index][0]).map(el => <option value={el}>{el == 0 ? 'off' : el}</option>)}
                                      </select>

                                        <div className="flex justify-start gap-2">
                                          {1 === 1 && (
                                            <input
                                              style={{
                                                paddingLeft: "1rem",
                                              }}
                                              type="checkbox"
                                              onChange={(e) => {

                                                if (
                                                  user?.role === "user" &&
                                                  new Date() >
                                                  new Date(
                                                    el.year,
                                                    el.month,
                                                    el.date.split(" ")[0],
                                                    10
                                                  )
                                                ) {
                                                  alert("You can't change previous Meal!")
                                                }
                                                else {
                                                  updateMealHandler(
                                                    e,
                                                    el.date,
                                                    el.id,
                                                    index,
                                                    "launch",
                                                    "checkbox"
                                                  )
                                                  const lunch = [...el.launch[index]]
                                                  lunch[0] = e.target.value === 'off' ? 1 : 0
                                                  lunch[1] = e.target.value === 'off' ? 'on' : 'off'
                                                  lunch[2] = user.role
                                                  updateLunch({ id: el.id, borderIndex: index, lunch })
                                                }


                                              }

                                              }
                                              value={el.launch[index][1]}
                                              checked={el.launch[index][1] === "on" ? true : false}
                                            />
                                          )}
                                          <input
                                            checked={
                                              // el["breakfast"][index][1] === "on" ||
                                              el["launch"][index][1] === "on" ||
                                              el["dinner"][index][1] === "on"
                                            }
                                            value={
                                              // el["breakfast"][index][1] === "on" ||
                                              el["launch"][index][1] === "on" ||
                                                el["dinner"][index][1] === "on"
                                                ? "off"
                                                : "on"
                                            }
                                            type="checkbox"
                                            onChange={(e) => {
                                              const copyArrOfMeals = [...arrOfMeals];

                                              const desireItemIndex = copyArrOfMeals.findIndex(
                                                (item) => item.id === el.id
                                              );
                                              const desireItem = copyArrOfMeals[desireItemIndex];
                                              const breakfastArr = [...desireItem["breakfast"]];
                                              const launchArr = [...desireItem["launch"]];
                                              const dinnerArr = [...desireItem["dinner"]];

                                              breakfastArr[index] =
                                                e.target.value === "off"
                                                  ? [0, "off", "admin"]
                                                  : [0, "on", "admin"];
                                              launchArr[index] =
                                                e.target.value === "off"
                                                  ? [0, "off", "admin"]
                                                  : [1, "on", "admin"];
                                              dinnerArr[index] =
                                                e.target.value === "off"
                                                  ? [0, "off", "admin"]
                                                  : [1, "on", "admin"];

                                              const copyDesireItem = {
                                                ...desireItem,
                                                breakfast: breakfastArr,
                                                launch: launchArr,
                                                dinner: dinnerArr,
                                              };
                                              copyArrOfMeals[desireItemIndex] = copyDesireItem;
                                              setArrOfMeals([...copyArrOfMeals]);
                                              let mealError = "";
                                              if (
                                                new Date() >
                                                new Date(
                                                  el.year,
                                                  el.month,
                                                  el.date.split(" ")[0] * 1,
                                                  6
                                                ) &&
                                                (user.role === "user" || user.role === "admin")
                                              ) {
                                                mealError = "Full meal request time is over";
                                              }
                                              if (mealError) {
                                                alert(mealError);
                                                // prevArrOfMeals[desireItemIndex] = { ...obj, [mealName]: mealArr };
                                                setArrOfMeals([...prevArrOfMeals]);
                                                return;
                                              }

                                              const lunch = [...el.launch[index]]
                                              lunch[0] = e.target.value === 'on' ? 1 : 0
                                              lunch[1] = e.target.value === 'on' ? 'on' : 'off'
                                              lunch[2] = user.role
                                              updateLunch({ id: el.id, borderIndex: index, lunch })
                                              const dinner = [...el.dinner[index]]
                                              dinner[0] = e.target.value === 'on' ? 1 : 0
                                              dinner[1] = e.target.value === 'on' ? 'on' : 'off'
                                              dinner[2] = user.role
                                              updateDinner({ id: el.id, borderIndex: index, dinner })
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        width: "25%",
                                        display:
                                          screenWidth < 600 && moneyOption !== "Deposite" ? "none" : "",
                                      }}
                                    >
                                      {/* deposit field */}
                                      <input
                                        type="text"
                                        onFocus={() => {
                                          setFocusOnDepositField(true);
                                          setShowDepositModal(true)
                                          setSelectDate(el.date)
                                          setCurrentItem(arrOfMeals.find(item => item.date === el.date))
                                          setDeposit({
                                            id: el.id,
                                            month: el.month,
                                            year: el.year,
                                            borderIndex: index,
                                          });
                                          console.log(el.date, selectDate)
                                          console.log(el)
                                          setDeposits(el.depositComment.find(comment => comment.user === currentUser.split(' ')[1])?.comment?.map((item, i) => {
                                            return {
                                              id: i + 1,
                                              removeDeposit: false,
                                              ...item
                                            }
                                          }))
                                          // setProducts()

                                          // copyshops[index] = e.target.value * 1;
                                          // arrOfMeals[desireMealIndex] = {
                                          //   ...copyDesireMeal,
                                          //   shop: copyshops,
                                          // };
                                          // setArrOfMeals([...arrOfMeals]);

                                          // setShopping({
                                          //   id: el.id,
                                          //   month: el.month,
                                          //   year: el.year,
                                          //   borderIndex: index,
                                          //   shop: e.target.value * 1,
                                          // });

                                        }}
                                        onChange={(e) => {
                                          if (user?.role === "user") {
                                            alert("Only admin can update deposite");
                                            return;
                                          }
                                          // const desireMealIndex = arrOfMeals.findIndex(
                                          //   (item) => item.id === el.id
                                          // );
                                          // const desireMeal = arrOfMeals[desireMealIndex];
                                          // const copyDesireMeal = { ...desireMeal };
                                          // const moneys = copyDesireMeal.money;
                                          // const copyMoneys = [...moneys];
                                          // copyMoneys[index] = e.target.value * 1;
                                          // arrOfMeals[desireMealIndex] = {
                                          //   ...copyDesireMeal,
                                          //   money: copyMoneys,
                                          // };

                                          // setArrOfMeals([...arrOfMeals]);

                                          // setDeposit({
                                          //   id: el.id,
                                          //   year: el.year,
                                          //   month: el.month,
                                          //   borderIndex: index,
                                          //   money: e.target.value * 1,
                                          // });
                                        }}
                                        value={el.money[index] === 0 ? "" : el.money[index]}
                                        placeholder="Deposite"
                                        style={{
                                          color: "black",
                                          // border: "1px solid black",
                                          // borderRadius: "5px",
                                          width: "80px",
                                          textAlign: "center",
                                        }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        width: "25%",
                                        display:
                                          screenWidth < 600 && moneyOption !== "Shopping" ? "none" : "",
                                      }}
                                    >
                                      {/* shop input field */}
                                      <input
                                        type="text"
                                        onFocus={() => {
                                          setFocusOnShopField(true);
                                          setShowModal(true)
                                          setSelectDate(el.date)
                                          setCurrentItem(arrOfMeals.find(item => item.date === el.date))
                                          setShopping({
                                            id: el.id,
                                            month: el.month,
                                            year: el.year,
                                            borderIndex: index,
                                          });
                                          console.log(el.date, selectDate)
                                          setProducts(el.shoppingComments.find(comment => comment.user === currentUser.split(' ')[1]).comment?.map((item, i) => {
                                            return {
                                              id: i + 1,
                                              removeProduct: false,
                                              ...item
                                            }
                                          }))
                                          // setProducts()

                                          // copyshops[index] = e.target.value * 1;
                                          // arrOfMeals[desireMealIndex] = {
                                          //   ...copyDesireMeal,
                                          //   shop: copyshops,
                                          // };
                                          // setArrOfMeals([...arrOfMeals]);

                                          // setShopping({
                                          //   id: el.id,
                                          //   month: el.month,
                                          //   year: el.year,
                                          //   borderIndex: index,
                                          //   shop: e.target.value * 1,
                                          // });

                                        }}

                                        onChange={(e) => {
                                          if (user?.role === "user") {
                                            alert("Only admin can update shop");
                                            return;
                                          }
                                          // const desireMealIndex = arrOfMeals.findIndex(
                                          //   (item) => item.id === el.id
                                          // );
                                          // const desireMeal = arrOfMeals[desireMealIndex];
                                          // const copyDesireMeal = { ...desireMeal };
                                          // const shops = copyDesireMeal.shop;
                                          // const copyshops = [...shops];
                                          // copyshops[index] = e.target.value * 1;
                                          // arrOfMeals[desireMealIndex] = {
                                          //   ...copyDesireMeal,
                                          //   shop: copyshops,
                                          // };
                                          // setArrOfMeals([...arrOfMeals]);

                                          // setShopping({
                                          //   id: el.id,
                                          //   month: el.month,
                                          //   year: el.year,
                                          //   borderIndex: index,
                                          //   shop: e.target.value * 1,
                                          // });
                                        }}
                                        placeholder="Shopping"
                                        value={el.shop[index] === 0 ? "" : el.shop[index]}
                                        style={{
                                          color: "black",
                                          width: "80px",
                                          textAlign: "center",
                                        }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        width: "25%",
                                        display:
                                          screenWidth < 600 && moneyOption !== "Extra" ? "none" : "",
                                      }}
                                    >
                                      {/* extra shop input field */}
                                      <input
                                        type="text"
                                        onFocus={() => {
                                          setFocusOnExtraShopField(true);
                                          setShowExtraShopModal(true)
                                          setSelectDate(el.date)
                                          setCurrentItem(arrOfMeals.find(item => item.date === el.date))
                                          setExtraShopping({
                                            id: el.id,
                                            month: el.month,
                                            year: el.year,
                                            borderIndex: index,
                                          });
                                          console.log(el.date, selectDate)
                                          console.log(el)
                                          setExtraShops(el.extraShoppingComments.find(comment => comment.user === currentUser.split(' ')[1])?.comment?.map((item, i) => {
                                            return {
                                              id: i + 1,
                                              removeExtraShop: false,
                                              ...item
                                            }
                                          }))
                                          // setProducts()

                                          // copyshops[index] = e.target.value * 1;
                                          // arrOfMeals[desireMealIndex] = {
                                          //   ...copyDesireMeal,
                                          //   shop: copyshops,
                                          // };
                                          // setArrOfMeals([...arrOfMeals]);

                                          // setShopping({
                                          //   id: el.id,
                                          //   month: el.month,
                                          //   year: el.year,
                                          //   borderIndex: index,
                                          //   shop: e.target.value * 1,
                                          // });

                                        }}
                                        onChange={(e) => {
                                          if (
                                            new Date() >
                                            new Date(
                                              el.year,
                                              el.month,
                                              el.date.split(" ")[0] * 1,
                                              24
                                            ) &&
                                            user?.role == "admin"
                                          ) {
                                            alert(
                                              "The date is passed. You can't update previous day's extra shop"
                                            );
                                            return;
                                          }
                                          if (user?.role === "user") {
                                            alert("Only admin can update extra shop");
                                            return;
                                          }
                                          // const desireMealIndex = arrOfMeals.findIndex(
                                          //   (item) => item.id === el.id
                                          // );
                                          // const desireMeal = arrOfMeals[desireMealIndex];
                                          // const copyDesireMeal = { ...desireMeal };
                                          // const extraShops = copyDesireMeal.extraShop;
                                          // const copyExtraShops = [...extraShops];
                                          // copyExtraShops[index] = e.target.value * 1;
                                          // arrOfMeals[desireMealIndex] = {
                                          //   ...copyDesireMeal,
                                          //   extraShop: copyExtraShops,
                                          // };
                                          // setArrOfMeals([...arrOfMeals]);
                                          // setExtraShopping({
                                          //   id: el.id,
                                          //   month: el.month,
                                          //   year: el.year,
                                          //   borderIndex: index,
                                          //   extraShop: e.target.value * 1,
                                          // });
                                        }}
                                        placeholder="Extra"
                                        value={el.extraShop[index] === 0 ? "" : el.extraShop[index]}
                                        style={{
                                          color: "black",
                                          width: "80px",
                                          textAlign: "center",
                                        }}
                                      />
                                    </td>
                                  </tr>
                                  {/* dinner section end */}
                                  <tr>
                                    <td>
                                      <div className={`flex justify-start`}>
                                        <select
                                          value={el.dinner[index][0]}
                                          onChange={(e) => {
                                            if (
                                              user?.role === "user" &&
                                              new Date() >
                                              new Date(
                                                el.year,
                                                el.month,
                                                el.date.split(" ")[0],
                                                18
                                              )
                                            ) {
                                              alert("You can't change previous Meall!")
                                            }
                                            else {
                                              updateMealHandler(e, el.date, el.id, index, "dinner")
                                              // updateLunch({id:el.id, borderIndex:index, })
                                              const dinner = [...el.dinner[index]]
                                              dinner[0] = parseInt(e.target.value)
                                              dinner[1] = parseInt(e.target.value) > 0 ? 'on' : 'off'
                                              dinner[2] = user.role
                                              updateDinner({ id: el.id, borderIndex: index, dinner })
                                            }
                                          }
                                          }
                                          disabled={
                                            el.dinner && el.dinner[index] && el.dinner[index][1] === "off"
                                          }
                                          onMouseEnter={() => {
                                            setItem({
                                              ...item,
                                              type: "text",
                                              borderIndex: index,
                                              date: el.date,
                                              mealName: "dinner",
                                            });
                                          }}
                                          onMouseLeave={() => {
                                            setItem({});
                                          }}
                                          style={{ marginRight: '.5rem', border: '1px solid black' }} className="appearance-none border border-black-300  rounded h-[27px] w-[40px] text-center">
                                          <option value={el.dinner[index][0]}>{el.dinner[index][0] == 0 ? 'off' : el.dinner[index][0]}</option>
                                          {[1, 2, 3, 0].filter(item => item != el.dinner[index][0]).map(el => <option value={el}>{el == 0 ? 'off' : el}</option>)}
                                        </select>
                                        {/* {currentIndex === index && ( */}
                                        {1 === 1 && (
                                          <>
                                            <input
                                              value={el.dinner[index][1]}
                                              onChange={(e) => {
                                                if (
                                                  user?.role === "user" &&
                                                  new Date() >
                                                  new Date(
                                                    el.year,
                                                    el.month,
                                                    el.date.split(" ")[0],
                                                    18
                                                  )
                                                ) {
                                                  alert("You can't change previous Meall!")
                                                }
                                                else {
                                                  updateMealHandler(
                                                    e,
                                                    el.date,
                                                    el.id,
                                                    index,
                                                    "dinner",
                                                    "checkbox"
                                                  )
                                                  const dinner = [...el.dinner[index]]
                                                  dinner[0] = e.target.value === 'off' ? 1 : 0
                                                  dinner[1] = e.target.value === 'off' ? 'on' : 'off'
                                                  dinner[2] = user.role
                                                  updateDinner({ id: el.id, borderIndex: index, dinner })
                                                }
                                              }
                                              }

                                              type="checkbox"
                                              checked={el.dinner[index][1] === "on" ? true : false}
                                            />
                                          </>
                                        )}

                                      </div>
                                    </td>

                                  </tr>
                                </table>
                              </td >
                              {/* for customer */}
                              <td td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 bg-green-500`
                              }>& nbsp;</td>
                            </>
                          )
                        }

                      })}
                      <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 sticky right-[50px] md:right-[100px] bg-gray-300`}>&nbsp;</td> {/* Total meal left border element */}

                      {/* total meal calculation */}
                      <td className={`${currentUser == 'all' ? '' : 'hidden'} bg-white text-black sticky right-0 font-bold`}>
                        <table className="w-full text-center">
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              {totalMeals.length > 0 && totalMeals.find((item) => item.date === el.date)?.totalBreakfast}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              {totalMeals.length > 0 && totalMeals.find((item) => item.date === el.date)?.totalLaunch}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              {totalMeals.length > 0 && totalMeals.find((item) => item.date === el.date)?.totalDinner}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table >
        </div >
      ) : isMealsLoading ? (
        <div className="fixed top-0 z-[-10] left-0 right-0 justify-center items-center h-screen">
          <div className="w-full h-full flex justify-center items-center">
            <h1 className="text-2xl font-bold w-full text-center">Loading sheets</h1>
          </div>
        </div>
      ) : (
        // not found message
        <div className="fixed top-0 z-[-10] left-0 right-0 justify-center items-center h-screen">
          <div className="w-full h-full flex justify-center items-center">
            <h1 className="text-2xl font-bold w-full text-center">No Meal Sheets Found</h1>
          </div>
        </div>
      )}
      {createPortal(<FoodSelect selectMeal={selectMeal} user={user} currentUser={currentUser} currentIndex={currentIndex} setSelectMeal={setSelectMeal} />, document.querySelector('#food'))}
    </>
  );
};

export default Meal;
