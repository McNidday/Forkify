import Axios from "axios";
import {key} from "../config";

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await Axios(
                `https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${this.query}&number=100`
            );
            this.recipes = res.data.results;
        } catch (error) {
            alert(error);
        }
    }

    async getRandomResults() {
        try {
            const res = await Axios(
                `https://api.spoonacular.com/recipes/random?apiKey=${key}&number=100`
            );
            this.recipes = res.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}
