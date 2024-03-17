import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DietListItemMONGO } from 'src/app/models/diet/dietListItemMONGO.model';
import { DietService } from 'src/app/services/diet.service';

@Component({
  selector: 'app-diet-list',
  templateUrl: './diet-list.component.html',
  styleUrls: ['./diet-list.component.css']
})
export class DietListComponent implements OnInit{
  $diets!: DietListItemMONGO[];
  dietsToDisplay!: DietListItemMONGO[];
  alertMsg!: string;
  alert: boolean = false;
  itemId!: string;
  searchText!: string;

  constructor(private dietService: DietService,
              private toastrService: ToastrService){}
  
  ngOnInit(){
    this.loadDietsList();
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
    this.dietService.deleteDietMONGO(this.itemId)
    .subscribe({
      next: (response) => {
        this.toastrService.success(response.message, 'SUCCESS');
        this.alert=false;
        this.loadDietsList();
      },
      error: (error) => {
        let errMessage = error.toString()
        this.toastrService.error(errMessage.replace("Error: ", ""), "ERROR");
        this.alert=false;
        this.loadDietsList();
      }
    });  
  }

  loadDietsList(){
    this.dietService.getDietsListMONGO()
    .subscribe((dishesList: DietListItemMONGO[]) => {
        this.$diets = dishesList.sort((a,b) => {
          return a.dietName.localeCompare(b.dietName);
        });
        this.dietsToDisplay = this.$diets;
      }
    );
  }

  onSearch(){
    if(this.searchText!=null){
      this.dietsToDisplay = this.$diets.filter(item => item.dietName.toLowerCase().includes(this.searchText));
    }else{
      this.dietsToDisplay = this.$diets;
    }
  }

  copyItem(id: string){
    this.dietService.copyDietMONGO(id).subscribe({
      next: (response) => {
        this.toastrService.success(response.message, 'SUCCESS');
        this.alert=false;
        this.loadDietsList();
      },
      error: (error) => {
        let errMessage = error.toString()
        this.toastrService.error(errMessage.replace("Error: ", ""), "ERROR");
        this.alert=false;
        this.loadDietsList();
      }
    });
  }

}
