import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DishListItemMONGO } from 'src/app/models/dish/dishListItemMONGO.model';
import { DishService } from 'src/app/services/dish.service';

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css']
})
export class DishListComponent implements OnInit{
  $dishes!: DishListItemMONGO[]
  dishesToDisplay!: DishListItemMONGO[];
  alertMsg!: string;
  alert: boolean = false;
  itemId!: string;
  searchText!: string;

  constructor(private dishService: DishService,
              private toastrService: ToastrService){}

  ngOnInit(){
    this.loadDishesList();
  }

  deleteItem(id: string){
    this.alertMsg = "Do you want to delete?"
    this.alert = true;
    this.itemId = id;
  }

  deleteCancel(){
    this.alert = false;
  }

  deleteConfirm(){
    this.dishService.deleteDishMONGO(this.itemId)
    .subscribe({
      next: (response) => {
        this.toastrService.success(response.message, 'SUCCESS');
        this.alert=false;
        this.loadDishesList();
      },
      error: (error) => {
        let errMessage = error.toString()
        this.toastrService.error(errMessage.replace("Error: ", ""), "ERROR");
        this.alert=false;
        this.loadDishesList();
      }
    });  
  }

  loadDishesList(){
    this.dishService.getDishesListMONGO()
    .subscribe((dishesList: DishListItemMONGO[]) => {
        this.$dishes = dishesList.sort((a,b) => {
          return a.dishName.localeCompare(b.dishName);
        });
        this.dishesToDisplay = this.$dishes;
      }
    );
  }

  onSearch(){
    if(this.searchText!=null){
      this.dishesToDisplay = this.$dishes.filter(item => item.dishName.toLowerCase().includes(this.searchText));
    }else{
      this.dishesToDisplay = this.$dishes;
    }
  }

  copyItem(id: string){
    this.dishService.copyDishMONGO(id).subscribe({
      next: (response) => {
        this.toastrService.success(response.message, 'SUCCESS');
        this.alert=false;
        this.loadDishesList();
      },
      error: (error) => {
        let errMessage = error.toString()
        this.toastrService.error(errMessage.replace("Error: ", ""), "ERROR");
        this.alert=false;
        this.loadDishesList();
      }
    });
  }
}
