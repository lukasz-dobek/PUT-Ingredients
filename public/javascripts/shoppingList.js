let chosenShopList;
// function splitRecipeId(elementId) {
//     return elementId.split('_')[1];
// }
function addToShopList(e, userId) {
    let shopList = document.getElementById(e.target.id);
    let recipeId = splitRecipeId(shopList.id);

    $.post("/api/shoppingList/", {
        userId: userId,
        recipeId: recipeId,
    });
}

function getIdOfList(e) {
    let shopList = document.getElementById(e.target.id);
    chosenShopList = shopList.id;
    shopList.style.backgroundColor = "green";
    console.log(shopList);
    console.log( chosenShopList);
    let patern = shopList.parentNode;
    let formField = document.createElement('form');
    formField.action = "/recipes/add_new_recipe";
    formField.method = "POST";
    formField.classList.add("form-inline");
    formField.id="ingredientsInShoppingList";
    $(formField).insertAfter(patern);
    let container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("text-center");
    formField.appendChild(container);
    let header = document.createElement("h1");
    header.textContent = "Wybrano: " + chosenShopList;
    container.appendChild(header);
    let buttonRow = document.createElement("div");
    buttonRow.classList.add("row");
    container.appendChild(buttonRow);
    let emailDiv = document.createElement("div");
    emailDiv.classList.add("col-auto");
    emailDiv.style.marginLeft = "5.4vw";
    buttonRow.appendChild(emailDiv);
    let emailButton = document.createElement("button");
    emailButton.type = "submit";
    emailButton.classList.add("btn");
    emailButton.classList.add("btn-success");
    emailButton.classList.add("mt-4");
    emailButton.style.color = "black";
    emailButton.style.backgroundColor = "#27AE60";
    emailButton.style.fontSize = "1.5vw";
    emailButton.style.height = "2.7vw";
    emailButton.style.width = "15vw";
    emailButton.textContent = "PRZEŚLIJ NA E-MAIL";
    emailDiv.appendChild(emailButton);
    let saveDiv = document.createElement("div");
    saveDiv.classList.add("col-auto");
    saveDiv.style.marginLeft = "5.4vw";
    buttonRow.appendChild(saveDiv);
    let saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.classList.add("btn");
    saveButton.classList.add("btn-success");
    saveButton.classList.add("mt-4");
    saveButton.style.color = "black";
    saveButton.style.backgroundColor = "#27AE60";
    saveButton.style.fontSize = "1.5vw";
    saveButton.style.height = "2.7vw";
    saveButton.style.width = "15vw";
    saveButton.textContent = "ZAPISZ ZMIANY";
    saveDiv.appendChild(saveButton);
    let deleteDiv = document.createElement("div");
    deleteDiv.classList.add("col-auto");
    deleteDiv.style.marginLeft = "5.4vw";
    buttonRow.appendChild(deleteDiv);
    let deleteButton = document.createElement("button");
    deleteButton.type = "submit";
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-success");
    deleteButton.classList.add("mt-4");
    deleteButton.style.color = "black";
    deleteButton.style.backgroundColor = "#27AE60";
    deleteButton.style.fontSize = "1.5vw";
    deleteButton.style.height = "2.7vw";
    deleteButton.style.width = "15vw";
    deleteButton.textContent = "USUŃ LISTĘ";
    deleteDiv.appendChild(deleteButton);
}

function deleteFromShoppingList(e,userId) {
    let shopList = document.getElementById(e.target.id);
    let recipeId = splitRecipeId(shopList.id);
    $.ajax({
        url: '/api/shoppingList/',
        type: 'DELETE',
        data: {
            userId: userId,
            recipeId: recipeId
        }
    });
}
$.getJSON("/api/users/shopping_list", (data) => {
    let items = [];

    data.forEach(element => {
        items.push(element);
    });

    console.log(items);

    let listOfRecipes = document.getElementById("allRecipesShoppingList");
    console.log(listOfRecipes);
        items.forEach(item => {
            let button = document.createElement('button');
            button.type = "button";
            button.classList.add("btn");
            button.classList.add("btn-secondary");
            button.classList.add("btn-shoppingList");
            button.addEventListener("click", () =>{
               getIdOfList(event);
            });
            //button.style='width: 75%; margin-top: 1%; margin-bottom: 1%;';
            button.id=item['recipe_name'];
            button.textContent=item['recipe_name'];
            listOfRecipes.appendChild(button);
        });

        let deleteButton = document.getElementById('deleteButton');
        deleteButton.addEventListener("click",()=>{
            deleteRow(this.parentNode.parentNode.id);
        });


        deleteRow = function (rowId) {
            let rowToDelete = document.getElementById(rowId);
            rowToDelete.remove();
        }


});


