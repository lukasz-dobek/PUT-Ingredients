function splitRecipeId(elementId) {
    return elementId.split('_')[1];
}

function colorHeartAsFavourite(element){
    element.classList = [];
    element.classList.add('fas', 'fa-heart');
    element.style = "color: red; font-size: 1.3vw; position: absolute; bottom:0.4vw; right:1vw;";
}

function uncolourHeart(element) {
    element.classList = [];
    element.classList.add('far', 'fa-heart');
    element.style = "font-size: 1.3vw; position: absolute; bottom:0.4vw; right:1vw;";
}
// moze dodawac w nieskonczonosc - trzeba to sprawdzic - chyba trigger! albo tu - albo i tu i tu
function addToFavourites(e, userId) {
    let heart = document.getElementById(e.target.id);
    let recipeId = splitRecipeId(heart.id);
    if (heart.classList.contains('far')) {
        colorHeartAsFavourite(heart);
        $.post("/api/favourites/", {
            userId: userId,
            recipeId: recipeId,
            addedToFavouritesDate: Date.now()
        });
    } else {
        $.ajax({
            url: '/api/favourites/',
            type: 'DELETE',
            data: {
                userId: userId,
                recipeId: recipeId
            }
        });
        uncolourHeart(heart);
    }

}

window.onload = () => {
    let favourites = document.querySelectorAll('[id^="favouritesButton_"]'); // just those elements!
    // let favourites = $('*[id^="favouritesButton_"]'); - something else

    const currentUserEmail = document.getElementById('userProfileDropdown').textContent.trim();
    let recipesOnPage = [];
    Object.values(favourites).forEach(favourite => {
        recipesOnPage.push(parseInt(splitRecipeId(favourite.id)));
    });
    $.getJSON(`/api/favourites/user_email/${currentUserEmail}`, (jsonData) => {
        let currentUserFavouriteRecipes = [];

        jsonData.forEach(element => {
            currentUserFavouriteRecipes.push(element["recipe_id"]);
        });
        console.log('Ulubione przepisy uzytkownika: ');
        console.log(currentUserFavouriteRecipes);
        console.log('Aktualne przepisy na stronie: ');
        console.log(recipesOnPage);
        let commonBetweenFavouritesAndOnPage = recipesOnPage.filter(value => currentUserFavouriteRecipes.includes(value));
        commonBetweenFavouritesAndOnPage.forEach(recipe => {
            let favouriteIcon = document.getElementById(`favouritesButton_${recipe}`);
            colorHeartAsFavourite(favouriteIcon);
        });
    });
}