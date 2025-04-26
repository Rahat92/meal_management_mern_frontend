import React, { useEffect, useState } from 'react'
import { useGetFoodsQuery } from '../../features/food/foodApi'

const FoodSelect = ({ selectMeal, el, meal }) => {
  const {data, isSuccess, isLoading, isError, error} = useGetFoodsQuery()
  const [foods, setFoods] = useState([])
  console.log(foods)
  useEffect(() => {
    if(data?.data?.foods?.length>0){
      setFoods(data.data.foods)
    }
  }, [data])
  return (
    <div className={`fixed z-[1000000000000] flex justify-center items-center text-3xl font-bold text-black top-0 bottom-0 left-0 right-0 bg-red-500 bg-opacity-50 ${selectMeal.setMeal && selectMeal.mealName === meal && selectMeal.date === el.date? '' : 'hidden'}`}>
      <div className = "w-[350px] h-[50vh] sm:w-[500px] gap-4 flex flex-col items-center justify-center bg-gray-500">
        <h1 className='pt-4 text-center font-poppins'>Select your food for breakfast</h1>
        <form className='w-full'>
          <select className='w-full text-black'>
            {foods?.length>0&&foods.map((item, i) => {
              return <option>{item.name}</option>
            })}
          </select>
        </form>
      </div>
    </div>
  )
}

export default FoodSelect