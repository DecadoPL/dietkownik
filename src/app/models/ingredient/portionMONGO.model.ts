export class PortionMONGO{
  public _id: string | undefined;
  public ingrPortionNameId: string;
  public ingrPortionName: string;
  public ingrPortionWeight: number;

  constructor( 
    _id: string | undefined,
    ingrPortionNameId: string,
    ingrPortionName: string,
    ingrPortionWeight: number,
  ){
    this._id = _id;
    this.ingrPortionNameId = ingrPortionNameId;
    this.ingrPortionName = ingrPortionName;
    this.ingrPortionWeight = ingrPortionWeight;
  }
}