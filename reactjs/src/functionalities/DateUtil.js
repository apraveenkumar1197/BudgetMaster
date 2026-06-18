
class DateUtil {
    date = new Date();
    constructor(date = null) {
        if(date != null) this.date = date
    }

    mySQLDate = () => {
        let date = this.date.getDate();
        let month = this.date.getMonth() + 1;
        let year = this.date.getFullYear();
        return year + "-" + month.toString().padStart(2, '0') + "-" + date.toString().padStart(2, '0');
    }

    monthBeginning = () => {
        let date = 1;
        let month = this.date.getMonth();
        let year = this.date.getFullYear();
        return new Date(year, month, date);
    }

    mySQLMonth = () => {
        let month = this.date.getMonth() + 1;
        let year = this.date.getFullYear();
        return year + "-" + month.toString().padStart(2, '0');
    }
}

export default DateUtil