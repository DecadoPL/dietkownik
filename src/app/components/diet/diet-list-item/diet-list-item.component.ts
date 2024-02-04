import { Component, Input, OnInit } from '@angular/core';
import { DietListItemMONGO } from 'src/app/models/diet/dietListItemMONGO.model';

@Component({
  selector: 'app-diet-list-item',
  templateUrl: './diet-list-item.component.html',
  styleUrls: ['./diet-list-item.component.css']
})
export class DietListItemComponent implements OnInit {
  
  @Input() diet!: DietListItemMONGO;
  @Input() index!: string;

  ngOnInit(){}


}
