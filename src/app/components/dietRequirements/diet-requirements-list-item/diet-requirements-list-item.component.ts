import { Component, Input, OnInit } from '@angular/core';
import { DietRequirementsListItemMONGO } from 'src/app/models/diet/dietRequirementsListItemMONGO.model';

@Component({
  selector: 'app-diet-requirements-list-item',
  templateUrl: './diet-requirements-list-item.component.html',
  styleUrls: ['./diet-requirements-list-item.component.css']
})
export class DietRequirementsListItemComponent implements OnInit {
  @Input() dietRequirements!: DietRequirementsListItemMONGO;
  @Input() index!: string;
  ngOnInit(){}

}
