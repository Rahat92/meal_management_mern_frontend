import React, { useEffect, useState } from 'react'
import { useGetFoodsQuery } from '../../features/food/foodApi'
import { useUpdateLunchMenuMutation } from '../../features/bikri/bikriApi'

const FoodSelect = ({
  selectMeal,
  currentIndex,
  setSelectMeal,
  el,
  meal,
  user,
  currentUser,
}) => {
  const lunchMenu =
    selectMeal.el?.launch?.[currentIndex]?.[3] ?? 'Select lunch'
  const dinnerMenu =
    selectMeal.el?.dinner?.[currentIndex]?.[3] ?? 'Select dinner'

  const { data } = useGetFoodsQuery()
  const [foods, setFoods] = useState([])
  const [updateLaunch, { isSuccess: updateLaunchSuccess }] =
    useUpdateLunchMenuMutation()

  useEffect(() => {
    if (data?.data?.foods?.length) {
      setFoods(data.data.foods)
    }
  }, [data])

  useEffect(() => {
    if (updateLaunchSuccess) {
      alert('Lunch menu updated successfully!')
    }
  }, [updateLaunchSuccess])

  if (!(selectMeal.setMeal && selectMeal.mealName === meal)) return null

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl">

        {/* Close Button */}
        <button
          onClick={() => setSelectMeal({ ...selectMeal, setMeal: false })}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
        >
          <img src="/assets/image/close.png" alt="Close" className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Meal Selection
          </h2>
          <p className="text-sm text-gray-500">
            Choose meals from the available food list
          </p>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-6">

          {/* Breakfast */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Breakfast
            </label>
            <select
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-600"
            >
              {foods.map((item, i) => (
                <option key={i}>{item.name}</option>
              ))}
            </select>
          </div>

          {/* Lunch */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Lunch
            </label>
            <select
              onChange={(e) =>
                updateLaunch({
                  id: selectMeal.el.id,
                  borderIndex: currentIndex,
                  lunch: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option>{lunchMenu}</option>
              {foods.map((item, i) => (
                <option key={i}>{item.name}</option>
              ))}
            </select>
          </div>

          {/* Dinner */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Dinner
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option>{dinnerMenu}</option>
              {foods.map((item, i) => (
                <option key={i}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            onClick={() => setSelectMeal({ ...selectMeal, setMeal: false })}
            className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoodSelect
