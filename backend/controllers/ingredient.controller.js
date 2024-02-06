const IngredientDB = require('../models/ingredientDB.model');
const mongoose = require('mongoose');

exports.getAllIngredientNames = (req,res,next) => {
    IngredientDB.find({},{_id: 1, ingrName: 1})
    .then(result => {
        res.status(200).json({
            message: "Ingredients fetched successfully!",
            ingredients: result
        });
    });
};

exports.getIngredientById = (req,res,next) => {
    IngredientDB.findOne({_id: req.params.id})
    .then(result => {
        res.status(200).json({
            message: "Ingredient fetched successfully",
            ingredient: result
        });
    });
};

exports.getIngredientsWithStringInName = (req,res,next) => {
    IngredientDB.find({ ingrName: { $regex: req.params.str, $options: 'i' } }, {_id: 1, ingrName: 1})
    .then(result => {
        res.status(200).json({
            message: "Ingredient fetched successfully",
            ingredients: result
        });
    });
};

exports.saveIngredient = (req, res, next) => {
    const ingredientData = {
        _id: req.body._id,
        ingrName: req.body.ingrName,
        ingrProteins: req.body.ingrProteins,
        ingrCarbohydrates: req.body.ingrCarbohydrates,
        ingrFat: req.body.ingrFat,
        ingrKcal: req.body.ingrKcal,
        ingrPortions: req.body.ingrPortions || []
    };

    for (let i = 0; i < ingredientData.ingrPortions.length; i++) {
        if(ingredientData.ingrPortions[i]._id == null){
            ingredientData.ingrPortions[i]._id = new mongoose.Types.ObjectId();
        }
    }
    
    let existingIngredient;

    IngredientDB.findOne({ _id: ingredientData._id })
    .then(ingr => {
        existingIngredient = ingr;
        if (ingr) {
            ingr.ingrName = ingredientData.ingrName;
            ingr.ingrProteins = ingredientData.ingrProteins;
            ingr.ingrCarbohydrates = ingredientData.ingrCarbohydrates;
            ingr.ingrFat = ingredientData.ingrFat;
            ingr.ingrKcal = ingredientData.ingrKcal;
            ingr.ingrPortions = ingredientData.ingrPortions;
            return ingr.save();
        } else {
            return new IngredientDB(ingredientData).save();
        }
    })
    .then(savedIngredient => {
        res.status(201).json({
        message: "Ingredient " + (existingIngredient ? "updated" : "added") + " successfully",
        ingredientId: savedIngredient._id
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
        message: "Error adding/updating ingredient"
        });
    });
};

exports.deleteIngredientById = (req, res, next) => {
    IngredientDB.deleteOne({ _id: req.params.id })
    .then(result => {
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Ingredient deleted!" });
        } else {
            res.status(404).json({ error: "Ingredient not found!" });
        }
        })
    .catch(error => {
        res.status(500).json({ error: "Internal server error" });
    });
};