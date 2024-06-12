import { DatePipe } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IDeactivateComponent } from 'src/app/services/can-deactivate-guard.service';
import { DietService } from 'src/app/services/diet.service';
import { DietRequirementsService } from 'src/app/services/dietRequirements.service';
import { CdkDragDrop} from '@angular/cdk/drag-drop';
import { DietDayMONGO } from 'src/app/models/diet/dietDayMONGO.model';
import { DietDishMONGO } from 'src/app/models/diet/dietDishMONGO.model';
import { DietRequirementsListItemMONGO } from 'src/app/models/diet/dietRequirementsListItemMONGO.model';
import { DishMONGO } from 'src/app/models/dish/dishMONGO.model';
import { ToastrService } from 'ngx-toastr';
import { DietMONGO } from 'src/app/models/diet/dietMONGO.model';
import { UnusedDish } from 'src/app/models/diet/unusedDish.model';
import { DishService } from 'src/app/services/dish.service';

const today = new Date();

type DietReq = {
  proteins: number;
  carbohydrates: number;
  fat: number;
  kcal: number;
}

@Component({
  selector: 'app-diet-details',
  templateUrl: './diet-details.component.html',
  styleUrls: ['./diet-details.component.css']
})

export class DietDetailsComponent implements OnInit, IDeactivateComponent{

  unusedDishes: UnusedDish[] = [];
  date: NgbDateStruct = {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate()};
  dietForm!: FormGroup;
  showInputs: { [key: string]: boolean } = {};
  isFormValid: boolean = false;
  requireSave: boolean = false;
  alertMsg!: string;
  alert: boolean = false;
  showDishDetailsFlag = false;
  dishToShowDetails!: DietDishMONGO;
  inDay: DietReq[] =  [
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
  ]
  difference: DietReq[] =  [
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
    {proteins:0,carbohydrates:0,fat:0,kcal:0},
  ]
  allRequirements: DietRequirementsListItemMONGO[] = new Array();

  constructor(private route: ActivatedRoute,
              private dietService: DietService,
              private datePipe: DatePipe,
              private fb:FormBuilder,
              private dietRequirementsService: DietRequirementsService,
              private ngbDateParserFormatter: NgbDateParserFormatter,
              private toastrService: ToastrService,
              private dishService: DishService
              ){}

  convertToDateStruct(dateString: string): NgbDateStruct | null {
    const dateParts = dateString.split('.');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10); 
    const parsedDate = this.ngbDateParserFormatter.parse(`${year}-${month}-${day}`);
    return parsedDate ?? null;
  }
 
  get dietDays() : FormArray {
    return this.dietForm.get('dietDays') as FormArray;
  }

  get mealsTime() : FormArray {
    return this.dietForm.get('dietRequirements')!.get('dietRequirementsMealsTime') as FormArray;
  }

  get dietRequirements() : FormGroup {
    return this.dietForm.get('dietRequirements') as FormGroup;
  }

  addDietDay(dietDay: DietDayMONGO) {
    let newDietDay = this.fb.group({
      _id: dietDay._id ,
      dayName: dietDay.dayName,
      dayDate: dietDay.dayDate,
      dayDishes: this.fb.array([])
    });

    dietDay.dayDishes.forEach(dish => {
      if(dish != null){
        this.getDayDishes(newDietDay).push(this.newDayDish(dish))
      }else{
        this.getDayDishes(newDietDay).push(this.fb.control(undefined))
      } 
    });

    this.dietDays.push(newDietDay);
  }

  getDayDishes(fg: FormGroup) : FormArray {
    return fg.get('dayDishes') as FormArray;
  }

  newDayDish(newDayDish: DietDishMONGO) : FormGroup {
    return this.fb.group({
      _id: newDayDish._id,
      dietDishQuantity: newDayDish.dietDishQuantity,
      dietDishTime: newDayDish.dietDishTime,
      dishId: newDayDish.dishId,
      dishName: newDayDish.dishName,
      dishPortions: newDayDish.dishPortions,
      dietDishProteins: newDayDish.dietDishProteins,
      dietDishCarbohydrates: newDayDish.dietDishCarbohydrates,
      dietDishFat: newDayDish.dietDishFat,
      dietDishKcal: newDayDish.dietDishKcal, 
    })
  }

  dietRequirementsChanged(dietRequirementsName: string){
    const selectedDietRequirementsName = dietRequirementsName
    if(selectedDietRequirementsName != ""){
      const selectedDietRequirementsId = this.allRequirements.find(x => x.dietRequirementsName === selectedDietRequirementsName)!._id;
      this.dietRequirementsService.getDietRequirementsMONGO(selectedDietRequirementsId).subscribe(fetchedDietRequirements => {
        const newDietRequirements = this.fb.group({
          _id: fetchedDietRequirements._id,
          dietRequirementsName: fetchedDietRequirements.dietRequirementsName,
          dietRequirementsProteins: fetchedDietRequirements.dietRequirementsProteins,
          dietRequirementsCarbohydrates: fetchedDietRequirements.dietRequirementsCarbohydrates,
          dietRequirementsFat: fetchedDietRequirements.dietRequirementsFat,
          dietRequirementsKcal: fetchedDietRequirements.dietRequirementsKcal,
          dietRequirementsMealsTime: this.fb.array([])
        })
        const mealTimes = this.dietForm.get('dietRequirements')?.get('dietRequirementsMealsTime') as FormArray;
        mealTimes.clear({emitEvent: false});
        fetchedDietRequirements.dietRequirementsMealsTime.forEach(mealTime => {
          mealTimes.push(this.fb.control(mealTime), {emitEvent: false});
          
        })
        this.dietForm.get('dietRequirements')?.patchValue(newDietRequirements.value, { emitEvent: false });
        //ten kawałek kodu dodaje puste kontrolki do formularza po to, żeby adddish dodawało dania w konkretne sloty. 
        
        this.dietDays.controls.forEach((dietDay) => {   
          for(let i = 0; i< mealTimes.length; i++){
            const dayDishes = dietDay.get('dayDishes') as FormArray;
            if(dayDishes.length != mealTimes.length){
              dayDishes.push(this.fb.control(undefined))
            }
            
          }
        })

      })
    }
  }

  ngOnInit(){
    this.dietForm = this.fb.group({
      _id: [undefined],
      dietName: [undefined, [Validators.required]],
      dietDescription: [undefined,[]],
      dietRequirements: this.fb.group({
        _id: [undefined],
        dietRequirementsName: [undefined, [Validators.required]],
        dietRequirementsProteins: [undefined, [Validators.required]],
        dietRequirementsCarbohydrates: [undefined, [Validators.required]],
        dietRequirementsFat: [undefined, [Validators.required]],
        dietRequirementsKcal: [undefined, [Validators.required]],
        dietRequirementsMealsTime: this.fb.array([]),
      }),
      dietDays: this.fb.array([]),
      dietInUse: [undefined]
    })

    this.dietRequirementsService.getDietRequirementsListMONGO().subscribe(
      (fetchedDietRequirements) => {
        this.allRequirements = fetchedDietRequirements;

        //*************************************************** */
        //*************************************************** */
        //niekoniecznie chcę to tutaj ale taki szybki fix tego że nie zawsze ładowały się dni bo nie było wszystkich req.
        //*************************************************** */
        this.dietRequirements.valueChanges.subscribe((dietRequirements) => {
          this.dietRequirementsChanged(dietRequirements.dietRequirementsName);
        })
    
        this.route.params.subscribe(
          (params: Params) => {
            if(params['dietId']!=undefined){
              this.dietService.getDietMONGO(params['dietId']).subscribe(
                (dietFetched: DietMONGO) => {

                  this.dietForm.patchValue({
                    _id: dietFetched._id,
                    dietName: dietFetched.dietName,
                    dietDescription: dietFetched.dietDescription,
                    dietRequirements: dietFetched.dietRequirements,
                    dietInUse: dietFetched.dietInUse
                  })

                  dietFetched.dietDays.forEach((dietDay:DietDayMONGO) => {
                    this.addDietDay(dietDay)
                  })
                  this.updateDailyMacro();
                }
              )
            }else{
              this.dateSelected();
            }  
          }
        )
        //*************************************************** */
        //*************************************************** */
        //*************************************************** */
      }
    )    

   

    this.dietForm.statusChanges.subscribe(
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

  drop(event: CdkDragDrop<DietDishMONGO[]>) {
    const currentDay = +event.container.id.split("-")[0];
    const currentSlot = +event.container.id.split("-")[1];
    const previousDay = +event.previousContainer.id.split("-")[0];
    const previousSlot = +event.previousContainer.id.split("-")[1];
    const currentDayDishes = this.dietDays.at(currentDay).get('dayDishes') as FormArray;
    const previousDayDishes = this.dietDays.at(previousDay).get('dayDishes') as FormArray;
    const currentSlotDish = currentDayDishes.at(currentSlot).value

    if (event.previousContainer != event.container) {
      if(currentSlotDish === null || currentSlotDish === undefined){
        currentDayDishes.setControl(currentSlot, previousDayDishes.at(previousSlot))
        currentDayDishes.at(currentSlot).get('dietDishTime')?.setValue(this.mealsTime.at(currentSlot).value)
        previousDayDishes.setControl(previousSlot, this.fb.control(undefined))
        this.updateDailyMacro();
      }
    }
  }

  toggleDietInUse(){
    this.dietForm.patchValue({
      dietInUse: !this.dietForm.get('dietInUse')?.value
    })
    // console.log(this.dietForm.value);
    // console.log('Diet in use:', this.dietInUse);  // Log the value to the console for verification
  }

  dateSelected() {
    const formDays = this.dietForm.get('dietDays') as FormArray;
    formDays.clear({emitEvent: false});

    const daysInMonth = new Date(this.date.year, this.date.month, 0).getDate();
    const daysInSelectedMonth = daysInMonth - this.date.day + 1;

    var newMonthFlag = false;
    var newYearFlag = false;
  
    const days = Array(7).fill(null).map((_value, index) => {
      const day = index < daysInSelectedMonth ? this.date.day + index : index - daysInSelectedMonth + 1;
      var month: number = this.date.month;
      if(newMonthFlag==true){
        if(month < 12){
          month = this.date.month + 1;
        }else{
          month = 1;
        }       
      }else{
        month = this.date.month;
      }
      var year: number = this.date.year;
      if(newYearFlag==true){
        year = this.date.year + 1;
      }else{
        year = this.date.year;
      }

      const dayName = this.datePipe.transform(new Date(year, month - 1, day), 'EEEE');
      const data = `${day}.${month}.${year}`;

      if(day == daysInMonth){
        newMonthFlag = true;
        if(month == 12){
          newYearFlag = true;
        }
      } 

      return new DietDayMONGO(undefined,dayName!, data, []);
      
    });

    days.forEach(day => {
      this.addDietDay(day);
    })  
    
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
    console.log(this.dietForm.value)
    if(this.isFormValid == true){
      this.dietService.saveDietMONGO(this.dietForm.value)
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
    }
  }

  increaseDishPortion(dishData: [dishIndex: number, dayId: number]){
    const day = this.dietDays.at(dishData[1]) as FormGroup;
    const dishToModify = this.getDayDishes(day).at(dishData[0]) as FormGroup;
    const dishToModifyId = dishToModify.value.dishId
    const prevoiusDishQuantity = dishToModify.value.dietDishQuantity;
    const newDishQuantity = prevoiusDishQuantity+1;
    this.calculateDishMacroAfterQuantityChange(dishToModify,prevoiusDishQuantity,newDishQuantity);

    let unusedDish = this.unusedDishes.find(dish => dish.dish._id === dishToModifyId);
    if(unusedDish){
      unusedDish.usedPortions++
      if(unusedDish.usedPortions === unusedDish.dish.dishPortions){
        let unusedDishIndex = this.unusedDishes.findIndex(x => x.dish._id === unusedDish!.dish._id)
        this.unusedDishes.splice(unusedDishIndex,1);
      }
    }else{
      if(dishToModify.value.dietDishQuantity > dishToModify.value.dishPortions){
        this.dishService.getDishMONGO(dishToModifyId).subscribe(
          (dishFetched) => {
            if(this.unusedDishes.findIndex((unusedDish) => unusedDish.dish._id === dishFetched._id) === -1){
              if(dishFetched.dishPortions != 1){
                this.unusedDishes.push(new UnusedDish(dishFetched, 1));
              }
            }        
          }
        )

      }
    }
  }

  decreaseDishPortion(dishData: [dishIndex: number, dayId: number]){
    const day = this.dietDays.at(dishData[1]) as FormGroup;
    const dishToModify = this.getDayDishes(day).at(dishData[0]) as FormGroup;
    const dishToModifyId = dishToModify.value.dishId
    const prevoiusDishQuantity = dishToModify.value.dietDishQuantity;
    const newDishQuantity = prevoiusDishQuantity-1;
    if(newDishQuantity != 0){
      this.calculateDishMacroAfterQuantityChange(dishToModify,prevoiusDishQuantity,newDishQuantity);
      
      let unusedDish = this.unusedDishes.find(dish => dish.dish._id === dishToModifyId);
      if(unusedDish){
        unusedDish.usedPortions--
        if(unusedDish.usedPortions === 0){
          let unusedDishIndex = this.unusedDishes.findIndex(x => x.dish._id === unusedDish!.dish._id)
          this.unusedDishes.splice(unusedDishIndex,1);
        }
      }

    }
  }

  showDishDetails(dishToShowDetails: DietDishMONGO){
    this.dishToShowDetails = dishToShowDetails
    
    this.showDishDetailsFlag = true;
  }

  closeDishDetails(){
    const dishToShow = undefined;
    this.showDishDetailsFlag = false;
  }

  calculateDishMacroAfterQuantityChange(dishToModify: FormGroup, prevoiusDishQuantity: number, newDishQuantity: number){
    const precision = 1;
    let proteins = +dishToModify.value.dietDishProteins;
    let carbohydrates = +dishToModify.value.dietDishCarbohydrates;
    let fat = +dishToModify.value.dietDishFat;
    let kcal = +dishToModify.value.dietDishKcal;
    //przywrócenie macro do poziomu gdzie quantity = 1 do kalkulacji
    proteins = proteins * (1/prevoiusDishQuantity);
    carbohydrates = carbohydrates * (1/prevoiusDishQuantity);
    fat = fat * (1/prevoiusDishQuantity);
    kcal = kcal * (1/prevoiusDishQuantity);

    dishToModify.patchValue({  
      dietDishQuantity: newDishQuantity,
      dietDishProteins: Number((proteins * newDishQuantity).toFixed(precision).toString()),
      dietDishCarbohydrates: Number((carbohydrates * newDishQuantity).toFixed(precision).toString()),
      dietDishFat: Number((fat * newDishQuantity).toFixed(precision).toString()),
      dietDishKcal: Number((kcal * newDishQuantity).toFixed(precision).toString()),
    });
    this.updateDailyMacro();
  }

  deleteDish(dishData: [dishIndex: number, dayId: number]){
    const dishes = this.dietDays.at(dishData[1]).get('dayDishes') as FormArray;
    const dish = dishes.at(dishData[0]).value
    dishes.setControl(dishData[0],this.fb.control(undefined)); 
    this.updateDailyMacro();

    const unusedDishIndex = this.unusedDishes.findIndex((unusedDish) => unusedDish.dish._id === dish.dishId)
    if(unusedDishIndex === -1){
      if(dish.dishPortions != 1){
        this.unusedDishes.push(new UnusedDish(dish, 1));
      }
    }else{
      this.unusedDishes[unusedDishIndex].usedPortions--
    }  

    this.updateDailyMacro();

  }

  addDish(dayNumber: number, dishIndex: number, dish: DishMONGO){
    let mealTime = this.mealsTime.at(dishIndex).value

    let dietDish = this.fb.group({
      _id: undefined,
      dietDishQuantity: 1,
      dietDishTime: mealTime,
      dishId: dish._id,
      dishName: dish.dishName,
      dishPortions: dish.dishPortions,
      dietDishProteins: dish.dishProteinsPerPortion,
      dietDishCarbohydrates: dish.dishCarbohydratesPerPortion,
      dietDishFat: dish.dishFatPerPortion,
      dietDishKcal: dish.dishKcalPerPortion
    });

    let control = this.dietDays.at(dayNumber).get('dayDishes') as FormArray
    control.setControl(dishIndex,dietDish)
    this.updateDailyMacro();

  }

  updateDailyMacro(){
    var precision: number = 0;
    this.clearDailyMacro();
    this.dietDays.controls.forEach((dietDay, dayIndex) => {
      this.getDayDishes(dietDay as FormGroup).controls.forEach((dish) => {
        if(dish.value != undefined){
          this.inDay[dayIndex].proteins = Number((this.inDay[dayIndex].proteins + dish.value.dietDishProteins).toFixed(precision));
          this.inDay[dayIndex].carbohydrates = Number((this.inDay[dayIndex].carbohydrates + dish.value.dietDishCarbohydrates).toFixed(precision));
          this.inDay[dayIndex].fat = Number((this.inDay[dayIndex].fat + dish.value.dietDishFat).toFixed(precision));
          this.inDay[dayIndex].kcal = Number((this.inDay[dayIndex].kcal + dish.value.dietDishKcal).toFixed(precision));
        }   
      })
      this.difference[dayIndex].proteins = Number((this.dietRequirements.value.dietRequirementsProteins - this.inDay[dayIndex].proteins).toFixed(precision));
      this.difference[dayIndex].carbohydrates = Number((this.dietRequirements.value.dietRequirementsCarbohydrates - this.inDay[dayIndex].carbohydrates).toFixed(precision));
      this.difference[dayIndex].fat = Number((this.dietRequirements.value.dietRequirementsFat - this.inDay[dayIndex].fat).toFixed(precision));
      this.difference[dayIndex].kcal = Number((this.dietRequirements.value.dietRequirementsKcal - this.inDay[dayIndex].kcal).toFixed(precision));
    })
    this.requireSave = true;
  };
  
  clearDailyMacro(){
    this.inDay =  [
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
    ]
    this.difference =  [
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
      {proteins:0,carbohydrates:0,fat:0,kcal:0},
    ]
  }

}