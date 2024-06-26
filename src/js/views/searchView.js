import {elements} from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = "";
};
export const clearResults = () => {
    elements.searchrResList.innerHTML = "";
    elements.searchResPages.innerHTML = "";
};
export const highlightSelected = (id) => {
    const resArr = Array.from(document.querySelectorAll(".results__link"));
    resArr.forEach((el) => {
        el.classList.remove("results__link--active");
    });
    document
        .querySelector(`.results__link[href="#${id}"]`)
        .classList.add("results__link--active");
};

export const limitReciepeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(" ").reduce((acc, curr) => {
            if (acc + curr.length <= limit) {
                newTitle.push(curr);
            }
            return acc + curr.length;
        }, 0);

        // Return the result
        return `${newTitle.join(" ")}...`;
    }
    return title;
};

const renderRecipe = (recipe) => {
    const markup = `
                <li>
                    <a class="results__link" href="#${recipe.id}">
                        <figure class="results__fig">
                            <img src="${recipe.image}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitReciepeTitle(
        recipe.title
    )}</h4>
                            <p class="results__author">Spoonacular</p>
                        </div>
                    </a>
                </li>
    `;
    elements.searchrResList.insertAdjacentHTML("beforeend", markup);
};

const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${
    type === "prev" ? page - 1 : page + 1
}>
    <svg class="search__icon">
        <use href="img/load.svg#icon-triangle-${
    type === "prev" ? "left" : "right"
}"></use>
    </svg>
    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
</button>
`;

const renderButtons = (page, numRes, resPerPage) => {
    const pages = Math.ceil(numRes / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        // Only Button to go to the next page
        button = createButton(page, "next");
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, "prev")};
            ${createButton(page, "next")};
        `;
    } else if (page === pages && pages > 1) {
        // Only Button to go to previous page
        button = createButton(page, "prev");
    }

    if (button) elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
};
