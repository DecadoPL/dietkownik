import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { environment } from "src/environments/environment";
import { ShoppingListListItemMONGO } from "../models/shoppingList/shoppingListListItemMONGO.model";
import { ShoppingListMONGO } from "../models/shoppingList/shoppingListMONGO.model";
import { ShoppingListItemMONGO } from "../models/shoppingList/shoppingListItemMONGO.model";


@Injectable()
export class ShoppingListService{
  constructor(private http: HttpClient){}
  
  private urlMONGO = environment.backendMainUrl + 'api/shoppinglists/';

  getShoppingListListMONGO(): Observable<ShoppingListListItemMONGO[]> {
    return this.http.get<{ message: string, shoppingLists: ShoppingListListItemMONGO[] }>(this.urlMONGO)
      .pipe(
        map((shoppingListsData: any) => {
          return shoppingListsData.shoppingLists;
        })
      );
  }

  getShoppingListForDietsMONGO(diets: []): Observable<ShoppingListItemMONGO[]>{
    return this.http.post<{ message: string, shoppingList: ShoppingListItemMONGO[] }>(this.urlMONGO+'dietsItemsFetch', diets)
      .pipe(
        map((shoppingListData: any) => {
          return shoppingListData.shoppingList;
        })
      );
  }

  getShoppingListMONGO(id: string): Observable<ShoppingListMONGO>{
    return this.http.get<{ message: string, shoppingList: ShoppingListMONGO }>(this.urlMONGO+id)
      .pipe(
        map((shoppingListData: any) => {
          return shoppingListData.shoppingList;
        })
      );
  }

  saveShoppingListMONGO(shoppingList: ShoppingListMONGO): Observable<{message: string, shoppingListId: string}> {
    return this.http.post<{ message: string, shoppingListId: string }>(this.urlMONGO, shoppingList)
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        throw new Error(error.error.message);
      })
    );
  }

  deleteShoppingListMONGO(id: string): Observable<{message: string}> {
    const url = `${this.urlMONGO}delete/${id}`;
    return this.http.delete<{ message: string}>(url)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          throw new Error(error.error.message);
        })
      );
  }
}