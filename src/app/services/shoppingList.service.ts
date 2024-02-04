import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ShoppingListService{
  constructor(private http: HttpClient){}

}