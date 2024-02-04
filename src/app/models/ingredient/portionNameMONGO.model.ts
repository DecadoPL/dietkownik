export class PortionNameMONGO{
  public _id: string;
  public portionName: string;

  constructor( 
    _id: string,
    portionName: string,
  ){
    this._id = _id
    this.portionName = portionName;
  }
}