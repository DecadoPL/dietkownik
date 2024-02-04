export class DietListItemMONGO{
  public _id: string;
  public dietName: string;

  constructor( 
    _id: string,
    dietName: string,
  ){
    this._id = _id;
    this.dietName = dietName;
  }
}