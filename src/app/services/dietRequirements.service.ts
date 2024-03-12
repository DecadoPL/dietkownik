import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { environment } from "src/environments/environment";
import { DietRequirementsMONGO } from "../models/diet/dietRequirementsMONGO.model";
import { DietRequirementsListItemMONGO } from "../models/diet/dietRequirementsListItemMONGO.model";

@Injectable()
export class DietRequirementsService{

  constructor(private http: HttpClient){}


  private urlMONGO = environment.backendMainUrl + 'api/dietRequirements/';

  saveDietRequirementsMONGO(dr: DietRequirementsMONGO) : Observable<{message: string, drId: string}>{
    return this.http.post<{message: string, drId: string}>(this.urlMONGO, dr)
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        throw new Error(error.error.message)
      })
    )
  }

  getDietRequirementsListMONGO(): Observable<DietRequirementsListItemMONGO[]>{
    return this.http.get<{message: String, dietRequirements: DietRequirementsListItemMONGO[]}>(this.urlMONGO)
      .pipe(
        map((dietRequirementsData: any) => {
          return dietRequirementsData.dietRequirements;
        })
      )
  }

  getDietRequirementsMONGO(id: string): Observable<DietRequirementsMONGO>{
    return this.http.get<{message: String, dietRequirements: DietRequirementsMONGO}>(this.urlMONGO+id)
      .pipe(
        map((dietRequirementsData: any) => {
          return dietRequirementsData.dietRequirements;
        }),
        catchError((error) => {
          throw new Error(error.error.message)
        })
      )
  }

  deleteDietRequirementsMONGO(id: string): Observable<{message: string}>{
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
}