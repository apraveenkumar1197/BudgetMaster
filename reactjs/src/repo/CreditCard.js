import Base from "./Base";

export default class CreditCard {
    static add(name, holderName){
        return Base.post('creditCard', { name: name, holderName: holderName })
    }
    static list(){
        return Base.get('creditCard')
    }
}