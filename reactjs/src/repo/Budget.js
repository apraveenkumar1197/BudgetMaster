import Base from "./Base";


export default class Budget {
    static initData() {
        return Base.get('budget/create')
    }

    static add(month, reason, category, subCategory, amount) {
        return Base.post('budget', {
            month: month,
            reason: reason,
            category: category,
            subCategory: subCategory,
            amount: amount
        })
    }

    static update(id, month, reason, category, subCategory, amount) {
        return Base.put('budget/' + id, {
            month: month,
            reason: reason,
            category: category,
            subCategory: subCategory,
            amount: amount
        })
    }

    static delete(id) {
        return Base.delete('budget/' + id)
    }

    static reOrder(month, budgetEntries) {
        budgetEntries = budgetEntries.map((budget, i) => {
            return {
                reason: budget.reason.id,
                category: budget.category.id,
                subCategory: budget.subCategory != null ? budget.subCategory.id : null,
                amount: budget.amount,
            }
        })
        return Base.post('budget/reorder', {month: month, budgetEntries: budgetEntries})
    }

    static copy(month) {
        return Base.post('budget/copy', {month: month})
    }

    static list(month, individualFlag) {
        return Base.get('budget/' + month + "?isIndividualFlag=" + individualFlag)
    }

    static review(month, savingsAndInvestment, withoutCreditCardExpenses) {
        return Base.get('budget?month=' + month + '&savingAndInvestment=' + savingsAndInvestment + '&withoutCreditCardExpenses=' + withoutCreditCardExpenses)
    }
}