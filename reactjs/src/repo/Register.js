import Base from "./Base";

export default class Register {
    static getProfileDetails(){
        return Base.get('register/user/details/get')
    }
    static updateProfileDetails(name,mobileNo){
        return Base.post('register/user/details/update',{name: name, mobileNo: mobileNo})
    }
    static getReasons(){
        return Base.get('reason')
    }
    static getCategories(){
        return Base.get('category')
    }
    static getInvestments(){
        return Base.get('investments')
    }
    static addInvestment(reason, category, amount){
        return Base.post('investments',{reason: reason, category:category, amount:amount})
    }
    static getLoans(){
        return Base.get('register/loans/list')
    }
    static addLoan(reason, category, amount){
        return Base.post('register/loans/add', {reason: reason, category: category, amount: amount})
    }
    static getStorageList(){
        return Base.get('storage')
    }

    static transferStorage(date, fromStorageId, toStorageId, amount){
        return Base.post('storage/transfer', {date: date, fromStorageId: fromStorageId, toStorageId: toStorageId, amount: amount})
    }
    static addStorage(name, amount){
        return Base.post('storage', {name: name, amount: amount})
    }
    static updateRegisterStatus(){
        return Base.post('register/status/update')
    }
}