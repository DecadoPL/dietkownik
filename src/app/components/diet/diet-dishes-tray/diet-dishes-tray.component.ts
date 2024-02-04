import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { UnusedDish } from 'src/app/models/diet/unusedDish.model';
import { DishListItemMONGO } from 'src/app/models/dish/dishListItemMONGO.model';
import { DishMONGO } from 'src/app/models/dish/dishMONGO.model';
import { DishService } from 'src/app/services/dish.service';

@Component({
  selector: 'app-diet-dishes-tray',
  templateUrl: './diet-dishes-tray.component.html',
  styleUrls: ['./diet-dishes-tray.component.css']
})

export class DietDishesTrayComponent implements OnInit{

  @Input() unusedDishes!: UnusedDish[];
  @Output() cancel = new EventEmitter<void>();
  @Output() dishSelected = new EventEmitter<DishMONGO>();

  newDish!: DishListItemMONGO;

  constructor(private dishService: DishService){}

  ngOnInit(){

  }


  onCancel(){
    this.cancel.emit();
  }

  formatter = (dish: DishListItemMONGO) => dish.dishName;

  search: OperatorFunction<string, readonly DishListItemMONGO[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter((term) => term.length >= 2),
    switchMap((term) => this.dishService.getSearchDishesMONGO(term))
  );

  addDish(){
    if(this.newDish != undefined){     
      this.dishService.getDishMONGO(this.newDish._id).subscribe(
        (dishFetched) => {
          this.dishSelected.emit(dishFetched);
          if(this.unusedDishes.findIndex((unusedDish) => unusedDish.dish._id === dishFetched._id) === -1){
            if(dishFetched.dishPortions != 1){
              this.unusedDishes.push(new UnusedDish(dishFetched, 1));
            }
          }        
        }
      )
    }  
  }

  addDishFromUnused(unusedDish: UnusedDish, index: number){
    this.dishSelected.emit(unusedDish.dish);
    unusedDish.usedPortions++;
    if(unusedDish.usedPortions == unusedDish.dish.dishPortions){
      let unusedDishIndex = this.unusedDishes.findIndex(x => x.dish._id == unusedDish.dish._id)
      this.unusedDishes.splice(unusedDishIndex,1);
    }
    // var dishToEmit = cloneDeep(dish); 
  }
}
