import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { DietListItemMONGO } from 'src/app/models/diet/dietListItemMONGO.model';
import { ShoppingListItemMONGO } from 'src/app/models/shoppingList/shoppingListItemMONGO.model';
import { ShoppingListMONGO } from 'src/app/models/shoppingList/shoppingListMONGO.model';

import { DietService } from 'src/app/services/diet.service';
import { ShoppingListService } from 'src/app/services/shoppingList.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list-details.component.html',
  styleUrls: ['./shopping-list-details.component.css']
})
export class ShoppingListDetailsComponent implements OnInit {

  ShoppingListGenerated: boolean = false;
  $diets!: DietListItemMONGO[];
  shoppingListForm!: FormGroup;

  constructor(private dietService: DietService,
              private shoppingListService: ShoppingListService,
              private fb: FormBuilder,
              private route: ActivatedRoute){}

  ngOnInit(){
    this.shoppingListForm = this.fb.group({
      _id: undefined,
      name: 'ShoppingListName',
      diets: [[]],
      unchecked: this.fb.array([]), 
      checked: this.fb.array([]) 
    })

    this.dietService.getDietsListMONGO().subscribe(
      (dietsListFetched) => {
        this.$diets = dietsListFetched;
      }
    )

    this.route.params.subscribe(
      (params: Params) => {
        if(params['id']!=undefined && params['id']!= 'new'){
          this.shoppingListService.getShoppingListMONGO(params['id']).subscribe(
            (shoppingListFetched) => {
              this.shoppingListForm.get('_id')?.setValue(shoppingListFetched._id)
              this.shoppingListForm.get('name')?.setValue(shoppingListFetched.shoppingListName)

              if(shoppingListFetched.shoppingListItems != null) {
                shoppingListFetched.shoppingListItems.forEach((item) => {
                  if(item.itemChecked){
                    this.checked.push(this.newItemInForm(item));
                  }else{
                    this.unchecked.push(this.newItemInForm(item));
                  }
                })
              }
            }
          )
        }
      }
    );

    this.shoppingListForm.get('name')?.valueChanges.subscribe(
      (value) => {
        if(value!=""){
          this.shoppingListService.saveShoppingListMONGO(this.transformDataToSave()).subscribe();
        }
      }
    )
  }

  get unchecked(): FormArray {
    return this.shoppingListForm.get('unchecked') as FormArray
  }

  get checked(): FormArray {
    return this.shoppingListForm.get('checked') as FormArray
  }

  newItemInForm(item: ShoppingListItemMONGO): FormGroup {
    return this.fb.group({
      _id: item._id,
      itemName: item.itemName,
      itemWeight: item.itemWeight,
      itemPC: item.itemPC,
      itemPCWeight: item.itemPCWeight,
      itemPackages: item.itemPackages,
      itemPackagesWeight: item.itemPackagesWeight,
      itemChecked: item.itemChecked
    })
  }

  generateShoppingList(){
    this.ShoppingListGenerated = true;
    const selectedDiets = this.shoppingListForm.get('diets')?.value
    this.shoppingListService.getShoppingListForDietsMONGO(selectedDiets).subscribe(
      (fetchedDietItems) => {
        fetchedDietItems.forEach(fetchedItem => {
          this.unchecked.push(this.newItemInForm(fetchedItem))
        })
      }
    )
  }

  checkItem(item: ShoppingListItemMONGO, itemIndex: number){
    item.itemChecked = true;
    this.checked.push(this.newItemInForm(item));
    this.unchecked.removeAt(itemIndex)
    this.shoppingListService.saveShoppingListMONGO(this.transformDataToSave()).subscribe();
  }

  uncheckItem(item: ShoppingListItemMONGO, itemIndex: number){
    item.itemChecked = false;
    this.unchecked.push(this.newItemInForm(item));
    this.checked.removeAt(itemIndex)
    this.shoppingListService.saveShoppingListMONGO(this.transformDataToSave()).subscribe();
  }

  newItem(event: any) {
    var value = event.target.value;
    this.unchecked.push(this.newItemInForm(new ShoppingListItemMONGO(undefined,value,1,1,1,1,1, false)));
    event.target.value = "";
    this.shoppingListService.saveShoppingListMONGO(this.transformDataToSave()).subscribe();
  }

  uncheckedUpdate(event: any, itemIndex: number){
    var value = event.target.value;
    this.unchecked.at(itemIndex).get('itemWeight')?.setValue(value);
    this.shoppingListService.saveShoppingListMONGO(this.transformDataToSave()).subscribe();
    event.target.value = "";
  }

  deleteItemFromUnchecked(itemIndex: number){
    this.unchecked.removeAt(itemIndex);
    this.shoppingListService.saveShoppingListMONGO(this.transformDataToSave()).subscribe();
  }

  deleteItemFromChecked(itemIndex: number){
    this.checked.removeAt(itemIndex);
    this.shoppingListService.saveShoppingListMONGO(this.transformDataToSave()).subscribe();
  }

  transformDataToSave(){
    let tempList = new ShoppingListMONGO(this.shoppingListForm.get('_id')!.value,this.shoppingListForm.get('name')!.value,[])
    
    this.unchecked.controls.forEach(item => {
      tempList.shoppingListItems.push(item.value)
    })

    this.checked.controls.forEach(item => {
      tempList.shoppingListItems.push(item.value)
    })

    return tempList
  }

}
