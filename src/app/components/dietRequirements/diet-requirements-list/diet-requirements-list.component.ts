import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DietRequirementsListItemMONGO } from 'src/app/models/diet/dietRequirementsListItemMONGO.model';
import { DietRequirementsService } from 'src/app/services/dietRequirements.service';

@Component({
  selector: 'app-diet-requirements-list',
  templateUrl: './diet-requirements-list.component.html',
  styleUrls: ['./diet-requirements-list.component.css']
})
export class DietRequirementsListComponent implements OnInit {
  $dietRequirementsList!: DietRequirementsListItemMONGO[];
  dietRequirementsToDisplay!: DietRequirementsListItemMONGO[];
  alertMsg!: string;
  alert: boolean = false;
  itemId!: string;
  searchText!: string;
  
  constructor(private dietRequirementsService: DietRequirementsService,
              private toastrService: ToastrService){}

  ngOnInit(){
    this.loadDietRequirementsList();
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
    this.dietRequirementsService.deleteDietRequirementsMONGO(this.itemId)
    .subscribe({
      next: (response) => {
        this.toastrService.success(response.message, 'SUCCESS');
        this.alert=false;
        this.loadDietRequirementsList();
      },
      error: (error) => {
        let errMessage = error.toString()
        this.toastrService.error(errMessage.replace("Error: ", ""), "ERROR");
        this.alert=false;
        this.loadDietRequirementsList();
      }
    });  
  }

  loadDietRequirementsList(){
    this.dietRequirementsService.getDietRequirementsListMONGO()
    .subscribe((drList: DietRequirementsListItemMONGO[]) => {
        this.$dietRequirementsList = drList.sort((a,b) => {
          return a.dietRequirementsName.localeCompare(b.dietRequirementsName);
        });
        this.dietRequirementsToDisplay = this.$dietRequirementsList;
      }
    );
  }

  onSearch(){
    if(this.searchText!=null){
      this.dietRequirementsToDisplay = this.$dietRequirementsList.filter(item => item.dietRequirementsName.toLowerCase().includes(this.searchText));
    }else{
      this.dietRequirementsToDisplay = this.$dietRequirementsList;
    }
  }
}
