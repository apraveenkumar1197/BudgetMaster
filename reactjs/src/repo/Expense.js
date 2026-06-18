import Base from "./Base";

export default class Expense {

    static getExpenseInitData(){
        return Base.get('expense/add')
    }
    static fillable(reason){
        return Base.get('expense/fillable?reason=' + reason)
    }
    static getExpenseList(date){
        return Base.get('expense/get/' + date)
    }
    static addExpense(date, reason, category, subCategory, description, amount, payMode){
        return Base.post('expense/add',{ date: date, reason: reason, category: category, subCategory: subCategory, description: description, amount: amount, payMode: payMode })
    }
    static updateExpense(id, date, reason, category, subCategory, description, amount, payMode){
        return Base.put('expense/'+id+'/update',{ date: date, reason: reason, category: category, subCategory: subCategory, description: description, amount: amount, payMode: payMode })
    }
    static deleteExpense(id){
        return Base.delete('expense/'+id)
    }
    static getExpenseIndividualReport(fromDate, toDate, reason, category, subCategory, payMode){
        let query = "";
        if(fromDate != null && toDate != null) query += "fromDate=" + fromDate + "&toDate=" + toDate;
        if(reason != null) query += "&reason=" + reason.id;
        if(category != null) query += "&category=" + category.id;
        if(subCategory != null) query += "&subCategory=" + subCategory.id;
        if(payMode != null) query += "&payMode=" + payMode.id;
        return Base.get('expense/report/individual?' + query)
    }
}