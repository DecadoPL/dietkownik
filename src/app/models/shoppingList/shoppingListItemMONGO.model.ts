export class ShoppingListItemMONGO{
  public _id: string | undefined;
  public itemName: string;
  public itemWeight: number;
  public itemPC: number
  public itemPCWeight: number;
  public itemPackages: number;
  public itemPackagesWeight: number;
  public itemChecked: boolean

  constructor( 
    _id: string | undefined,
    itemName: string,
    itemWeight: number,
    itemPC: number,
    itemPCWeight: number,
    itemPackages: number,
    itemPackagesWeight: number,
    itemChecked: boolean
  ){
    this._id = _id
    this.itemName = itemName;
    this.itemWeight = itemWeight;
    this.itemPC = itemPC;
    this.itemPCWeight = itemPCWeight;
    this.itemPackages = itemPackages;
    this.itemPackagesWeight = itemPackagesWeight;
    this.itemChecked = itemChecked;
  }
}