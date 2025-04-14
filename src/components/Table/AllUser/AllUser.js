import React from 'react'

const AllUser = ({ registeredUsers, currentUser, el, item, setItem, updateMealHandler }) => {
    return (
        <>
            {registeredUsers?.length > 0 && registeredUsers.map((elem, index) => {
                return (
                    <>
                        <td
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
                                                disabled={
                                                    (el.breakfast &&
                                                        el.breakfast[index] &&
                                                        el.breakfast[index][1] === "off") ||
                                                    el.breakfast[index][2] === "user"
                                                    // ||user?.role === "user"
                                                }
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
                                        </div>
                                    </td>
                                </tr>
                                {/* Launch input field */}
                                <tr style={{}}>
                                    <td>
                                        <input
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
                                        />
                                    </td>
                                </tr>

                                {/*dinner input field */}
                                <tr>
                                    <td>
                                        <input
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
                                        />
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