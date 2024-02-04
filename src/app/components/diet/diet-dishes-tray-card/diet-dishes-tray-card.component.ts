import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnusedDish } from 'src/app/models/diet/unusedDish.model';
import { DishMONGO } from 'src/app/models/dish/dishMONGO.model';

@Component({
  selector: 'app-diet-dishes-tray-card',
  templateUrl: './diet-dishes-tray-card.component.html',
  styleUrls: ['./diet-dishes-tray-card.component.css']
})
export class DietDishesTrayCardComponent implements OnInit {
  @Input() unusedDish!: UnusedDish;
  @Output() addDishFromUnused = new EventEmitter<DishMONGO>();
  portionsLeft!: string;

  ngOnInit(){
    if(this.unusedDish){
      this.portionsLeft = `${this.unusedDish.dish.dishPortions-this.unusedDish.usedPortions}`;
    } 
  }

}
