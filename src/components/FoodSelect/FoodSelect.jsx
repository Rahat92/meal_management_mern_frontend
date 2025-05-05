import React, { useEffect, useState } from 'react'
import { useGetFoodsQuery } from '../../features/food/foodApi'
import { useUpdateLunchMenuMutation } from '../../features/bikri/bikriApi'

const FoodSelect = ({ selectMeal, currentIndex, setSelectMeal, el, meal, user, currentUser }) => {
  const lunchMenu = selectMeal.el && selectMeal.el['launch'] && selectMeal.el['launch'][currentIndex] && selectMeal.el['launch'][currentIndex][3]
  const dinnerMenu = selectMeal.el && selectMeal.el['dinner'] && selectMeal.el['dinner'][currentIndex] && selectMeal.el['dinner'][currentIndex][3]
  const { data, isSuccess, isLoading, isError, error } = useGetFoodsQuery()
  const [foods, setFoods] = useState([])
  const [updateLaunch, { isSuccess: updateLaunchSuccess }] = useUpdateLunchMenuMutation()
  useEffect(() => {
    if (data?.data?.foods?.length > 0) {
      setFoods(data.data.foods)
    }
  }, [data])

  useEffect(() => {
    if (updateLaunchSuccess) {
      alert('successfully update lunch menu!')
    }
  }, [updateLaunchSuccess])

  return (
    <div className={` fixed z-[1000000000000] flex flex-col justify-center items-center text-3xl font-bold text-black top-0 bottom-0 left-0 right-0 bg-red-500 bg-opacity-50 ${selectMeal.setMeal && selectMeal.mealName === meal ? '' : 'hidden'}`}>
      <div className='bg-gray-300 relative'>
        <img onClick={() => setSelectMeal({ ...selectMeal, setMeal: false })} className='absolute right-[-15px] top-[-15px] cursor-pointer z-10 bg-white rounded-full' width={30} height={30} src='/assets/image/close.png' alt='close button' />
        <div className="border p-4 w-[350px]  sm:w-[500px] gap-4 flex flex-col justify-center bg-gray-500">
          <h1 className='pt-4 font-poppins'>Select breakfast</h1>
          <form className='w-full'>
            <select
              disabled className='w-full text-black'>
              {foods?.length > 0 && foods.map((item, i) => {
                return <option>{item.name}</option>
              })}
            </select>
          </form>
        </div>

        <div className="border p-4 w-[350px] sm:w-[500px] gap-4 flex flex-col justify-center bg-gray-500">
          <h1 className='pt-4 font-poppins'>Select breakfast</h1>
          <form className='w-full'>
            <select
              onChange={(e) => updateLaunch({ id: selectMeal.el.id, borderIndex: currentIndex, lunch: e.target.value })}
              className='w-full text-black'>
              <option>{lunchMenu}</option>
              {foods?.length > 0 && foods.map((item, i) => {
                return <option> {item.name}</option>
              })}
            </select>
          </form>
        </div>

        <div className="border p-4 w-[350px] sm:w-[500px] gap-4 flex flex-col justify-center bg-gray-500">
          <h1 className='pt-4 font-poppins'>Select Dinner</h1>
          <form className='w-full'>
            <select className='w-full text-black'>
              <option>{dinnerMenu}</option>
              {foods?.length > 0 && foods.map((item, i) => {
                return <option>{item.name}</option>
              })}
            </select>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FoodSelect