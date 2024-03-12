import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { environment } from "src/environments/environment";
import { PortionNameMONGO } from "../models/ingredient/portionNameMONGO.model";

@Injectable()
export class PortionNameService{
  constructor(private http: HttpClient){}

  private urlMONGO = environment.backendMainUrl + 'api/portionNames';

  getPortionNamesMONGO(): Observable<PortionNameMONGO[]>{
    return this.http.get<{message: string, portionNames: PortionNameMONGO[]}>(this.urlMONGO)
      .pipe(
        map((portionNamesData: any) => {
          return portionNamesData.portionNames;
        })
      );
  }

  savePortionNameMONGO(portionName: PortionNameMONGO): Observable<{message: string, portionNameId: string}> {
    return this.http.post<{message: string, portionNameId: string}>(this.urlMONGO, portionName)
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        throw new Error(error.error.message);
      })
    );
  }

  deletePortionNameMONGO(id:string): Observable<{message: string}> {
    const url = `${this.urlMONGO}/delete/${id}`;
    return this.http.delete<{message: string}>(url)
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