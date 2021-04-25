import Axios from "axios";
import { key } from '../config';
export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
        try {
            const res = await Axios(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${this.query}`)
            this.recipes = res.data.results;
        } catch (error) {
            alert(error);
        }
    }
}

