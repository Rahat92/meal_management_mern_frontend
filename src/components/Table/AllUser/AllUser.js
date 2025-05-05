import React from 'react'

const AllUser = ({ registeredUsers, currentIndex, currentUser, el, item, setItem, updateMealHandler, user, updateLunch, updateDinner }) => {
    const loggedInUserIndex = registeredUsers.findIndex((itm, i) => itm._id === user._id)
    return (
        <>
            {registeredUsers?.length > 0 && registeredUsers.map((elem, index) => {
                return (
                    <>
                        <td
                            onClick={() => {
                                console.log(index, loggedInUserIndex)
                            }}
                            className={`${currentUser === 'all' ? '' : 'hidden'} bg-white`}
                            style={{
                                width: "150px",
                                textAlign: "center",
                            }}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    height: "86px",
                                }}
                            >
                                {/* breakfast input field */}
                                <tr>
                                    <td className="bg-white" style={{ width: "25%" }}>
                                        <div className="">
                                            <input
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
                                                    setItem("text");
                                                }}
                                                // disabled={
                                                //     (el.breakfast &&
                                                //         el.breakfast[index] &&
                                                //         el.breakfast[index][1] === "off") ||
                                                //     el.breakfast[index][2] === "user"
                                                //     // ||user?.role === "user"
                                                // }
                                                disabled
                                                onChange={(e) =>
                                                    updateMealHandler(
                                                        e,
                                                        el.date,
                                                        el.id,
                                                        index,
                                                        "breakfast"
                                                    )
                                                }
                                                style={{
                                                    color: "black",
                                                    // background: "white",
                                                    border:
                                                        el.breakfast &&
                                                            el.breakfast[index] &&
                                                            el.breakfast[index][1] !== "off"
                                                            ? "1.5px solid black"
                                                            : "1.5px solid red",
                                                    borderRadius: "5px",
                                                    width: "40px",
                                                    textAlign: "center",
                                                    border: '1.5px solid red'
                                                }}
                                                type={
                                                    item.type === "number" &&
                                                        item.borderIndex === index &&
                                                        item.date === el.date &&
                                                        item.mealName === "breakfast" &&
                                                        el.breakfast[index] &&
                                                        el.breakfast[index][1] !== "off"
                                                        ? "text"
                                                        : "text"
                                                }
                                                // value={
                                                //     el.breakfast &&
                                                //         el.breakfast[index] &&
                                                //         el.breakfast[index][1] === "off"
                                                //         ? "off"
                                                //         : el.breakfast &&
                                                //             el.breakfast[index] &&
                                                //             el.breakfast[index][0] === 0
                                                //             ? ""
                                                //             : el.breakfast &&
                                                //             el.breakfast[index] &&
                                                //             el.breakfast[index][0]
                                                // }
                                                value={'off'}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                {/* Launch input field */}
                                <tr style={{}}>
                                    <td>
                                        {/* <input
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
                                                setItem("text");
                                            }}
                                            disabled={
                                                (el.launch &&
                                                    el.launch[index] &&
                                                    el.launch[index][1] === "off") ||
                                                el.launch[index][2] === "user"
                                                // ||user?.role === "user"
                                            }
                                            onChange={(e) =>
                                                updateMealHandler(
                                                    e,
                                                    el.date,
                                                    el.id,
                                                    index,
                                                    "launch"
                                                )
                                            }
                                            style={{
                                                color: "black",
                                                background: "white",
                                                border:
                                                    el.launch &&
                                                        el.launch[index] &&
                                                        el.launch[index][1] !== "off"
                                                        ? "1.5px solid black"
                                                        : "1.5px solid red",
                                                borderRadius: "5px",
                                                width: "40px",
                                                textAlign: "center",
                                                zIndex: -100,
                                            }}
                                            type={
                                                item.type === "number" &&
                                                    item.borderIndex === index &&
                                                    item.date === el.date &&
                                                    item.mealName === "launch" &&
                                                    el.launch[index] &&
                                                    el.launch[index][1] !== "off"
                                                    ? "text"
                                                    : "text"
                                            }
                                            value={
                                                el.launch &&
                                                    el.launch[index] &&
                                                    el.launch[index][1] === "off"
                                                    ? "off"
                                                    : el.launch &&
                                                        el.launch[index] &&
                                                        el.launch[index][0] === 0
                                                        ? ""
                                                        : el.launch &&
                                                        el.launch[index] &&
                                                        el.launch[index][0]
                                            }
                                        /> */}
                                        <select

                                            value={el.launch[index][0]}
                                            onChange={(e) => {
                                                if (user.role !== 'superadmin' && index !== loggedInUserIndex) {
                                                    alert(`You don't have permissions to modify other meals.`)
                                                    return
                                                }

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
                                                } else if (
                                                    user?.role === "admin" &&
                                                    new Date() >
                                                    new Date(
                                                        el.year,
                                                        el.month,
                                                        el.date.split(" ")[0],
                                                        24
                                                    )
                                                ) {
                                                    alert("Admin can't change previous days Meal")
                                                } else {
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
                                            // disabled={
                                            //     el.launch && el.launch[index] && el.launch[index][1] === "off"
                                            // }
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
                                            style={{ border: '1px solid black' }} className="appearance-none border border-black-300 rounded h-[27px] w-[40px] text-center z-[-100]">
                                            <option value={el.launch[index][0]}>{el.launch[index][0] == 0 ? 'off' : el.launch[index][0]}</option>
                                            {[1, 2, 3, 0].filter(item => item != el.launch[index][0]).map(el => <option value={el}>{el == 0 ? 'off' : el}</option>)}
                                        </select>
                                    </td>
                                </tr>

                                {/*dinner input field */}
                                <tr>
                                    <td>
                                        {/* <input
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
                                                setItem("text");
                                            }}
                                            disabled={
                                                (el.dinner &&
                                                    el.dinner[index] &&
                                                    el.dinner[index][1] === "off") ||
                                                el.dinner[index][2] === "user"
                                            }
                                            onChange={(e) =>
                                                updateMealHandler(
                                                    e,
                                                    el.date,
                                                    el.id,
                                                    index,
                                                    "dinner"
                                                )
                                            }
                                            style={{
                                                color: "black",
                                                border:
                                                    el.dinner &&
                                                        el.dinner[index] &&
                                                        el.dinner[index][1] !== "off"
                                                        ? "1.5px solid black"
                                                        : "1.5px solid red",
                                                borderRadius: "5px",
                                                width: "40px",
                                                textAlign: "center",
                                            }}
                                            type={
                                                item.type === "number" &&
                                                    item.borderIndex === index &&
                                                    item.date === el.date &&
                                                    item.mealName === "dinner" &&
                                                    el.dinner &&
                                                    el.dinner[index] &&
                                                    el.dinner[index][1] !== "off"
                                                    ? "text"
                                                    : "text"
                                            }
                                            value={
                                                el.dinner &&
                                                    el.dinner[index] &&
                                                    el.dinner[index][1] === "off"
                                                    ? "off"
                                                    : el.dinner &&
                                                        el.dinner[index] &&
                                                        el.dinner[index][0] === 0
                                                        ? ""
                                                        : el.dinner &&
                                                        el.dinner[index] &&
                                                        el.dinner[index][0]
                                            }
                                        /> */}
                                        <select
                                            value={el.dinner[index][0]}
                                            onChange={(e) => {
                                                if (user.role !== 'superadmin' && index !== loggedInUserIndex) {
                                                    alert(`You don't have permissions to modify other meals.`)
                                                    return
                                                }
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
                                                } else if (
                                                    user?.role === "admin" &&
                                                    new Date() >
                                                    new Date(
                                                        el.year,
                                                        el.month,
                                                        el.date.split(" ")[0],
                                                        24
                                                    )
                                                ) {
                                                    alert("Admin can't change previous days Meal")
                                                } else {
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
                                            // disabled={
                                            //     el.dinner && el.dinner[index] && el.dinner[index][1] === "off"
                                            // }
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
                                            style={{ border: '1px solid black' }} className="appearance-none border border-black-300  rounded h-[27px] w-[40px] text-center z-[-500]">
                                            <option value={el.dinner[index][0]}>{el.dinner[index][0] == 0 ? 'off' : el.dinner[index][0]}</option>
                                            {[1, 2, 3, 0].filter(item => item != el.dinner[index][0]).map(el => <option value={el}>{el == 0 ? 'off' : el}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        {/* for customer */}
                        <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 bg-gray-300`}>&nbsp;</td> {/* Body meal vertical border element */}
                    </>
                )
            })}
        </>
    )
}

export default AllUser