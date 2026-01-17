import React, { useEffect, useState } from 'react'
import { useGetMonthlyMealsQuery } from '../features/bikri/bikriApi';
import { locationPathChanged } from '../features/locationPath';
import { useDispatch } from 'react-redux';
import { readableDate } from '../utils/readableDate';

const CurrentStatus = () => {
    const dispatch = useDispatch()
    const { data: monthlyMeals, isLoading: isMealsLoading } =
        useGetMonthlyMealsQuery(
            { getMonth: 4, getYear: 2026 }
        );
    const [menus, setMenus] = useState([])
    useEffect(() => {
        dispatch(locationPathChanged(window.location.pathname));
    }, []);
    const currentDate = readableDate(new Date())
    useEffect(() => {
        if (monthlyMeals?.monthlyMeals?.length > 0) {
            const menuArr = monthlyMeals?.monthlyMeals?.find(item => item.date === `${currentDate.day} May 2026`) && monthlyMeals?.monthlyMeals?.find(item => item.date === `${currentDate.day} May 2026`)['launch'].map((item, i) => {
                console.log(monthlyMeals?.monthlyMeals[0].border)
                return {
                    borderName: monthlyMeals.monthlyMeals[0].border && monthlyMeals.monthlyMeals[0].border[i].name,
                    mealMenu: item[3],
                    noOfMeal: item[0]
                }
            })
            console.log(menuArr)
            const tempArr = [];
            menuArr.map((itm, i) => {
                const index = tempArr.findIndex((item) => Object.keys(item)[0] === itm.mealMenu)
                if (index === -1) {
                    tempArr.push({ [itm.mealMenu]: [itm] })
                } else {
                    const prevItem = { ...tempArr[index] };
                    const arr = [...prevItem[itm.mealMenu], itm]
                    // console.log(prevItem)
                    // const replacedArr = [{...prevItem['0']}]
                    // replacedArr.push(itm)
                    tempArr[index] = { [itm.mealMenu]: arr }
                }
            })
            console.log(tempArr)
            setMenus(tempArr)
        }
    }, [monthlyMeals?.monthlyMeals])
    return (
        <div className='mt-16 text-2xl'>
            {menus?.length > 0 && menus.map((item, i) => {
                console.log(Object.values(item))
                return (
                    <div className='border my-4 text-black p-3'>
                        <h1 className='bg-green-500 text-4xl uppercase font-bold'>{Object.keys(item)[0]} ({Object.values(item)[0].reduce((f, c) => c.noOfMeal + f, 0)})</h1>
                        <div>
                            {Object.values(item).map((itm, ind) => {
                                return itm.map((ele, index) => {
                                    console.log(ele)
                                    return (
                                        <h3>{ele.borderName} ({ele.noOfMeal})</h3>
                                    )
                                })
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CurrentStatus