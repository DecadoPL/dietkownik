export class DietListItemMONGO{
  public _id: string;
  public dietName: string;
  public dietInUse: boolean;

  constructor( 
    _id: string,
    dietName: string,
    dietInUse: boolean
  ){
    this._id = _id;
    this.dietName = dietName;
    this.dietInUse = dietInUse;
  }
}