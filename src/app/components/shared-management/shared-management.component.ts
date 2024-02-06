import { Component, OnInit } from '@angular/core';
import { PortionNameMONGO } from 'src/app/models/ingredient/portionNameMONGO.model';
// import { PortionNameMONGO } from 'src/app/models/ingredient/portionNameMONGO.model';
import { PortionNameService } from 'src/app/services/portionName.service';
// import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-shared-management',
  templateUrl: './shared-management.component.html',
  styleUrls: ['./shared-management.component.css']
})
export class SharedManagementComponent implements OnInit{

  $PortionNames!: PortionNameMONGO[];
  allPortionNames!: PortionNameMONGO[];

  constructor(private PortionNameService: PortionNameService){}

  ngOnInit(){
    this.PortionNameService.getPortionNamesMONGO().subscribe(
      (portionNames) => {
        this.$PortionNames = portionNames;
        this.allPortionNames = portionNames;
      }
    )
  }

  updatePortionName(event: any, pt: any) {
    const value = event.target.value;
    if(value != ""){      
      let portionName: PortionNameMONGO = pt;
      portionName.portionName = event.target.value;
      this.PortionNameService.savePortionNameMONGO(portionName).subscribe(
        (response) => {
        }
      )
    }else{
      this.PortionNameService.deletePortionNameMONGO(pt._id).subscribe(
        (response) => {
        }
      )
    }
  }

  newPortionName(event: any) {
    var portion: PortionNameMONGO = {_id:"", portionName:""}; 
    portion.portionName = event.target.value;
    this.PortionNameService.savePortionNameMONGO(portion).subscribe(
        (data) => {
        }
    )
    event.target.value = "";
  }

}
