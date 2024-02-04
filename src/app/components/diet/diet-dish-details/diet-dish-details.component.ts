import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DishService } from 'src/app/services/dish.service';

@Component({
  selector: 'app-diet-dish-details',
  templateUrl: './diet-dish-details.component.html',
  styleUrls: ['./diet-dish-details.component.css']
})
export class DietDishDetailsComponent implements OnInit{

  // dish!: DishMONGO;
  dietId!: number;
  dayId!: number;
  dishId!: number;

  constructor(private route: ActivatedRoute,
              private dishService: DishService){}

  ngOnInit(){
    this.route.params.subscribe(
      (params: Params) => {

        this.dietId = +params['dietId'];
        this.dayId = +params['dayId'];
        this.dishId = +params['dishId'];
        
        // this.dishService.getDish(this.dishId).subscribe(
        //   (dish) => {
        //     this.dish = dish;
        //   }
        // )
      }
    )
  }

}
