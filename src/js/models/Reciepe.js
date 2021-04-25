import axios from "axios";
import { key } from "../config";

export default class Reciepe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}`
      );
      this.title = res.data.title;
      this.publisher = res.data.sourceName;
      this.img = res.data.image;
      this.url = res.data.sourceUrl;
      this.ingredients = res.data.extendedIngredients;
    } catch (error) {
      alert("Something went wrong");
    }
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServing() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitsLong = [
      "tablespoon",
      "tablespoons",
      "ounce",
      "ounces",
      "teaspoon",
      "teaspoons",
      "cups",
      "pounds",
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const units = [...unitsShort, "kg", "g"];
    const newIngredients = this.ingredients.map((el) => {
      // Uniform Units
      let ingredient = el.name.toLowerCase();
      unitsLong.forEach((unit, i) => {
        if (ingredient.includes(unitsLong[i])) {
          ingredient = ingredient.replace(unit, unitsShort[i]);
        }
      });

      // Remove Parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // Pares ingredients into count unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit but there is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // There is no unit and no number
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }
      return objIng;
    });

    this.ingredients = newIngredients;
  }
  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach((ing) => {
      ing.count = ing.count * (newServings / this.servings);
    });
    this.servings = newServings;
  }
}
