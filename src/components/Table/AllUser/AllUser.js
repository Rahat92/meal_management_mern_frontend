import React from 'react'

const AllUser = ({ registeredUsers, currentIndex, currentUser, el, item, setItem, updateMealHandler, user, updatebreakfast, updateLunch, updateDinner, mealInfo }) => {
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
                                            <select
                                                value={el.breakfast.find(item => item.user === elem.user._id)?.meal}
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
                                                        const breakfast = el.breakfast.find(item => item.user === elem.user._id)
                                                        breakfast.meal = Number(e.target.value);
                                                        updateLunch({ mealDay: el.mealDay, mealName: "breakfast", mealNumber: Number(e.target.value), userId: breakfast.user})
                                                    }
                                                }
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
                                                style={{ border: '1px solid black' }} className="appearance-none border border-black-300 rounded h-[27px] w-[40px] text-center z-[-100]">
                                                {[.5, 1, 1.5, 0].map(el => <option value={el} selected = {el==el.breakfast?.find(item => item.user === elem.user._id)?.meal}>{el == 0 ? 'off' : el}</option>)}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                                {/* Launch input field */}
                                <tr style={{}}>
                                    <td>
                                        <select
                                            value={el.launch.find(item => item.user === elem.user._id)?.meal}
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
                                                    const lunch = el.launch.find(item => item.user === elem.user._id)
                                                    updateLunch({ mealDay: el.mealDay, mealNumber:Number(e.target.value), mealName: "lunch", userId: lunch.user })
                                                }
                                            }
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
                                            style={{ border: '1px solid black' }} className="appearance-none border border-black-300 rounded h-[27px] w-[40px] text-center z-[-100]">
                                            {[1, 2, 3, 0].map(el => <option value={el} selected = {el==el.launch?.find(item => item.user === elem.user._id)?.meal}>{el == 0 ? 'off' : el}</option>)}
                                        </select>
                                    </td>
                                </tr>

                                {/*dinner input field */}
                                <tr>
                                    <td>
                                        <select
                                            value={el.dinner.find(item => item.user === elem.user._id)?.meal}
                                            onChange={(e) => {
                                                // if (user.role !== 'superadmin' && index !== loggedInUserIndex) {
                                                //     alert(`You don't have permissions to modify other meals.`)
                                                //     return
                                                // }
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
                                                    const dinner = el.dinner.find(item => item.user === elem.user._id)
                                                    updateLunch({ mealDay: el.mealDay, mealNumber:Number(e.target.value), mealName: "dinner", userId: dinner.user })
                                                }
                                            }
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
                                            style={{ border: '1px solid black' }} className="appearance-none border border-black-300  rounded h-[27px] w-[40px] text-center z-[-500]">
                                            {[1, 2, 3, 0].map(el => <option value={el} selected = {el==el.dinner?.find(item => item.user === elem.user._id)?.meal}>{el == 0 ? 'off' : el}</option>)}
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