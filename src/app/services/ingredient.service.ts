import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map} from "rxjs";
import { environment } from "src/environments/environment";
import { IngredientMONGO } from "../models/ingredient/ingredientMONGO.model";
import { IngredientListItemMONGO } from "../models/ingredient/ingredientListItemMONGO";


@Injectable()
export class IngredientService{

  constructor(private http: HttpClient){}

  private urlMONGO = environment.backendMainUrl + 'api/ingredients/';

  getIngredientsListMONGO(): Observable<IngredientListItemMONGO[]> {
    return this.http.get<{ message: string, ingredients: IngredientListItemMONGO[] }>(this.urlMONGO)
      .pipe(
        map((ingredientsData: any) => {
          return ingredientsData.ingredients;
        })
      );
  }

  getSearchIngredientsMONGO(searchName: string): Observable<IngredientListItemMONGO[]> {
    return this.http.get<{message: string, ingredients: IngredientListItemMONGO[]}>(this.urlMONGO+ 'search/' + searchName)
      .pipe(
        map((ingredientsData: any) => {
          return ingredientsData.ingredients;
        })
      );
  }

  getIngredientMONGO(id: string): Observable<IngredientMONGO>{
    return this.http.get<{ message: string, ingredient: IngredientMONGO }>(this.urlMONGO+id)
      .pipe(
        map((ingredientData: any) => {
          return ingredientData.ingredient;
        })
      );
  }

  saveIngredientMONGO(ingredient: IngredientMONGO): Observable<{message: string, ingredientId: string}> {
    return this.http.post<{ message: string, ingredientId: string }>(this.urlMONGO, ingredient)
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        throw new Error(error.error.message);
      })
    );
  }

  deleteIngredientMONGO(id: string): Observable<{message: string}> {
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
