import Base from "./Base";

export default class Tally {
    static getReport(fromDate, toDate){
        return Base.get('tally/report?fromMonth=' + fromDate + '&toMonth=' + toDate)
    }
}