import Search from "./models/Search";
import Reciepe from "./models/Reciepe";
import List from "./models/List";
import * as searchView from "./views/searchView";
import {
    elements,
    renderTheLoader,
    clearLoader,
    clearList,
} from "./views/base";
// import { renderReciepe, clearReciepe, updateServingsIngredients } from './views/reciepeView';
import * as reciepeView from "./views/reciepeView";
import * as listView from "./views/listView";
import Likes from "./models/Likes";
import * as likesView from "./views/likesView";

// The Global State of the app
// The Search object
// The current reciepe object
// Liked recipe

const state = {};
// Search Controller
const controlSearch = async () => {
    // Get the query fromm the view
    const query = searchView.getInput(); // TODO
    // New search object and add to state
    state.Search = new Search(query);
    // Prepare the UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderTheLoader(elements.searchRes);

    try {
        // Search for recipes
        query === "" || !query
            ? await state.Search.getRandomResults()
            : await state.Search.getResults();
        // Render results on UI
        clearLoader();
        searchView.renderResults(state.Search.recipes ? state.Search.recipes : []);
    } catch (error) {
        console.log(error)
        alert(`Something went wrong`);
        clearLoader();
    }
};

elements.searchResPages.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.Search.recipes, goToPage);
    }
});

// Reciepe Controller
const controlReciepe = async () => {
    if (!state.list) listView.renderNoItem();
    // Get id from url
    const id = window.location.hash.replace("#", "");

    if (id) {
        // Prepare ui for changes
        reciepeView.clearReciepe();
        renderTheLoader(elements.reciepe);

        //Highlight Selected search item
        if (state.Search) searchView.highlightSelected(id);

        try {
            // Create new reciepe
            state.reciepe = new Reciepe(id);
            // Get reciepe data
            await state.reciepe.getRecipe();
            state.reciepe.parseIngredients();
            // Calculate servings and time
            state.reciepe.calcServing();
            state.reciepe.calcTime();
            // Render the recipe
            clearLoader();
            reciepeView.renderReciepe(state.reciepe, state.likes.isLiked(id));
        } catch (error) {
            console.log(error);
            alert(`Something went wrong!`);
        }
    }
};

["hashchange", "load"].forEach((event) => {
    if (event === "load") {
        window.addEventListener(event, () => {
            console.log("Events loaded admmit!");
            controlSearch();
            controlReciepe();

            // Resore the likes
            state.likes = new Likes();

            state.likes.readStorage();

            likesView.toggleLikeMenu(state.likes.getNumLikes());

            state.likes.Likes.forEach((like) => {
                likesView.renderTheLike(like);
            });
        });
    } else {
        window.addEventListener(event, controlReciepe);
    }
});

// Handling recipe button click
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.reciepe.ingredients.forEach((el) => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Handle delete and update item event
elements.shopping.addEventListener("click", (e) => {
    const id = e.target.closest(".shopping__item").dataset.itemid;

    // Handle the delete button
    if (e.target.matches(".shopping__delete, .shopping__delete *")) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Show no list item if empty
        if (!state.list || state.list.items.length <= 0) listView.renderNoItem();

        // Handle the count update
    } else if (e.target.matches(".shopping__count-value")) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// Likes Controller
// Just for testing

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.reciepe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.reciepe.title,
            state.reciepe.publisher,
            state.reciepe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderTheLike(newLike);

        // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteTheLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore Liked recipes on page load
window.addEventListener("load", () => {
});

elements.reciepe.addEventListener("click", (e) => {
    if (e.target.matches(".btn-decrease, .btn-decrease *")) {
        // Decrease button is clicked
        if (state.reciepe.servings > 1) {
            state.reciepe.updateServings("dec");
            reciepeView.updateServingsIngredients(state.reciepe);
        }
    } else if (e.target.matches(".btn-increase, .btn-increase *")) {
        // Increase button is clicked
        state.reciepe.updateServings("inc");
        reciepeView.updateServingsIngredients(state.reciepe);
    } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
        clearList();
        controlList();
    } else if (e.target.matches(".recipe__love, .recipe__love *")) {
        // Call the likesController
        controlLike();
    }
});
