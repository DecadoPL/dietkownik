export class DishListItemMONGO{
    public _id: string;
    public dishName: string;
  
    constructor( 
      _id: string,
      dishName: string,
    ){
      this._id = _id;
      this.dishName = dishName;
    }
  }