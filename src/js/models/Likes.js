export default class Likes {
    constructor(){
        this.Likes = [];
    }

    addLike(id, title, publisher, image){
        const like = {
            id,
            title,
            publisher,
            image
        }
        this.Likes.push(like);

        // Persistent Data localStorage
        this.persistData();
        return like;
    }

    deleteLike(id){
        const index = this.Likes.findIndex(el => el.id === id);
        this.Likes.splice(index, 1);

        // Persistent Data localStorage

    }
    isLiked(id){
        return this.Likes.findIndex(el => el.id === id) !== -1;
    }
    getNumLikes(){
        return this.Likes.length;
    }

    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.Likes));
    }
    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage) this.Likes = storage;
    }
}