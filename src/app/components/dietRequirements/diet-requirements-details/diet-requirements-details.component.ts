import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DietRequirementsMONGO } from 'src/app/models/diet/dietRequirementsMONGO.model';
import { DietRequirementsService } from 'src/app/services/dietRequirements.service';

@Component({
  selector: 'app-diet-requirements-details',
  templateUrl: './diet-requirements-details.component.html',
  styleUrls: ['./diet-requirements-details.component.css']
})
export class DietRequirementsDetailsComponent implements OnInit {

  isFormValid!: boolean;
  requireSave: boolean = false;
  alertMsg!: string;
  alert: boolean = false;
  dietRequirementsForm!: FormGroup;
  newDietRequirementsFlag: boolean = false;

  constructor(private dietRequirementsService: DietRequirementsService,
              private fb: FormBuilder,
              private router: Router,
              private toastrService: ToastrService,
              private route: ActivatedRoute){}

  ngOnInit(){
    this.dietRequirementsForm = this.fb.group({
      _id: undefined,
      dietRequirementsName: [null, Validators.required],
      dietRequirementsProteins: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      dietRequirementsCarbohydrates: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      dietRequirementsFat: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      dietRequirementsKcal: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      dietRequirementsMealsTime: this.fb.array([])
    });

    this.route.params.subscribe(
      (params: Params) => {
        if(params['id']!=undefined){
          this.dietRequirementsService.getDietRequirementsMONGO(params['id']).subscribe(
            (fetchedDietRequirements: DietRequirementsMONGO) => {           
              this.dietRequirementsForm.patchValue({
                _id: fetchedDietRequirements._id,
                dietRequirementsName: fetchedDietRequirements.dietRequirementsName,
                dietRequirementsProteins: fetchedDietRequirements.dietRequirementsProteins,
                dietRequirementsCarbohydrates: fetchedDietRequirements.dietRequirementsCarbohydrates,
                dietRequirementsFat: fetchedDietRequirements.dietRequirementsFat,
                dietRequirementsKcal: fetchedDietRequirements.dietRequirementsKcal,
              });

              fetchedDietRequirements.dietRequirementsMealsTime.forEach(mealTime => {
                this.dietRequirementsMealsTime.push(this.fb.control(mealTime))
              })
             
              this.requireSave = false;

            }
          )
        }

        this.dietRequirementsForm.statusChanges.subscribe(
          (status) =>{
            if(status=="VALID"){
              this.isFormValid = true;
            }else{
              this.isFormValid = false;
            }
            this.requireSave = true;
          }
        )
  
      }    
    )

    this.dietRequirementsForm.get('dietRequirementsProteins')?.valueChanges.subscribe(
      () => {
        this.calculateKcal();
      }
    );

    this.dietRequirementsForm.get('dietRequirementsCarbohydrates')?.valueChanges.subscribe(
      () => {
        this.calculateKcal();
      }
    );

    this.dietRequirementsForm.get('dietRequirementsFat')?.valueChanges.subscribe(
      () => {
        this.calculateKcal();
      }
    );

  }

  get dietRequirementsMealsTime() : FormArray{
    return this.dietRequirementsForm.get('dietRequirementsMealsTime') as FormArray;
  }

  updateHour(event: any, index: number) {  
    const value = event.target.value;
    if(value != ""){      
      if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        this.dietRequirementsMealsTime.at(index).setValue(value);
        this.requireSave = true;
      } else {

      }
    }else{
      this.dietRequirementsMealsTime.removeAt(index);
      this.requireSave = true;
    }
  }

  newHour(event: any) {
    let value = event.target.value;

    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
      if(value.length ==4) {
        value = "0"+value;
      }
      if(this.dietRequirementsMealsTime.at(0)){
        const firsHour = this.dietRequirementsMealsTime.at(0).value;
        const date = new Date(`2000-01-01T${value}:00`);
        const firstDate = new Date(`2000-01-01T${firsHour}:00`);
        const length = this.dietRequirementsMealsTime.length;
        var index = -1;
        if(date<firstDate){
          index = 0;
        }else{      
          for(let i =0; i<length; i++){
            const time = this.dietRequirementsMealsTime.at(i).value;
            const timeDate = new Date(`2000-01-01T${time}:00`);
            if(timeDate > date)
            {
              index = i;
              break;
            }
          }
        }
  
        if (index === -1) {
          index = length;
        }
  
        this.dietRequirementsMealsTime.insert(index,this.fb.control(value));
      }else{
        this.dietRequirementsMealsTime.push(this.fb.control(value));
      }

      event.target.value = '';
      this.requireSave = true;
    } else {
      
    }

  }

  canExit(): Promise<boolean> {
    if (this.requireSave == false) {
      return Promise.resolve(true);
    } else {
      this.alertMsg = "Save changes or die try'n";
      this.alert = true;
      return new Promise<boolean>((resolve, reject) => {
        this.alertSave = () => {
          this.alert = false;
          this.onSubmit(event);
          resolve(true);
        };
        this.alertCancel = () => {
          this.alert = false;
          resolve(false);
        };
        this.alertDiscard = () => {
          this.alert = false;
          resolve(true);
        };
      });
    }
  }

  alertCancel(){}

  alertSave(){}

  alertDiscard(){}


  onSubmit(event: any){

    if(this.isFormValid == true){

      this.dietRequirementsService.saveDietRequirementsMONGO(this.dietRequirementsForm.value)
      .subscribe( {
        next: (response) => {
          this.toastrService.success(response.message, 'SUCCESS');
          this.requireSave = false;
        },
        error: (error) => {
          let errMessage = error.toString();
          this.toastrService.error(errMessage.replace("Error: ", ""), "ERROR");
        }
      });
       this.requireSave = true;

      //this.router.navigate(['dishes']);
    }
    // event.preventDefault();
    // if(this.dietRequirements.id != 0){
    //   this.dietRequirementsService.updateDietRequirements(this.dietRequirements).subscribe();
    // }else{
    //   this.dietRequirementsService.addDietRequirements(this.dietRequirements).subscribe();
    // } 

    // this.requireSave = false;
    
  }

  calculateKcal(){
    const proteins = +this.dietRequirementsForm.get('dietRequirementsProteins')?.value;
    const carbohydrates = +this.dietRequirementsForm.get('dietRequirementsCarbohydrates')?.value;
    const fat = +this.dietRequirementsForm.get('dietRequirementsFat')?.value;
    let kcal = proteins*4+carbohydrates*4+fat*9;
    this.dietRequirementsForm.patchValue({ dietRequirementsKcal: kcal}, {emitEvent: false});
  }

  goUpOneLevel(){
    this.router.navigate(['dietRequirements']);
  }

}
