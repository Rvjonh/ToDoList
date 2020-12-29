export default class ToDoItem{
    constructor(){
        this._id = null;
        this._item = null;
    }

    setId(id){
        this._id = id;
    }
    getId(){
        return this._id;
    }

    setItem(item){
        this._item = item;
    }
    getItem(){
        return this._item;
    }
    
}