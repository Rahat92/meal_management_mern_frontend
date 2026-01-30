export default function getMonthLength(month, year) {
  if (month < 0 || month > 11) return 0;

  if (month === 1) {
    const isLeapYear =
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    return isLeapYear ? 29 : 28;
  }

  const thirtyOneDays = [0, 2, 4, 6, 7, 9, 11];

  return thirtyOneDays.includes(month) ? 31 : 30;
}
