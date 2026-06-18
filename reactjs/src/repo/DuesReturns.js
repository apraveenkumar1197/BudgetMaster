import Base from "./Base";

export default class DuesReturns {

    static addDues(date, reason, category, subCategory, amount, isRecursive, recursiveFrequency, recursiveTill) {
        return Base.post('dues', {
            date: date,
            reason: reason,
            category: category,
            subCategory: subCategory,
            amount: amount,
            isRecursive: isRecursive,
            recursiveFrequency: recursiveFrequency,
            recursiveTill: recursiveTill,
        })
    }

    static getDues(month) {
        return Base.get('dues?month=' + month)
    }

    static getMonthDues(month) {
        return Base.get('dues/month?month=' + month)
    }

    static deleteDues(id) {
        return Base.delete('dues/' + id)
    }

    static addReturns(date, reason, category, subCategory, amount, isRecursive, recursiveFrequency, recursiveTill) {
        return Base.post('returns', {
            date: date,
            reason: reason,
            category: category,
            subCategory: subCategory,
            amount: amount,
            isRecursive: isRecursive,
            recursiveFrequency: recursiveFrequency,
            recursiveTill: recursiveTill,
        })
    }

    static getReturns(month) {
        return Base.get('returns?month=' + month)
    }

    static deleteReturns(id) {
        return Base.delete('returns/' + id)
    }
}