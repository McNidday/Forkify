export const elements = {
  searchInput: document.querySelector(".search__field"),
  searchForm: document.querySelector(".search"),
  searchrResList: document.querySelector(".results__list"),
  searchRes: document.querySelector(".results"),
  searchResPages: document.querySelector(".results__pages"),
  reciepe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likeMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list"),
  shoppingList: document.querySelector(".shopping__list"),
};

export const elementStrings = {
  loader: "loader",
};

export const renderTheLoader = (parent) => {
  const loader = `<div class='loader'>
                        <svg>
                            <use href='img/load.svg#icon-cw'></use>
                        </svg>
                    </div> `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader);
  }
};

export const clearList = () => {
  elements.shoppingList.innerHTML = "";
};
