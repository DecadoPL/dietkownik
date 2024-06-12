import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DishMONGO } from "../models/dish/dishMONGO.model";
import { DishListItemMONGO } from "../models/dish/dishListItemMONGO.model";

@Injectable()
export class DishService{

  constructor(private http: HttpClient){}

  private urlMONGO = environment.backendMainUrl + 'api/dishes/';

  saveDishMONGO(dish: DishMONGO): Observable<{message: string, dishId: string}> {
    return this.http.post<{message: string, dishId: string}>(this.urlMONGO, dish)
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        throw new Error(error.error.message)
      })
    )
  }

  getDishesListMONGO(): Observable<DishListItemMONGO[]>{
    return this.http.get<{message: String, dishes: DishListItemMONGO[]}>(this.urlMONGO)
      .pipe(
        map((dishesData: any) => {
          return dishesData.dishes;
        })
      )
  }

  getSearchDishesMONGO(searchName: string): Observable<DishListItemMONGO[]> {
    return this.http.get<{message: string, dishes: DishListItemMONGO[]}>(this.urlMONGO+ 'search/' + searchName)
      .pipe(
        map((dishesData: any) => {
          return dishesData.dishes;
        })
      );
  }

  getDishMONGO(id: string): Observable<DishMONGO>{
    return this.http.get<{message: String, dish: DishMONGO}>(this.urlMONGO+id)
      .pipe(
        map((dishesData: any) => {
          return dishesData.dish;
        }),
        catchError((error) => {
          throw new Error(error.error.message)
        })
      )
  }

  deleteDishMONGO(id: string): Observable<{message: string}>{
    const url = `${this.urlMONGO}delete/${id}`;
    return this.http.delete<{message: string}>(url)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          throw new Error(error.error.message)
        })
      )
  }
 
  copyDishMONGO(id: string): Observable<{message: string}>{
    const url = `${this.urlMONGO}copy/${id}`;
    return this.http.get<{message: string}>(url)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          throw new Error(error.error.message)
        })
      )
  }
}