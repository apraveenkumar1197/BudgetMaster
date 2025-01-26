import Base from "./Base";

export default class UtilRepo {
    static getSubcategoriesByCategoryId(type, categoryId, fromDate, toDate){
        let query = "categoryId="+categoryId;
        if(fromDate != null && toDate != null) query += "&fromDate=" + fromDate + "&toDate=" + toDate;
        if(type != null) query += "&ledgerType=" + type;
        return Base.get('subCategory?' + query)
    }
}