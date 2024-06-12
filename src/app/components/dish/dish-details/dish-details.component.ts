import { Component, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, Observable, OperatorFunction, switchMap } from 'rxjs';
import { IDeactivateComponent } from 'src/app/services/can-deactivate-guard.service';
import { DishService } from 'src/app/services/dish.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { IngredientListItemMONGO } from 'src/app/models/ingredient/ingredientListItemMONGO';
import { DishIngredientMONGO } from 'src/app/models/dish/dishIngredientMONGO.model';
import { PortionMONGO } from 'src/app/models/ingredient/portionMONGO.model';
import { ToastrService } from 'ngx-toastr';
import { DishMONGO } from 'src/app/models/dish/dishMONGO.model';

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})

export class DishDetailsComponent implements OnInit, IDeactivateComponent{
	newIngr!: IngredientListItemMONGO;
  dishForm!: FormGroup;
  isFormValid: boolean = false;
  requireSave: boolean = false;
  alertMsg!: string;
  alert: boolean = false;
  dishIngrQuantityStep: number = 0.1;
  newDishFlag: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dishService: DishService,
              private ingredientService: IngredientService,
              private toastrService: ToastrService,
              private fb:FormBuilder){}  

  ngOnInit(){
    this.dishForm = this.fb.group({
      _id: undefined,
      dishName: [null, Validators.required],
      dishPortions: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      dishRecipe: [null],
      dishIngredients: this.fb.array([]), 
      dishProteinsPerPortion: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      dishCarbohydratesPerPortion: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      dishFatPerPortion: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
      dishKcalPerPortion: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],
    })

    this.route.params.subscribe(
      (params: Params) => {
        if(params['id']!=undefined && params['id']!='new'){
          this.dishService.getDishMONGO(params['id']).subscribe(
            (dishFetched: DishMONGO) => {

              this.dishForm.patchValue({
                _id: dishFetched._id,
                dishName: dishFetched.dishName,
                dishPortions: dishFetched.dishPortions,
                dishRecipe: dishFetched.dishRecipe,
                dishProteinsPerPortion: dishFetched.dishProteinsPerPortion,
                dishCarbohydratesPerPortion: dishFetched.dishCarbohydratesPerPortion,
                dishFatPerPortion: dishFetched.dishFatPerPortion,
                dishKcalPerPortion: dishFetched.dishKcalPerPortion,
              })

              dishFetched.dishIngredients.forEach((dishIngredient: DishIngredientMONGO) => {
                const newIngr: DishIngredientMONGO = ({
                  _id: dishIngredient._id,
                  dishIngrPortion: dishIngredient.dishIngrPortion,
                  dishIngrQuantity: dishIngredient.dishIngrQuantity,
                  ingrId: dishIngredient.ingrId,
                  ingrName: dishIngredient.ingrName,
                  ingrProteins: dishIngredient.ingrProteins,
                  ingrCarbohydrates: dishIngredient.ingrCarbohydrates,
                  ingrFat: dishIngredient.ingrFat,
                  ingrKcal: dishIngredient.ingrKcal,
                  ingrPortions: []
                });

                dishIngredient.ingrPortions.forEach((ingrPortion: PortionMONGO) => {
                  const newPortion: PortionMONGO = ({
                    _id: ingrPortion._id,
                    ingrPortionName: ingrPortion.ingrPortionName,
                    ingrPortionNameId: ingrPortion.ingrPortionNameId,
                    ingrPortionWeight: ingrPortion.ingrPortionWeight
                  });
                  newIngr.ingrPortions.push(newPortion);
                });

                this.addIngredient(newIngr);
              });

              this.dishForm.statusChanges.subscribe(
                (status) =>{
                  if(status=="VALID"){
                    this.isFormValid = true;
                  }else{
                    this.isFormValid = false;
                  }
                  this.requireSave = true;
                }
              )

              this.requireSave = false;
            }
          );
        }else{
          this.newDishFlag = true
        }
      }
    )
    
    this.dishForm.statusChanges.subscribe(
      (status) =>{
        if(status=="VALID"){
          this.isFormValid = true;
        }else{
          this.isFormValid = false;
        }
        this.requireSave = true;
      }
    )

    this.dishForm.get('dishPortions')?.valueChanges.subscribe(
      value =>{
        this.calculateDishMacro();
      }
    )
  }

	formatter = (ingr: IngredientListItemMONGO) => ingr.ingrName;

  search: OperatorFunction<string, readonly IngredientListItemMONGO[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter((term) => term.length >= 2),
    switchMap((term) => this.ingredientService.getSearchIngredientsMONGO(term))
  );

  calculateDishMacro(){ 
    const precision = 2;
    this.dishForm.patchValue({
      dishProteinsPerPortion: '',
      dishCarbohydratesPerPortion: '',
      dishFatPerPortion: '',
      dishKcalPerPortion: ''
    })

    const dishPortions = this.dishForm.get('dishPortions')?.value

    this.dishIngredients.controls.forEach((control)=> {
      this.dishForm.patchValue({
          dishProteinsPerPortion: (+this.dishForm.get('dishProteinsPerPortion')?.value + (+control.get('ingrProteins')?.value)/dishPortions).toFixed(precision).toString(),
          dishCarbohydratesPerPortion: (+this.dishForm.get('dishCarbohydratesPerPortion')?.value + (+control.get('ingrCarbohydrates')?.value)/dishPortions).toFixed(precision).toString(),
          dishFatPerPortion: (+this.dishForm.get('dishFatPerPortion')?.value + (+control.get('ingrFat')?.value)/dishPortions).toFixed(precision).toString(),
          dishKcalPerPortion: (+this.dishForm.get('dishKcalPerPortion')?.value + (+control.get('ingrKcal')?.value)/dishPortions).toFixed(precision).toString(),
      })
    });
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
    if(this.isFormValid == true){
      this.dishService.saveDishMONGO(this.dishForm.value)
      .subscribe( {
        next: (response) => {
          this.toastrService.success(response.message, 'SUCCESS');
          this.requireSave = false;

          this.route.params.subscribe(
            (params: Params) => {
              if(params['id'] === undefined){
                this.dishForm.patchValue({
                  _id: undefined,
                  dishName: undefined,
                  dishPortions: 1,
                  dishRecipe: undefined,
                  dishProteinsPerPortion: 0,
                  dishCarbohydratesPerPortion: 0,
                  dishFatPerPortion: 0,
                  dishKcalPerPortion: 0,
                })
                this.dishIngredients.clear();
              }
            })

        },
        error: (error) => {
          let errMessage = error.toString();
          this.toastrService.error(errMessage.replace("Error: ", ""), "ERROR");
        }
      });
       this.requireSave = true;
    }
  }

  get dishIngredients() : FormArray {
    return this.dishForm.get("dishIngredients") as FormArray;
  }
    
  getPortions(fg: FormGroup) : FormArray {
    return fg.get('ingrPortions') as FormArray;
  }

  getIngredientFormGroup(index: number): FormGroup {
    const ret = this.dishIngredients.at(index) as FormGroup;
    return ret;
  }
  
  getIngrPortions(index: number): FormArray {
    const ret = this.getIngredientFormGroup(index).get('ingrPortions') as FormArray;
    return ret;
  }

  newPortion(portion: PortionMONGO): FormGroup{
    return this.fb.group({
      _id: portion._id,
      ingrPortionNameId: portion.ingrPortionNameId,
      ingrPortionName: portion.ingrPortionName,
      ingrPortionWeight: portion.ingrPortionWeight,
    })
  }

  changeSelectedPortion(ingrIndex: number, event: any){
    
    const selectedPortionIndex = event.target.selectedIndex;
    let ingrEdited = this.dishIngredients.at(ingrIndex);
    
    let portionToSet = ingrEdited.get('ingrPortions')?.value[selectedPortionIndex];
    let previousPortionWeight = +ingrEdited.get('dishIngrPortion')?.value.ingrPortionWeight
    ingrEdited.get('dishIngrPortion')?.setValue(portionToSet);
    this.calculateDishIngrMacroAfterPortionChange(ingrEdited, previousPortionWeight);
    
  }

  calculateDishIngrMacroAfterPortionChange(ingrEdited: any, previousPortionWeight: number){

    const precision = 6;
    const ingrPortionWeight = +ingrEdited.get('dishIngrPortion').value.ingrPortionWeight;
    let proteins = +ingrEdited.get('ingrProteins').value;
    let carbohydrates = +ingrEdited.get('ingrCarbohydrates').value;
    let fat = +ingrEdited.get('ingrFat').value;
    let kcal = +ingrEdited.get('ingrKcal').value;

    //przywrócenie 100g macro do kalkulacji
    proteins = proteins * (100/previousPortionWeight);
    carbohydrates = carbohydrates * (100/previousPortionWeight);
    fat = fat * (100/previousPortionWeight);
    kcal = kcal * (100/previousPortionWeight);

    ingrEdited.patchValue({  
      ingrProteins: (proteins * ingrPortionWeight/100).toFixed(precision).toString(),
      ingrCarbohydrates: (carbohydrates * ingrPortionWeight/100).toFixed(precision).toString(),
      ingrFat: (fat * ingrPortionWeight/100).toFixed(precision).toString(),
      ingrKcal: (kcal * ingrPortionWeight/100).toFixed(precision).toString(),
    });
    this.calculateDishMacro();
  }

  calculateDishIngrMacroAfterQuantityChange(ingrEdited: any, prevoiusDishIngrQuantity: number, newDishIngrQuantity: number){
    const precision = 6;
    let proteins = +ingrEdited.get('ingrProteins').value;
    let carbohydrates = +ingrEdited.get('ingrCarbohydrates').value;
    let fat = +ingrEdited.get('ingrFat').value;
    let kcal = +ingrEdited.get('ingrKcal').value;

    //przywrócenie macro do poziomu gdzie quantity = 1 do kalkulacji
    proteins = proteins * (1/prevoiusDishIngrQuantity);
    carbohydrates = carbohydrates * (1/prevoiusDishIngrQuantity);
    fat = fat * (1/prevoiusDishIngrQuantity);
    kcal = kcal * (1/prevoiusDishIngrQuantity);

    ingrEdited.patchValue({  
      ingrProteins: (proteins * newDishIngrQuantity).toFixed(precision).toString(),
      ingrCarbohydrates: (carbohydrates * newDishIngrQuantity).toFixed(precision).toString(),
      ingrFat: (fat * newDishIngrQuantity).toFixed(precision).toString(),
      ingrKcal: (kcal * newDishIngrQuantity).toFixed(precision).toString(),
    });
    this.calculateDishMacro();
  }

  newIngredient(ingr: DishIngredientMONGO): FormGroup {

    const newIngr = this.fb.group({
      _id: ingr._id || undefined,
      dishIngrPortion: this.fb.group({
        _id: ingr.dishIngrPortion._id,
        ingrPortionNameId: ingr.dishIngrPortion.ingrPortionNameId,
        ingrPortionName: ingr.dishIngrPortion.ingrPortionName,
        ingrPortionWeight: ingr.dishIngrPortion.ingrPortionWeight
      }),
      dishIngrQuantity: [ingr.dishIngrQuantity, [Validators.min(0), Validators.max(100000)]],
      ingrId: ingr.ingrId,
      ingrName: ingr.ingrName,
      ingrProteins: ingr.ingrProteins,
      ingrCarbohydrates: ingr.ingrCarbohydrates,
      ingrFat: ingr.ingrFat,
      ingrKcal: ingr.ingrKcal,
      ingrPortions: this.fb.array([])
    });
    ingr.ingrPortions.forEach((portion) => {
      this.getPortions(newIngr).push(this.newPortion(new PortionMONGO(portion._id, portion.ingrPortionNameId, portion.ingrPortionName, portion.ingrPortionWeight)));
    });

    return newIngr;
  }
 
  addIngredient(ingr?: DishIngredientMONGO) {
    if(this.newIngr != undefined){//jeżeli dodajemy ingredient ręcznie
      this.ingredientService.getIngredientMONGO(this.newIngr._id).subscribe(
        (ingr) => {
          let dishIngr: DishIngredientMONGO = ({
            _id:  undefined,
            dishIngrPortion: ingr.ingrPortions[0],
            dishIngrQuantity: 1,
            ingrId: ingr._id,
            ingrName: ingr.ingrName,
            ingrProteins: ingr.ingrProteins,
            ingrCarbohydrates: ingr.ingrCarbohydrates,
            ingrFat: ingr.ingrFat,
            ingrKcal: ingr.ingrKcal,
            ingrPortions: ingr.ingrPortions
          })

          this.dishIngredients.push(this.newIngredient(dishIngr));

          const newDishIngrPosition = this.dishIngredients.length-1;
          const ingrEdited = this.dishIngredients.at(newDishIngrPosition)
          let prevoiusDishIngrQuantity = 1;

          this.dishIngredients.at(newDishIngrPosition).get('dishIngrQuantity')!.valueChanges.subscribe(newDishIngrQuantity => {    
            if(newDishIngrQuantity <= 0){
              this.dishIngredients.at(newDishIngrPosition).get('dishIngrQuantity')?.setValue(prevoiusDishIngrQuantity);
              return
            }
            this.calculateDishIngrMacroAfterQuantityChange(ingrEdited, prevoiusDishIngrQuantity, newDishIngrQuantity);
            prevoiusDishIngrQuantity = newDishIngrQuantity;
          })
          this.calculateDishMacro();
          this.newIngr = new IngredientListItemMONGO("","");
       })
    } else if(ingr) { //dodawanie ingr pobranego z bazy danych przy zaciąganiu dania
      let dishIngr: DishIngredientMONGO = ({
        _id:  undefined,
        dishIngrPortion: ingr!.dishIngrPortion,
        dishIngrQuantity: ingr!.dishIngrQuantity,
        ingrId: ingr!.ingrId,
        ingrName: ingr!.ingrName,
        ingrProteins: ingr!.ingrProteins,
        ingrCarbohydrates: ingr!.ingrCarbohydrates,
        ingrFat: ingr!.ingrFat,
        ingrKcal: ingr!.ingrKcal,
        ingrPortions: ingr!.ingrPortions
      })

      this.dishIngredients.push(this.newIngredient(dishIngr));

      const newDishIngrPosition = this.dishIngredients.length-1;
      const ingrEdited = this.dishIngredients.at(newDishIngrPosition)
      let prevoiusDishIngrQuantity = 1;

      this.dishIngredients.at(newDishIngrPosition).get('dishIngrQuantity')!.valueChanges.subscribe(newDishIngrQuantity => {    
        if(newDishIngrQuantity <= 0){
          this.dishIngredients.at(newDishIngrPosition).get('dishIngrQuantity')?.setValue(prevoiusDishIngrQuantity);
          return
        }
        this.calculateDishIngrMacroAfterQuantityChange(ingrEdited, prevoiusDishIngrQuantity, newDishIngrQuantity);
        prevoiusDishIngrQuantity = newDishIngrQuantity;
      })
      this.calculateDishMacro();
    }
  }

  removeIngredient(i:number) {
    this.dishIngredients.removeAt(i);
    this.calculateDishMacro();
  }

  goUpOneLevel(){
    this.router.navigate(['dishes']);
  }
}

