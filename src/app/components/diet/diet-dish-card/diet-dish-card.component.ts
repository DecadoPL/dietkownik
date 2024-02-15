import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DietDishMONGO } from 'src/app/models/diet/dietDishMONGO.model';


@Component({
  selector: 'app-diet-dish-card',
  templateUrl: './diet-dish-card.component.html',
  styleUrls: ['./diet-dish-card.component.css']
})
export class DietDishCardComponent implements OnInit {
  @Input() dish!: DietDishMONGO;
  @Input() dayId!: number;
  @Input() dishId!: string;
  @Input() dishIndex!: number;
  @Output() deleteCard = new EventEmitter<[number, number]>();
  @Output() increaseDishPortion = new EventEmitter<[number, number]>();
  @Output() decreaseDishPortion = new EventEmitter<[number, number]>();
  @Output() showDishDetails = new EventEmitter<DietDishMONGO>();
  
  ngOnInit(){
  }

}
