import { Component, Input } from '@angular/core';
import { ShoppingListListItemMONGO } from 'src/app/models/shoppingList/shoppingListListItemMONGO.model';

@Component({
  selector: 'app-shopping-list-list-item',
  templateUrl: './shopping-list-list-item.component.html',
  styleUrls: ['./shopping-list-list-item.component.css']
})
export class ShoppingListListItemComponent {

  @Input() shoppingList!: ShoppingListListItemMONGO;
  @Input() index!: string;
  
}
