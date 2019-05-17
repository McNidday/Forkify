import { elements } from './base';
import { limitReciepeTitle } from './searchView';

export const toggleLikeBtn = isLiked => {
    // img/icons.svg#icon-heart-outlined
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};


export const toggleLikeMenu = numLikes => {
    elements.likeMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderTheLike = like => {
    const markup = `
    <li>
    <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
            <img src="${like.image}" alt="${limitReciepeTitle(like.title)}">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${like.title}</h4>
            <p class="likes__author">${like.publisher}</p>
        </div>
    </a>
</li>
    `;
    elements.likesList.insertAdjacentHTML('afterbegin', markup);
}

export const deleteTheLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(el) el.parentElement.removeChild(el);
}