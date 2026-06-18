import Base from "./Base";

export default class Storage {
    static transactionReport(fromDate, toDate, fromStorage, toStorage){
        let query = "";
        if(fromDate != null && toDate != null) query += "fromDate=" + fromDate + "&toDate=" + toDate;
        if(fromStorage != null) query += "&fromStorageId=" + fromStorage.id;
        if(toStorage != null) query += "&toStorageId=" + toStorage.id;

        return Base.get('storage/report?' + query)
    }
}