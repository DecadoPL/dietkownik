import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { environment } from "src/environments/environment";
import { DietMONGO } from "../models/diet/dietMONGO.model";
import { DietListItemMONGO } from "../models/diet/dietListItemMONGO.model";

@Injectable()
export class DietService{

  constructor(private http: HttpClient){}

  private urlMONGO = environment.backendMainUrl + 'api/diets/';

  saveDietMONGO(diet: DietMONGO): Observable<{message: string, dietId: string}> {
    return this.http.post<{message: string, dietId: string}>(this.urlMONGO, diet)
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        throw new Error(error.error.message)
      })
    )
  }

  getDietsListMONGO(): Observable<DietListItemMONGO[]>{
    return this.http.get<{message: String, diets: DietListItemMONGO[]}>(this.urlMONGO)
      .pipe(
        map((dietsData: any) => {
          return dietsData.diets;
        })
      )
  }

  getSearchDietsMONGO(searchName: string): Observable<DietListItemMONGO[]> {
    return this.http.get<{message: string, diets: DietListItemMONGO[]}>(this.urlMONGO+ 'search/' + searchName)
      .pipe(
        map((dietsData: any) => {
          return dietsData.diets;
        })
      );
  }

  getDietMONGO(id: string): Observable<DietMONGO>{
    return this.http.get<{message: String, diet: DietMONGO}>(this.urlMONGO+id)
      .pipe(
        map((dietsData: any) => {
          return dietsData.diet;
        }),
        catchError((error) => {
          throw new Error(error.error.message)
        })
      )
  }

  deleteDietMONGO(id: string): Observable<{message: string}>{
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

  copyDietMONGO(id: string): Observable<{message: string}>{
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