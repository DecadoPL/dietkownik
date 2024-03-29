import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
 
export interface IDeactivateComponent {
  canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuardService 
{
  component!: Object;
  route!: ActivatedRouteSnapshot;
 
  constructor(){
  }
 
  canDeactivate(component:IDeactivateComponent,
                route: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot,
                nextState: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
      
    return component.canExit ? component.canExit() : true;
 
  }
  
}