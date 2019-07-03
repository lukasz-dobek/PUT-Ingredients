function splitRecipeId(elementId) {
    return elementId.split('_')[1];
}
function addToShopList(e, userId) {
    let shopList = document.getElementById(e.target.id);
    let recipeId = splitRecipeId(shopList.id);

        $.post("/api/shoppingList/", {
            userId: userId,
            recipeId: recipeId,
        });
}