import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DietDishMONGO } from 'src/app/models/diet/dietDishMONGO.model';
import { DishMONGO } from 'src/app/models/dish/dishMONGO.model';
import { DishService } from 'src/app/services/dish.service';

@Component({
  selector: 'app-diet-dish-details',
  templateUrl: './diet-dish-details.component.html',
  styleUrls: ['./diet-dish-details.component.css']
})
export class DietDishDetailsComponent implements OnInit{

  dish?: DishMONGO;
  @Input() dietDish!: DietDishMONGO;
  @Output() close = new EventEmitter<void>();

  constructor(private dishService: DishService){}

  ngOnInit(): void {
    this.dishService.getDishMONGO(this.dietDish.dishId!).subscribe(
      (dishFetched) => {
        this.dish = dishFetched;
      })
  }

  onClose(){
    this.close.emit();
  }


}
