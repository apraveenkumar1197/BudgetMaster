import Base from "./Base";

export default class Investment {
    static getInvestmentMonthWise(month){
        return Base.get('investments/monthly/get?month=' + month)
    }
    static myInvestments(){
        return Base.get('investments/list')
    }

    static hide(investmentReasonId){
        return Base.patch('investment/hide', { investmentReasonId: investmentReasonId })
    }

    static unhide(investmentReasonId){
        return Base.patch('investment/unhide', { investmentReasonId: investmentReasonId })
    }
}