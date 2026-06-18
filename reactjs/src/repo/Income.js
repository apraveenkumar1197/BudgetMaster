import Base from "./Base";

export default class Income {

    static getIncomeInitData() {
        return Base.get('income/add')
    }
    static fillable(reason){
        return Base.get('income/fillable?reason=' + reason)
    }
    static getIncomeList(month) {
        return Base.get('income/get/' + month)
    }
    static addIncome(date, reason, category, subCategory, description, amount, payMode) {
        return Base.post('income/add', {
            date: date,
            reason: reason,
            category: category,
            subCategory: subCategory,
            description: description,
            amount: amount,
            payMode: payMode
        })
    }
    static updateIncome(id, date, reason, category, subCategory, description, amount, payMode) {
        return Base.put('income/' + id + '/update', {
            date: date,
            reason: reason,
            category: category,
            subCategory: subCategory,
            description: description,
            amount: amount,
            payMode: payMode
        })
    }
    static deleteIncome(id) {
        return Base.delete('income/' + id)
    }
    static getIncomeIndividualReport(fromDate, toDate, reason, category, subCategory, payMode) {
        let query = "";
        if (fromDate != null && toDate != null) query += "fromDate=" + fromDate + "&toDate=" + toDate;
        if (reason != null) query += "&reason=" + reason.id;
        if (category != null) query += "&category=" + category.id;
        if (subCategory != null) query += "&subCategory=" + subCategory.id;
        if (payMode != null) query += "&payMode=" + payMode.id;
        return Base.get('income/report/individual?' + query)
    }
}