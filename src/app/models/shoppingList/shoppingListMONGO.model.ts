import { ShoppingListItemMONGO } from "./shoppingListItemMONGO.model";


export class ShoppingListMONGO{
  public _id: string | undefined;
  public shoppingListName: string;
  public shoppingListItems: ShoppingListItemMONGO[];

  constructor( 
    _id: string | undefined,
    shoppingListName: string,
    shoppingListItems: ShoppingListItemMONGO[]
  ){
    this._id = _id;
    this.shoppingListName = shoppingListName;
    this.shoppingListItems = shoppingListItems;
  }
}