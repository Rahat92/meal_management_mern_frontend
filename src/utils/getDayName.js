function getDayName(year, month, date) {
    console.log(year, month, date);
    // JavaScript Date month is 0-based (0 = January, 11 = December)
    const d = new Date(year, month - 2, date);
    console.log(d);
    // Array of day names (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return days[d.getDay()];
}
export default getDayName;