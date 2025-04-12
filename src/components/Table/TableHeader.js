import React from 'react'
import UserHomeTableHeadContent from '../UserHomeTableHeadContent';

const TableHeader = ({ currentUser, registeredUsers, screenWidth, setMoneyOption, moneyOption, borderTotalDeposite, borderTotalShop, borderTotalExtraShop }) => {
    return (
        <>
            <thead className="sticky top-0 z-10">
                <tr className="h-[50px]">
                    <td style={{ textAlign: 'center' }} className={`${currentUser === 'all' ? 'min-w-[50px]' : 'min-w-[50px]'} bg-white text-black sticky left-0 z-[100] m-0 p-0`}>Date</td>
                    <td className="w-1 sticky left-[50px] h-full bg-red-500">&nbsp;</td>
                    <td style={{ textAlign: 'center' }} className="min-w-[80px] sticky left-[54.39px] bg-white text-black ">Type</td>
                    <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 sticky left-[134.39px] bg-black`}>&nbsp;</td>
                    <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 bg-black`}>&nbsp;</td> {/* head name first vertical indicator */}

                    {registeredUsers
                        ?.filter((el) => {
                            if (currentUser !== "all") {
                                if (el._id === currentUser?.split(" ")[currentUser?.split(" ").length - 1]) {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        })
                        ?.map((el) => {
                            return (
                                <>
                                    <td
                                        style={{
                                            width: currentUser !== "all" ? "100%" : "150px",
                                            textAlign: "center",
                                        }}
                                        className="min-w-[100px] bg-white text-black"
                                    >
                                        <table
                                            style={{
                                                height: "100%",
                                                width: currentUser !== "all" ? "100%" : "100%",
                                            }}
                                        >
                                            <tr
                                                style={{
                                                    // borderBottom: "1px solid red",
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                            >
                                                <th
                                                    style={{
                                                        width:
                                                            currentUser !== "all" ? "65%" : "150px",
                                                    }}
                                                >
                                                    {currentUser !== "all" ? (
                                                        <UserHomeTableHeadContent
                                                            screenWidth={screenWidth}
                                                            setMoneyOption={setMoneyOption}
                                                            moneyOption={moneyOption}
                                                            borderTotalDeposite={borderTotalDeposite}
                                                            borderTotalShop={borderTotalShop}
                                                            borderTotalExtraShop={borderTotalExtraShop}
                                                        />
                                                    ) : (
                                                        el.name
                                                    )}
                                                </th>
                                            </tr>
                                        </table>
                                    </td>
                                    <td className="w-1 bg-black"></td>
                                </>
                            );
                        })}
                    <td className={`${currentUser === 'all' ? '' : 'hidden'} w-1 sticky right-[100px] bg-black`}>&nbsp;</td>
                    <td className={`${currentUser === 'all' ? '' : 'hidden'} min-w-[100px] sticky right-0 bg-white text-black text-center font-bold`}>Total Meal</td>
                </tr>

                <tr className="h-1 bg-black">
                    <td className=""></td>
                    <td className="sticky left-[50px]"></td>
                    <td className=""></td>
                    <td className=""></td>
                    <td></td>
                    <td></td>

                    {registeredUsers?.length > 0 && registeredUsers.map(el => {
                        return (
                            <>
                                <td></td>
                                <td className="w-1 bg-black"></td>
                            </>
                        )
                    })}
                    <td className="w-1 sticky right-[100px] bg-black z-[-100]"></td>
                </tr>

            </thead>
        </>
    )
}

export default TableHeader