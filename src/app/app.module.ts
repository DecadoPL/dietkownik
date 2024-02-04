import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DishService } from './services/dish.service';
import { HomeComponent } from './components/home/home.component';
import { IngredientDetailsComponent } from './components/ingredient/ingredient-details/ingredient-details.component';
import { IngredientListComponent } from './components/ingredient/ingredient-list/ingredient-list.component';
import { IngredientListItemComponent } from './components/ingredient/ingredient-list-item/ingredient-list-item.component';
import { DietListComponent } from './components/diet/diet-list/diet-list.component';
import { DietListItemComponent } from './components/diet/diet-list-item/diet-list-item.component';
import { DietDishCardComponent } from './components/diet/diet-dish-card/diet-dish-card.component';
import { DishDetailsComponent } from './components/dish/dish-details/dish-details.component';
import { DishListComponent } from './components/dish/dish-list/dish-list.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { IngredientService } from './services/ingredient.service';
import { DishListItemComponent } from './components/dish/dish-list-item/dish-list-item.component';
import { DietService } from './services/diet.service';
import { DietDetailsComponent } from './components/diet/diet-details/diet-details.component';
import { DietDishDetailsComponent } from './components/diet/diet-dish-details/diet-dish-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert/alert.component';
import { CanDeactivateGuardService } from './services/can-deactivate-guard.service';
import { NgbAlertModule, NgbCollapseModule, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, JsonPipe } from '@angular/common';
import { SharedManagementComponent } from './components/shared-management/shared-management.component';
import { DietRequirementsListComponent } from './components/dietRequirements/diet-requirements-list/diet-requirements-list.component';
import { DietRequirementsListItemComponent } from './components/dietRequirements/diet-requirements-list-item/diet-requirements-list-item.component';
import { DietRequirementsService } from './services/dietRequirements.service';
import { DietRequirementsDetailsComponent } from './components/dietRequirements/diet-requirements-details/diet-requirements-details.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DietDishesTrayComponent } from './components/diet/diet-dishes-tray/diet-dishes-tray.component';
import { DietDishesTrayCardComponent } from './components/diet/diet-dishes-tray-card/diet-dishes-tray-card.component';
import { ShoppingListService } from './services/shoppingList.service';
import { ShoppingListDetailsComponent } from './components/shopping-list/shopping-list-details/shopping-list-details.component';
import { ShoppingListListComponent } from './components/shopping-list/shopping-list-list/shopping-list-list.component';
import { ShoppingListListItemComponent } from './components/shopping-list/shopping-list-list-item/shopping-list-list-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DeleteAlertComponent } from './components/delete-alert/delete-alert.component';
import { PortionNameService } from './services/portionName.service';

@NgModule({
  declarations: [
    AppComponent,
    DietDishCardComponent,
    DishDetailsComponent,
    DishListComponent,
    HomeComponent,
    DietDetailsComponent,
    IngredientDetailsComponent,
    IngredientListComponent,
    IngredientListItemComponent,
    DietListComponent,
    DietListItemComponent,
    SideBarComponent,
    DishListItemComponent,
    DietDishDetailsComponent,
    AlertComponent,
    SharedManagementComponent,
    DietRequirementsDetailsComponent,
    DietRequirementsListComponent,
    DietRequirementsListItemComponent,
    DietDishesTrayComponent,
    DietDishesTrayCardComponent,
    ShoppingListDetailsComponent,
    ShoppingListListComponent,
    ShoppingListListItemComponent,
    DeleteAlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    DragDropModule, 
    HttpClientModule,
    NgbDatepickerModule, 
    NgbAlertModule, 
    JsonPipe,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000, // 5 seconds
      closeButton: true,
      progressBar: true,
    }),
  ],
  providers: [
    DishService,
    IngredientService, 
    DietService, 
    CanDeactivateGuardService,
    PortionNameService,
    DatePipe,
    DietRequirementsService,
    ShoppingListService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
