import Base from "./Base";

export default class LoansRepo {
    static getLoans(){
        return Base.get('loan')
    }
}