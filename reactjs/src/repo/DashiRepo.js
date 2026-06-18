import Base from "./Base";

export default class DashiRepo {
    static data(){
        return Base.get('dashi')
    }
}