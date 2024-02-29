export class ShoppingListListItemMONGO{
    public _id: string;
    public shoppingListName: string;
  
    constructor( 
      _id: string,
      shoppingListName: string,
    ){
      this._id = _id;
      this.shoppingListName = shoppingListName;
    }
  }