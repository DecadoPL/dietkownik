export class IngredientListItemMONGO{
  public _id: string;
  public ingrName: string;

  constructor( 
    _id: string,
    ingrName: string,
  ){
    this._id = _id;
    this.ingrName = ingrName;
  }
}