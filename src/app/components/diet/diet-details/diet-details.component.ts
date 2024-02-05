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
              private toastrService: ToastrService
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
  // dietRequirementsChanged($event: any){
  dietRequirementsChanged(dietRequirementsName: string){
    // const selectedDietRequirementsName = $event.target.value;
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
            dayDishes.push(this.fb.control(undefined))
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
      dietDays: this.fb.array([])
    })

    this.dietRequirementsService.getDietRequirementsListMONGO().subscribe(
      (fetchedDietRequirements) => {
        this.allRequirements = fetchedDietRequirements;
      }
    )    

    this.dietRequirements.valueChanges.subscribe((dietRequirements) => {
      this.dietRequirementsChanged(dietRequirements.dietRequirementsName);
    })

    this.route.params.subscribe(
      (params: Params) => {
        if(params['dietId']!=undefined){
          this.dietService.getDietMONGO(params['dietId']).subscribe(
            (dietFetched: DietMONGO) => {
              // console.log("dietFetched", dietFetched)
              this.dietForm.patchValue({
                _id: dietFetched._id,
                dietName: dietFetched.dietName,
                dietDescription: dietFetched.dietDescription,
                dietRequirements: dietFetched.dietRequirements
              })

              dietFetched.dietDays.forEach((dietDay:DietDayMONGO) => {
                this.addDietDay(dietDay)
              })

              // console.log("dietFetched this.dietForm.value", this.dietForm.value)
            }
          )
          // this.dietService.getDiet(+params['dietId']).subscribe(
          //   (data) => {
              
              //this.diet = data;   

              // this.days = this.convertToDateStruct(this.diet.days[0].date)!;
              // var hoursChangedFlag = false;

              // this.diet.days.forEach(
              //   (day, dayIndex) => {
              //     var temp_dayDishesArr: DietDish[] = new Array();
              //     day.dishes.forEach(
              //       (dish) => {
              //         var dishTotalPortions = dish.quantity.split("/")[1]
              //         if(+dishTotalPortions > 1){

              //           //jeżeli dania nie ma na liście unused to dodaj
              //            if(this.unusedDishesPortions.findIndex((unusedDish) => unusedDish.name == dish.name) == -1){
              //               this.unusedDishesPortions.push(new DietDish(0, +dishTotalPortions-1+"/"+dishTotalPortions,"00:00",dish.name,dish.macro,dish.micro,dish.dishId,dish.tags));
              //             //jeżeli jest to zdejmij z listy unused
              //             }else{
              //               var unusedDishIndex = this.unusedDishesPortions.findIndex((unusedDish) => unusedDish.name == dish.name);
              //               var unusedDishQuantity = +this.unusedDishesPortions[unusedDishIndex].quantity.split("/")[0]
              //               this.unusedDishesPortions[unusedDishIndex].quantity = (unusedDishQuantity-1)+"/"+dishTotalPortions;
              //               if(unusedDishQuantity==1){
              //                 this.unusedDishesPortions.splice(unusedDishIndex,1);
              //               }
              //             }
              //         }
              //         const hourIndex = this.diet.requirements.hours.findIndex((hour) => hour === dish.time)
              //         if(hourIndex != -1){// godzina znaleziona
              //           temp_dayDishesArr[hourIndex] = dish;
              //         }else{
              //           hoursChangedFlag = true;
              //           //jeżeli danie jest na liście unused
              //           var unusedDishIndex = this.unusedDishesPortions.findIndex((unusedDish) => unusedDish.name == dish.name);
              //           var unusedDishQuantity = +this.unusedDishesPortions[unusedDishIndex].quantity.split("/")[0]
                        
              //           if(unusedDishIndex != -1){//danie znalezione
              //             this.unusedDishesPortions[unusedDishIndex].quantity = (unusedDishQuantity+1)+"/"+dishTotalPortions;
              //           }else{
              //             this.unusedDishesPortions.push(dish);
              //           }

              //         }
              //       }
              //     )             
              //     this.diet.days[dayIndex].dishes = temp_dayDishesArr;
              //   }
              // )  

              // if(hoursChangedFlag){
              //   confirm("Hours has changed")
              // }
             
              // if(this.diet.requirements==null){
              //   if(confirm("Diet requirements has been deleted. Select new")) {
              //     this.diet.requirements= new DietRequirements()
              //   }
              // }

              // this.dietForm.patchValue({
              //   name: this.diet.name,
              //   description: this.diet.description,
              //   requirements: this.diet.requirements.name
              // })
              // this.updateDailyMacro();
              // if(this.route.snapshot.routeConfig?.path?.includes("copy")){
              //   this.requireSave = true;
              //   this.diet.id = 0;
              // }else{
              //   this.requireSave = false;
              // }
              
          //   }
          // );

        }else{
          // var days: DietDay[] = [
          //   new DietDay(),
          //   new DietDay(),
          //   new DietDay(),
          //   new DietDay(),
          //   new DietDay(),
          //   new DietDay(),
          //   new DietDay()
          // ]  
          // this.diet.days = days;
          // this.selectToday();
          this.dateSelected();
        }
        
      }
    )
    this.updateDailyMacro();

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

    if(this.isFormValid == true){
      // console.log("onSubmit dietForm.value", this.dietForm.value);
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

      //this.router.navigate(['dishes']);
    }
  }

  deleteDish(dishData: [dishIndex: number, dayId: number]){
    const dishes = this.dietDays.at(dishData[1]).get('dayDishes') as FormArray;
    dishes.setControl(dishData[0],this.fb.control(undefined)); 
    this.updateDailyMacro();
    // if(this.diet.days[dishData[1]].dishes[dishData[0]].quantity != "1/1"){
      // var tempDish = this.diet.days[dishData[1]].dishes[dishData[0]];
    //   tempDish.time="00:00"
    //   var dishTotalPortions = tempDish.quantity.split("/")[1];
    //   tempDish.quantity = "1/"+dishTotalPortions

    //   let unusedDishIndex = this.unusedDishesPortions.findIndex(x=>x.name == tempDish.name)

    //   if(unusedDishIndex != -1){//znaleziono
    //     var portions = this.unusedDishesPortions[unusedDishIndex].quantity.split("/")[0];
    //     this.unusedDishesPortions[unusedDishIndex].quantity = +portions+1+"/"+dishTotalPortions;
    //   }else{
    //     this.unusedDishesPortions.push(tempDish);
    //   }
         
    // }

    // this.renumberPortions(tempDish);
    // this.updateDailyMacro();
    // this.requireSave = true;
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

  // renumberPortions(dish: DietDish){
    // var dishTotalPortions = dish.quantity.split("/")[1];
    // var dishCurrentPortion = 1;
    // this.diet.days.forEach(
    //   (day)=>{
    //     var tempDishes = day.dishes.filter(dayDish => {
    //       if(dayDish && dayDish.dishId == dish.dishId){
    //         return true;
    //       }else{
    //         return false;
    //       }
    //     })
    //     tempDishes.forEach(
    //       (dish) => {
    //         dish.quantity = dishCurrentPortion+"/"+dishTotalPortions;
    //         dishCurrentPortion++;
    //         if(dishCurrentPortion > +dishTotalPortions) dishCurrentPortion = 1;
    //       }
    //     )
    //   }
    // )
  // }

  updateDailyMacro(){
    var precision: number = 1;
    this.clearDailyMacro();
    this.dietDays.controls.forEach((dietDay, dayIndex) => {
      this.getDayDishes(dietDay as FormGroup).controls.forEach((dish) => {
        if(dish.value != undefined){
          this.inDay[dayIndex].proteins = this.inDay[dayIndex].proteins + dish.value.dietDishProteins;
          this.inDay[dayIndex].carbohydrates = this.inDay[dayIndex].carbohydrates + dish.value.dietDishCarbohydrates;
          this.inDay[dayIndex].fat = this.inDay[dayIndex].fat + dish.value.dietDishFat;
          this.inDay[dayIndex].kcal = this.inDay[dayIndex].kcal + dish.value.dietDishKcal;
        }   
      })
      this.difference[dayIndex].proteins = this.dietRequirements.value.dietRequirementsProteins - this.inDay[dayIndex].proteins;
      this.difference[dayIndex].carbohydrates = this.dietRequirements.value.dietRequirementsCarbohydrates - this.inDay[dayIndex].carbohydrates;
      this.difference[dayIndex].fat = this.dietRequirements.value.dietRequirementsFat - this.inDay[dayIndex].fat;
      this.difference[dayIndex].kcal = this.dietRequirements.value.dietRequirementsKcal - this.inDay[dayIndex].kcal;
    })
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