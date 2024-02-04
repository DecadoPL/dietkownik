import { DishMONGO } from "../dish/dishMONGO.model";

export class UnusedDish{
    dish: DishMONGO;
    usedPortions: number;
    constructor(
        dish: DishMONGO,
        usedPortions: number
    ){
        this.dish = dish;
        this.usedPortions = usedPortions;
    }
}