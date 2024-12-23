export default (month, year) => {
    let monthLength = 0;
    switch (month) {
      case 0:
        monthLength = 31;
        break;
      case 1:
        monthLength = 29;
        break;
      case 2:
        monthLength = 31;
        break;
      case 3:
        monthLength = 30;
        break;
      case 4:
        monthLength = 31;
        break;
      case 5:
        monthLength = 30;
        break;
      case 6:
        monthLength = 31; //july
        break;
      case 7:
        monthLength = 31; //august
        break;
      case 8:
        monthLength = 30;
        break;
      case 9:
        monthLength = 31; //octobar
        break;
      case 10:
        monthLength = 30;
        break;
      case 11:
        monthLength = 31;
        break;
      default:
        monthLength = 30;
    }
    return monthLength
  }