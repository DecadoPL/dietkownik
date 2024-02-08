import { Component, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IngredientService } from 'src/app/services/ingredient.service';
import { IDeactivateComponent } from 'src/app/services/can-deactivate-guard.service';
import { IngredientMONGO } from 'src/app/models/ingredient/ingredientMONGO.model';
import { PortionNameMONGO } from 'src/app/models/ingredient/portionNameMONGO.model';
import { PortionMONGO } from 'src/app/models/ingredient/portionMONGO.model';
import { ToastrService } from 'ngx-toastr';
import { PortionNameService } from 'src/app/services/portionName.service';

@Component({
  selector: 'app-ingredient-details',
  templateUrl: './ingredient-details.component.html',
  styleUrls: ['./ingredient-details.component.css']
})
export class IngredientDetailsComponent implements OnInit, IDeactivateComponent{

  $portionNames!: PortionNameMONGO[];
  ingredientForm!: FormGroup;
  isFormValid: boolean = false;
  requireSave: boolean = false;
  alertMsg!: string;
  alert: boolean = false;
  newIngredientFlag: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private ingredientService: IngredientService,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private portionNameService: PortionNameService
             ){}

  ngOnInit(){

    this.ingredientForm = this.fb.group({
      _id: undefined,
      ingrName: [undefined, Validators.required],
      ingrProteins: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      ingrCarbohydrates: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      ingrFat: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      ingrKcal: 0,//{value: 0, disabled: true},
      newPortion: this.fb.group({
        nameId: [],
        name: [],
        weight: []
      }),
      ingrPortions: this.fb.array([]), 
    });

    this.portionNameService.getPortionNamesMONGO().subscribe(
      (portionNames) => {
        this.$portionNames = portionNames;
        if(this.newIngredientFlag === true){
          this.ingrPortions.push(this.newPortion(new PortionMONGO(undefined, this.$portionNames[0]._id, this.$portionNames[0].portionName, 100)));
          this.requireSave = false;
        }
        this.$portionNames.splice(0,1);//po dodaniu 100g do składnika usuwamy z listy aby nie można było dodać więcej 100g bo to bez sensu.
        
      }
    )

    this.route.params.subscribe(
      (params: Params) => {
        if(params['id']!=undefined){
          this.ingredientService.getIngredientMONGO(params['id']).subscribe(
            (ingredientFetched: IngredientMONGO) => {
              this.newIngredientFlag = false;
              this.ingredientForm.patchValue({
                _id: ingredientFetched._id,
                ingrName: ingredientFetched.ingrName,
                ingrProteins: ingredientFetched.ingrProteins,
                ingrCarbohydrates: ingredientFetched.ingrCarbohydrates,
                ingrFat: ingredientFetched.ingrFat,
                ingrKcal: ingredientFetched.ingrKcal,
              });

              if(ingredientFetched.ingrPortions){
                ingredientFetched.ingrPortions.forEach(portion => {
                  this.ingrPortions.push(this.newPortion(new PortionMONGO(portion._id, portion.ingrPortionNameId, portion.ingrPortionName, portion.ingrPortionWeight)));
                })
              }
              this.subscriptions();
              this.requireSave = false;
            }
          )  
        }else{        
          this.newIngredientFlag = true;
          this.subscriptions();
        }
      }
    )  
  }

  get ingrPortions() : FormArray {
    return this.ingredientForm.get("ingrPortions") as FormArray
  }

  newPortion(portion: PortionMONGO): FormGroup {
    return this.fb.group({
      _id: portion._id,
      ingrPortionNameId: portion.ingrPortionNameId,
      ingrPortionName: portion.ingrPortionName,
      ingrPortionWeight: portion.ingrPortionWeight,
    })
  }

  newPortionEnter(){
    let newPortion = this.ingredientForm.get('newPortion')?.value;
    let portionNameId = this.$portionNames.find(x => x.portionName == newPortion.name)!._id;
    this.ingrPortions.push(this.newPortion(new PortionMONGO(undefined, portionNameId!, newPortion.name, newPortion.weight)));
    this.ingrPortions.controls.forEach((control ,index)=> {
      control.get('weight')?.valueChanges.subscribe(value => {
        if(value==""){
          this.ingrPortions.removeAt(index, {emitEvent: false})
        }
      });
    });
  }

  subscriptions(){
    this.ingredientForm.statusChanges.subscribe(
      (status) =>{
        if(status=="VALID"){
          this.isFormValid = true;
        }else{
          this.isFormValid = false;
        }
        this.requireSave = true;
      }
    )

    this.ingredientForm.get('ingrProteins')?.valueChanges.subscribe(
      () => {
        this.ingredientForm.patchValue({ingrKcal: this.calculateKcal()}, {emitEvent: false});
      }
    )

    this.ingredientForm.get('ingrCarbohydrates')?.valueChanges.subscribe(
      () => {
        this.ingredientForm.patchValue({ingrKcal: this.calculateKcal()}, {emitEvent: false});
      }
    )

    this.ingredientForm.get('ingrFat')?.valueChanges.subscribe(
      () => {
        this.ingredientForm.patchValue({ingrKcal: this.calculateKcal()}, {emitEvent: false});
      }
    )

  }

  canExit(): Promise<boolean> {
    if (this.requireSave == false) {
      return Promise.resolve(true);
    } else {
      this.alertMsg = "There are unsaved changes on pages!";
      this.alert = true;
      return new Promise<boolean>((resolve, reject) => {
        this.alertSave = () => {
          this.alert = false;
          this.onSubmit();
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


  onSubmit(){
    if(this.isFormValid){
      this.ingredientForm.removeControl('newPortion');
      this.ingredientService.saveIngredientMONGO(this.ingredientForm.value)
        .subscribe( {
          next: (response) => {
            this.toastrService.success(response.message, 'SUCCESS');
            this.ingredientForm.reset();
            this.requireSave = false;
          },
          error: (error) => {
            let errMessage = error.toString();
            this.toastrService.error(errMessage.replace("Error: ", ""), "ERROR");
          }
        });
    }
  }

  calculateKcal(){
    const proteins = this.ingredientForm.get('ingrProteins')?.value;
    const carbohydrates = this.ingredientForm.get('ingrCarbohydrates')?.value;
    const fat = this.ingredientForm.get('ingrFat')?.value;
    return ((+proteins!*4)+(+carbohydrates!*4)+(+fat!*9)).toFixed(1).toString();
  }

  goUpOneLevel(){
    this.router.navigate(['ingredients']);
  }

  
}
