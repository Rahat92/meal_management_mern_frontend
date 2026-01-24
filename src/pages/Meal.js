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
  const [products, setProducts] = useState([
    { id:1, removeProduct:false, productName: "", productCount: null, unitPrice: null },
  ]);
  const [currentIndex, setCurrentIndex] = useState();
  console.log(currentIndex)
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
    updateExtraShopMoney,
    {
      data: extraShopMoney,
      isSuccess: isExtraShopMoneyUpdateSuccess,
      isError: isShopExtraMoneyError,
      error: extraShopMoneyError,
    },
  ] = useUpdateExtraShopMoneyMutation();

  const [deposite, setDeposite] = useState({});
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
      // fetch(`http://45.120.38.242/api/sendsms?api_key=01319193270.VXMtkxGPG7XwoldS2a&type=text&phone=${registeredUsers[index].phoneNo}&senderid=URCL&message=Dear ${registeredUsers[index].name} (vai), you are currently deposite ${deposite.money} Tk. Your total deposite is ${borderTotalDeposite} TK. Rahat(Meal Manager)=> Bachelor Point`).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.log(err))
    }
  }, [isUpdateMoneyError, isDepositeUpdateSuccess]);
  useEffect(() => {
    if (isShopMoneyError) {
      alert(shopMoneyError?.data?.message);
    }
    if (isShopMoneyUpdateSuccess) {
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
    }
  }, [isShopExtraMoneyError, isExtraShopMoneyUpdateSuccess]);
  console.log('Hello world')
  useEffect(() => {
    const timer = setTimeout(() => {
      if (deposite?.id) {
        updateMoney({
          id: deposite.id,
          year: deposite.year,
          month: deposite.month,
          borderIndex: deposite.borderIndex,
          money: deposite.money,
        });
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [deposite]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (shopping?.id) {
  //       updateShopMoney({
  //         id: shopping.id,
  //         year: shopping.year,
  //         month: shopping.month,
  //         borderIndex: shopping.borderIndex,
  //         shop: shopping.shop,
  //         shoppingComments: products
  //       });
  //     }
  //   }, 1000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);
  useEffect(() => {
    if (products) {
      console.log('wow', products.reduce((f, i) => Number(i.unitPrice) + f, 0))
    }
  }, [JSON.stringify(products)])
  useEffect(() => {
    const timer = setTimeout(() => {
      if (extraShopping?.id) {
        updateExtraShopMoney({
          id: extraShopping.id,
          year: extraShopping.year,
          month: extraShopping.month,
          borderIndex: extraShopping.borderIndex,
          extraShop: extraShopping.extraShop,
        });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [extraShopping]);

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
  let year = 2024;
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
          extraShop: el.extraShop,
        };
      }).sort((a, b) => a.day - b.day);
      setArrOfMeals(mealsArr);
      setPrevArrOfMeals(mealsArr);
    }
  }, [monthlyMeals?.monthlyMeals]);
  // submain branch
  console.log(monthlyMeals?.monthlyMeals)
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
    // let updatedArr = [];
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
  console.log(products)
  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };
  
  const addProduct = () => {
    setProducts([...products, { id:products.length+1, removeProduct:false, productName: "", productCount: null, unitPrice: null }]);
  };

  const removeProduct = (productId) => {
    // const updated = products.filter((_, i) => i !== index);
    const updated = products.map((item, index) => {
      if(item.id === productId){
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
    // setShopping({
    //   ...shopping,
    //    shop: products.reduce((f, i) => Number(i.unitPrice) + f, 0),
    // })
  };
  return (
    <>
      {focusOnShopField && (
        <ShopModalPortal>
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[95%] max-w-lg max-h-[90vh] overflow-y-auto">

              <h2 className="text-xl font-bold mb-4 text-black">Shop Details of ({currentUser.split(' ')[0]}) {selectDate}</h2>

              <form onSubmit={handleSubmit}>
                {products?.map((product, index) => (
                  <div key={product.id} className={`border p-4 mb-4 rounded-lg ${product.removeProduct?'hidden':''}`}>
                    <h3 className="font-semibold mb-2 text-black">
                      Product {index + 1}
                    </h3>

                    {/* Item Name */}
                    <div className="mb-3">
                      <label className="block text-sm font-bold mb-1 text-black">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={product.productName}
                        onChange={(e) =>
                          handleChange(index, "productName", e.target.value)
                        }
                        className="border rounded w-full px-3 py-2 text-black"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="mb-3">
                      <label className="block text-sm font-bold mb-1 text-black">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={product.productCount}
                        onChange={(e) =>
                          handleChange(index, "productCount", e.target.value)
                        }
                        className="border rounded w-full px-3 py-2 text-black"
                      />
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <label className="block text-sm font-bold mb-1 text-black">
                        Price
                      </label>
                      <input
                        type="number"
                        value={product.unitPrice}
                        onChange={(e) =>
                          handleChange(index, "unitPrice", e.target.value)
                        }
                        className="border rounded w-full px-3 py-2 text-black"
                      />
                    </div>

                    {/* Remove */}
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="text-red-500 text-sm"
                      >
                        Remove Product
                      </button>
                    )}
                  </div>
                ))}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={addProduct}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    + Add More
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Save All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFocusOnShopField(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </ShopModalPortal>
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
        <div ref={tableBodyRef} className="max-w-[1200px] mx-auto max-h-[80vh] rounded-lg text-black overflow-auto">
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
                                      <input

                                        type="text"
                                        onChange={(e) => {
                                          if (user?.role === "user") {
                                            alert("Only admin can update deposite");
                                            return;
                                          }
                                          const desireMealIndex = arrOfMeals.findIndex(
                                            (item) => item.id === el.id
                                          );
                                          const desireMeal = arrOfMeals[desireMealIndex];
                                          const copyDesireMeal = { ...desireMeal };
                                          const moneys = copyDesireMeal.money;
                                          const copyMoneys = [...moneys];
                                          copyMoneys[index] = e.target.value * 1;
                                          arrOfMeals[desireMealIndex] = {
                                            ...copyDesireMeal,
                                            money: copyMoneys,
                                          };

                                          setArrOfMeals([...arrOfMeals]);

                                          setDeposite({
                                            id: el.id,
                                            year: el.year,
                                            month: el.month,
                                            borderIndex: index,
                                            money: e.target.value * 1,
                                          });
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
                                      <input
                                        type="text"
                                        onFocus={() => {
                                          setFocusOnShopField(true);
                                          setSelectDate(el.date)
                                          setCurrentItem(arrOfMeals.find(item => item.date === el.date))
                                          setShopping({
                                            id: el.id,
                                            month: el.month,
                                            year: el.year,
                                            borderIndex: index,
                                          });
                                          console.log(el.date, selectDate)
                                          if(el.date !== selectDate){
                                            setProducts(el.shoppingComments.find(comment => comment.user === currentUser.split(' ')[1]).comment?.map((item, i) => {
                                              return {
                                                id: i+1,
                                                removeProduct: false,
                                                ...item
                                              }
                                            }))
                                          }
                                          // setProducts()
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
                                      <input
                                        type="text"
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
                                          const desireMealIndex = arrOfMeals.findIndex(
                                            (item) => item.id === el.id
                                          );
                                          const desireMeal = arrOfMeals[desireMealIndex];
                                          const copyDesireMeal = { ...desireMeal };
                                          const extraShops = copyDesireMeal.extraShop;
                                          const copyExtraShops = [...extraShops];
                                          copyExtraShops[index] = e.target.value * 1;
                                          arrOfMeals[desireMealIndex] = {
                                            ...copyDesireMeal,
                                            extraShop: copyExtraShops,
                                          };
                                          setArrOfMeals([...arrOfMeals]);
                                          setExtraShopping({
                                            id: el.id,
                                            month: el.month,
                                            year: el.year,
                                            borderIndex: index,
                                            extraShop: e.target.value * 1,
                                          });
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
