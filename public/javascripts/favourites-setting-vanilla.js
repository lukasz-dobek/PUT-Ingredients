import { postData, deleteData, splitElementId } from './common.js';

function colorHeartAsFavourite(element) {
    element.classList = [];
    element.classList.add('fas', 'fa-heart');
    element.style.color = "red";
}

function uncolourHeart(element) {
    element.classList = [];
    element.classList.add('far', 'fa-heart');
    element.style.color = "";
}

window.setFavourite = async function (e, userId) {
    let heart = document.getElementById(e.target.id);
    let recipeId = splitElementId(heart.id);
    if (heart.classList.contains('far')) {
        colorHeartAsFavourite(heart);
        const response = await postData("/api/favourites/", {
            userId: userId,
            recipeId: recipeId,
            addedToFavouritesDate: Date.now()
        });
    } else {
        const response = await deleteData("/api/favourites/", {
            userId: userId,
            recipeId: recipeId
        });
        uncolourHeart(heart);
    }
};

const recipesOnPage = [];
const currentUserEmail = document.getElementById('userProfileDropdown').textContent.trim();

(async function setCategoryPills() {
    const favourites = document.querySelectorAll('[id^="favouritesButton_"]');

    Object.values(favourites).forEach(async favourite => {
        const categoryBox = document.getElementById(`categoryBox_${splitElementId(favourite.id)}`);
        recipesOnPage.push(parseInt(splitElementId(favourite.id)));
        const request = await fetch(`/api/categories/recipe/${splitElementId(favourite.id)}`);
        const categories = await request.json()
        categories.forEach(category => {
            let pill = document.createElement('span');
            pill.classList.add('badge', 'badge-pill', 'badge-secondary');
            pill.textContent = category["category_name"];
            categoryBox.appendChild(pill);
        });
    });
})();

(async function determineFavourites() {
    const request = await fetch(`/api/favourites/user_email/${currentUserEmail}`);
    const favourites = await request.json();
    const currentUserFavouriteRecipes = [];
    favourites.forEach(element => {
        currentUserFavouriteRecipes.push(element["recipe_id"]);
    });
    let commonBetweenFavouritesAndOnPage = recipesOnPage.filter(value => currentUserFavouriteRecipes.includes(value));
    commonBetweenFavouritesAndOnPage.forEach(recipe => {
        let favouriteIcon = document.getElementById(`favouritesButton_${recipe}`);
        colorHeartAsFavourite(favouriteIcon);
    });
})();