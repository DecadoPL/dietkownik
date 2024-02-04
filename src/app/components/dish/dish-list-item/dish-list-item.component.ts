import { Component, Input, OnInit } from '@angular/core';
import { DishListItemMONGO } from 'src/app/models/dish/dishListItemMONGO.model';


@Component({
  selector: 'app-dish-list-item',
  templateUrl: './dish-list-item.component.html',
  styleUrls: ['./dish-list-item.component.css']
})
export class DishListItemComponent implements OnInit{
  @Input() dish!: DishListItemMONGO;
  @Input() index!: string;

  ngOnInit(){}
}
