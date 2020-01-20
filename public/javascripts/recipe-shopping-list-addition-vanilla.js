import { splitElementId, postData, insertAfter } from './common.js';

window.addToShopList = addToShopList;

async function addToShopList(e, userId) {
    let shoppingListButton = document.getElementById(e.target.id);
    let recipeId = splitElementId(shoppingListButton.id);
    const data = await fetch(`/api/users/shopping_list/${recipeId}`);
    const isShoppingListPresent = await data.json();
    if (isShoppingListPresent >= 1) {
        e.target.classList.add('error');
        let errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.id = 'error-for-' + shoppingListButton.id;
        errorMessage.innerHTML = "Istnieje już lista zakupów stworzona dla tego przepisu.";
        errorMessage.style.display = 'block';
        errorMessage.style.visibility = 'visible';
        insertAfter(errorMessage, e.target.parentNode);
        e.target.setAttribute('aria-describedby', 'error-for-' + shoppingListButton.id);
    } else {
        await postData("/api/shoppingList/", { userId: userId, recipeId: recipeId });
        window.location.replace('/users/shopping_lists');
    }
}