import React from "react";
import style from "./UserHomeTable.module.css";
const UserHomeTable = ({
  el,
  index,
  arrOfMeals,
  setArrOfMeals,
  updateMealHandler,
  updatePersonFullMeal,
  registeredUsers,
  user,
  updateMoney,
  updateShopMoney,
  prevArrOfMeals,
  updateExtraShopMoney,
  screenWidth,
  moneyOption,
}) => {
  return (
    <>
      <td className={style.userHomeTableTd}>
        <table>
          <tr>
            <td style={{ width: "25%" }}>
              <input
                style={{
                  color: "black",
                  background: "white",
                  border: "1.5px solid black",
                  borderRadius: "5px",
                  width: "40px",
                  textAlign: "center",
                  marginRight: ".5rem",
                }}
                disabled={
                  el.breakfast &&
                  el.breakfast[index] &&
                  el.breakfast[index][1] === "off"
                }
                onChange={(e) =>
                  updateMealHandler(e, el.date, el.id, index, "breakfast")
                }
                type={
                  el.breakfast &&
                  el.breakfast[index] &&
                  el.breakfast[index][1] === "off"
                    ? "text"
                    : "number"
                }
                value={
                  el.breakfast &&
                  el.breakfast[index] &&
                  el.breakfast[index][1] === "off"
                    ? "off"
                    : el.breakfast &&
                      el.breakfast[index] &&
                      el.breakfast[index][0] === 0
                    ? ""
                    : el.breakfast &&
                      el.breakfast[index] &&
                      el.breakfast[index][0]
                }
              />
              {/* {currentIndex === index && ( */}
              {1 === 1 && (
                <>
                  <input
                    type="checkbox"
                    value={el.breakfast[index][1]}
                    onChange={(e) =>
                      updateMealHandler(
                        e,
                        el.date,
                        el.id,
                        index,
                        "breakfast",
                        "checkbox"
                      )
                    }
                    checked={el.breakfast[index][1] === "on" ? true : false}
                  />
                </>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ position: "relative" }}>
              <input
                type={
                  el.launch && el.launch[index] && el.launch[index][1] === "off"
                    ? "text"
                    : "number"
                }
                style={{
                  color: "black",
                  background: "white",
                  border: "1.5px solid black",
                  borderRadius: "5px",
                  width: "40px",
                  textAlign: "center",
                  marginRight: ".5rem",
                }}
                disabled={
                  el.launch && el.launch[index] && el.launch[index][1] === "off"
                }
                onChange={(e) =>
                  updateMealHandler(e, el.date, el.id, index, "launch")
                }
                value={
                  el.launch && el.launch[index] && el.launch[index][1] === "off"
                    ? "off"
                    : el.launch && el.launch[index] && el.launch[index][0] === 0
                    ? ""
                    : el.launch && el.launch[index] && el.launch[index][0]
                }
              />
              {/* {currentIndex === index && ( */}

              {1 === 1 && (
                <input
                  style={{
                    paddingLeft: "1rem",
                  }}
                  type="checkbox"
                  onChange={(e) =>
                    updateMealHandler(
                      e,
                      el.date,
                      el.id,
                      index,
                      "launch",
                      "checkbox"
                    )
                  }
                  value={el.launch[index][1]}
                  checked={el.launch[index][1] === "on" ? true : false}
                />
              )}
              <input
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "90%",
                  transform: "translateY(-50%)",
                }}
                checked={
                  el["breakfast"][index][1] === "on" ||
                  el["launch"][index][1] === "on" ||
                  el["dinner"][index][1] === "on"
                }
                value={
                  el["breakfast"][index][1] === "on" ||
                  el["launch"][index][1] === "on" ||
                  el["dinner"][index][1] === "on"
                    ? "off"
                    : "on"
                }
                type="checkbox"
                onChange={(e) => {
                  const breakfast = el["breakfast"][index];
                  const launch = el["launch"][index];
                  const dinner = el["dinner"][index];
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
                      : [0, "on", "admin"];
                  dinnerArr[index] =
                    e.target.value === "off"
                      ? [0, "off", "admin"]
                      : [0, "on", "admin"];

                  const copyDesireItem = {
                    ...desireItem,
                    breakfast: breakfastArr,
                    launch: launchArr,
                    dinner: dinnerArr,
                  };
                  copyArrOfMeals[desireItemIndex] = copyDesireItem;
                  console.log(el);
                  setArrOfMeals([...copyArrOfMeals]);
                  let mealError = "";
                  if (
                    new Date() >
                    new Date(el.year, el.month, el.date.split(" ")[0] * 1, 6)
                  ) {
                    mealError = "Previous day meal request time is over";
                  }
                  if (mealError) {
                    alert(mealError);
                    console.log(prevArrOfMeals);
                    // prevArrOfMeals[desireItemIndex] = { ...obj, [mealName]: mealArr };
                    setArrOfMeals([...prevArrOfMeals]);
                    return;
                  }
                  updatePersonFullMeal({
                    id: el.id,
                    personIndex: index,
                    userIndex: registeredUsers.findIndex(
                      (item) => item._id === user._id
                    ),
                    month: el.month,
                    year: el.date.split(" ")[2] * 1,
                    day: el.date.split(" ")[0] * 1,
                    personBreakfast: breakfastArr[index],
                    personLaunch: launchArr[index],
                    personDinner: dinnerArr[index],
                  });
                }}
              />
            </td>
            <td style={{ width: "25%", display: screenWidth<600&&moneyOption!=='Deposite'?'none':'' }}>
              <input
                type="number"
                onChange={(e) => {
                  const desireMealIndex = arrOfMeals.findIndex(
                    (item) => item.id === el.id
                  );
                  console.log(desireMealIndex);
                  const desireMeal = arrOfMeals[desireMealIndex];
                  const copyDesireMeal = { ...desireMeal };
                  // const moneys = desireMeal.money;
                  // const desireMoney = moneys[index];
                  // console.log(desireMoney)
                  const moneys = copyDesireMeal.money;
                  const copyMoneys = [...moneys];
                  copyMoneys[index] = e.target.value * 1;
                  arrOfMeals[desireMealIndex] = {
                    ...copyDesireMeal,
                    money: copyMoneys,
                  };
                  setArrOfMeals([...arrOfMeals]);
                  updateMoney({
                    id: el.id,
                    year: el.year,
                    month: el.month,
                    borderIndex: index,
                    money: e.target.value * 1,
                  });
                }}
                value={el.money[index] === 0 ? "" : el.money[index]}
                placeholder="জমা"
                style={{
                  color: "black",
                  // border: "1px solid black",
                  // borderRadius: "5px",
                  width: "50px",
                  textAlign: "center",
                }}
              />
            </td>
            <td
              style={{ width: "25%", display: screenWidth < 600&&moneyOption!=='Meal Shop' ? "none" : "" }}
            >
              <input
                type="number"
                onChange={(e) => {
                  const desireMealIndex = arrOfMeals.findIndex(
                    (item) => item.id === el.id
                  );
                  const desireMeal = arrOfMeals[desireMealIndex];
                  const copyDesireMeal = { ...desireMeal };
                  const shops = copyDesireMeal.shop;
                  const copyshops = [...shops];
                  copyshops[index] = e.target.value * 1;
                  arrOfMeals[desireMealIndex] = {
                    ...copyDesireMeal,
                    shop: copyshops,
                  };
                  setArrOfMeals([...arrOfMeals]);
                  updateShopMoney({
                    id: el.id,
                    month: el.month,
                    year: el.year,
                    borderIndex: index,
                    shop: e.target.value * 1,
                  });
                }}
                placeholder="খরচ"
                value={el.shop[index] === 0 ? "" : el.shop[index]}
                style={{
                  color: "black",
                  width: "50px",
                  // border: "1px solid black",
                  // borderRadius: "5px",
                  textAlign: "center",
                }}
              />
            </td>
            <td
              style={{ width: "25%", display: screenWidth < 600 && moneyOption!=='Extra Shop' ? "none" : "" }}
            >
              <input
                type="number"
                onChange={(e) => {
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
                  updateExtraShopMoney({
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
                  width: "50px",
                  // border: "1px solid black",
                  // borderRadius: "5px",
                  textAlign: "center",
                }}
              />
            </td>
          </tr>
          {/* dinner */}
          <tr>
            <td>
              <input
                style={{
                  color: "black",
                  background: "white",
                  border: "1.5px solid black",
                  borderRadius: "5px",
                  width: "40px",
                  textAlign: "center",
                  marginRight: ".5rem",
                }}
                disabled={
                  el.dinner && el.dinner[index] && el.dinner[index][1] === "off"
                }
                onChange={(e) =>
                  updateMealHandler(e, el.date, el.id, index, "dinner")
                }
                type={
                  el.dinner && el.dinner[index] && el.dinner[index][1] === "off"
                    ? "text"
                    : "number"
                }
                value={
                  el.dinner && el.dinner[index] && el.dinner[index][1] === "off"
                    ? "off"
                    : el.dinner && el.dinner[index] && el.dinner[index][0] === 0
                    ? ""
                    : el.dinner && el.dinner[index] && el.dinner[index][0]
                }
              />
              {/* {currentIndex === index && ( */}
              {1 === 1 && (
                <>
                  <input
                    value={el.dinner[index][1]}
                    onChange={(e) =>
                      updateMealHandler(
                        e,
                        el.date,
                        el.id,
                        index,
                        "dinner",
                        "checkbox"
                      )
                    }
                    type="checkbox"
                    checked={el.dinner[index][1] === "on" ? true : false}
                  />
                </>
              )}
            </td>
          </tr>
        </table>
      </td>
    </>
  );
};

export default UserHomeTable;
