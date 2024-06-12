import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ShoppingListListItemMONGO } from 'src/app/models/shoppingList/shoppingListListItemMONGO.model';
import { ShoppingListService } from 'src/app/services/shoppingList.service';

@Component({
  selector: 'app-shopping-list-list',
  templateUrl: './shopping-list-list.component.html',
  styleUrls: ['./shopping-list-list.component.css']
})
export class ShoppingListListComponent {
  $shoppingLists!: ShoppingListListItemMONGO[];
  shoppingListsToDisplay!: ShoppingListListItemMONGO[];
  alertMsg!: string;
  alert: boolean = false;
  itemId!: string;
  searchText!: string;

  constructor(private shoppingListService: ShoppingListService,
              private toastrService: ToastrService){}
  
  ngOnInit(){
    this.loadShoppingListsList();
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
    this.shoppingListService.deleteShoppingListMONGO(this.itemId)
    .subscribe({
      next: (response) => {
        this.toastrService.success(response.message, 'SUCCESS');
        this.alert=false;
        this.loadShoppingListsList();
      },
      error: (error) => {
        let errMessage = error.toString()
        this.toastrService.error(errMessage.replace("Error: ", ""), "ERROR");
        this.alert=false;
        this.loadShoppingListsList();
      }
    });  
  }

  loadShoppingListsList(){
    this.shoppingListService.getShoppingListListMONGO()
    .subscribe((shoppingList: ShoppingListListItemMONGO[]) => {

        this.$shoppingLists = shoppingList.sort((a,b) => {
          return a.shoppingListName.localeCompare(b.shoppingListName);
        });
        this.shoppingListsToDisplay = this.$shoppingLists;
      }
    );
  }

  onSearch(){
    if(this.searchText!=null){
      this.shoppingListsToDisplay = this.$shoppingLists.filter(item => item.shoppingListName.toLowerCase().includes(this.searchText));
    }else{
      this.shoppingListsToDisplay = this.$shoppingLists;
    }
  }

}
