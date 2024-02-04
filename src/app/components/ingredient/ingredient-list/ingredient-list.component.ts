import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map } from 'rxjs';
import { IngredientListItemMONGO } from 'src/app/models/ingredient/ingredientListItemMONGO';
import { IngredientService } from 'src/app/services/ingredient.service';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit{
  $ingredients!: IngredientListItemMONGO[];
  ingredientsToDisplay!: IngredientListItemMONGO[];
  alertMsg!: string;
  alert: boolean = false;
  itemId!: string;
  searchText!: string;

  constructor(private ingredientService: IngredientService,
              private toastrService: ToastrService){}

  ngOnInit(){
    this.loadIngredientsList();
  }

  deleteItem(id: string) {
    this.alertMsg = "Do you want to delete?"
    this.alert = true;
    this.itemId = id;
  }

  deleteCancel(){
    this.alert = false;
  }
  deleteConfirm(){
    this.ingredientService.deleteIngredientMONGO(this.itemId)
    .subscribe({
      next: (response) => {
        this.toastrService.success(response.message, 'SUCCESS');
        this.alert=false;
        this.loadIngredientsList();
      },
      error: (error) => {
        let errMessage = error.toString()
        this.toastrService.error(errMessage.replace("Error: ", ""), "ERROR");
        this.alert=false;
        this.loadIngredientsList();
      }
    });  
  }

  loadIngredientsList(){
    this.ingredientService.getIngredientsListMONGO()
    .subscribe((ingredientsList: IngredientListItemMONGO[]) => {
      this.$ingredients = ingredientsList.sort((a,b) => {
        return a.ingrName.localeCompare(b.ingrName);
      });
      this.ingredientsToDisplay = this.$ingredients;
    })
  }

  onSearch(){
    if(this.searchText!=null){
      this.ingredientsToDisplay = this.$ingredients.filter(item => item.ingrName.toLowerCase().includes(this.searchText));
    }else{
      this.ingredientsToDisplay = this.$ingredients;
    }
    
  }
}
