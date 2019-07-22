$.ajaxSetup({
    async: false
});

let chosenShopList;
let numberOfIngredients = 0;
let numberofTypeDivs =0;
const email_address = document.getElementById('userProfileDropdown').textContent.trim();

function splitIngredientId(elementId) {
    return elementId.split('_')[1];
}

function ingredientsInShoppingList(name) {
    let shopList = document.getElementById(name);
    chosenShopList = shopList.id;
    shopList.style.backgroundColor = "green";
    console.log(shopList);
    console.log(chosenShopList);
    let parent = shopList.parentNode;
    let megaDiv = document.createElement("div");
    megaDiv.classList.add("collapse");
    megaDiv.id = "div_" + chosenShopList;
    parent.appendChild(megaDiv);
    let formField = document.createElement('form');
    formField.action = "#";
    formField.method = "POST";
    formField.classList.add("form-inline");
    formField.id = "ingredientsInShoppingList";
    megaDiv.appendChild(formField);
    let container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("text-center");
    container.id = 'container_'+chosenShopList;
    formField.appendChild(container);
    let header = document.createElement("h2");
    let pom = chosenShopList.split("_").join(" ");
    console.log(pom);
    header.textContent = "Wybrano: " + pom;
    container.appendChild(header);
    let recipeName = chosenShopList.split("_").join(" ");

   // $.getJSON(`/api/shoppingList/recipe/${recipeName}`, (data) => {
    $.ajax({
    url:`/api/shoppingList/recipe/${recipeName}`,
        dataType: 'json',
        async:false,
        success: function(data) {

            let items = [];
            data.forEach(element => {
                items.push(element);
            });
            console.log(items);
            let ingredientsTypes = [];
            items.forEach(element => {
                if (!ingredientsTypes.includes(element['name'])) {
                    ingredientsTypes.push(element['name']);
                }
            });
            console.log(ingredientsTypes);
            items.forEach(element => {
                numberOfIngredients = numberOfIngredients + 1;
                let typeName = element['name'];
                typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
                typeName= typeName.split(" ").join('_');
                let mainDiv = document.getElementById('container_'+chosenShopList);
                console.log(mainDiv);
                let ingredientTypeDivExists = mainDiv.querySelector('#'+typeName);
                console.log(ingredientTypeDivExists);
                if (ingredientTypeDivExists === null) {
                    let typeDiv = document.createElement("div");
                    typeDiv.style.width = '100%';
                    typeDiv.style.backgroundColor = '#eeeeee';
                    typeDiv.style.marginBottom = '5%';
                    typeDiv.id = typeName;
                    container.appendChild(typeDiv);
                    let typeHeader = document.createElement("h3");
                    typeHeader.align = 'left';
                    typeHeader.style.marginLeft = '2%';
                    typeHeader.style.paddingTop = '2%';
                    typeHeader.textContent = typeName.split('_').join(' ');
                    typeDiv.appendChild(typeHeader);
                    let line = document.createElement("hr");
                    line.style.backgroundColor = 'black';
                    line.style.width = '95%';
                    typeDiv.appendChild(line);
                    // let ingredientsDiv = document.createElement("div");
                    // ingredientsDiv.style.width = '100%';
                    // typeDiv.appendChild(ingredientsDiv);
                }
                let ingredient = element['ingredient_name'];
                ingredientTypeDivExists = mainDiv.querySelector('#'+typeName);
                console.log(ingredientTypeDivExists);
                let ingredientRow = document.createElement("div");
                ingredientRow.classList.add("row");
                ingredientRow.style.marginTop = '3%';
                ingredientRow.id = ingredient + '_' + element['ingredient_id']+'_'+chosenShopList;
                ingredientTypeDivExists.appendChild(ingredientRow);
                let buttonCol = document.createElement("div");
                buttonCol.classList.add("col");
                ingredientRow.appendChild(buttonCol);
                let deleteIngredientButton = document.createElement("button");
                deleteIngredientButton.classList.add("btn");
                deleteIngredientButton.classList.add("btn-danger");
                deleteIngredientButton.id = "deleteIngredientButton_" + numberOfIngredients;
                deleteIngredientButton.textContent = 'X';
                deleteIngredientButton.addEventListener('click', () => {
                    deleteFromShoppingList(event);
                });
                buttonCol.appendChild(deleteIngredientButton);
                let nameCol = document.createElement("div");
                nameCol.classList.add("col");
                ingredientRow.appendChild(nameCol);
                let nameOfIngredient = document.createElement("h6");
                nameOfIngredient.style.textAlign = 'left';
                nameOfIngredient.style.marginTop = '5%';
                nameOfIngredient.style.marginLeft = '10%';
                nameOfIngredient.textContent = ingredient;
                nameCol.appendChild(nameOfIngredient);
                let quantityCol = document.createElement("div");
                quantityCol.classList.add("col");
                ingredientRow.appendChild(quantityCol);
                let quantityInput = document.createElement("input");
                quantityInput.type = 'text';
                quantityInput.name = 'quantityInput';
                quantityInput.id = 'quantityForm';
                quantityInput.classList.add('form-control');
                quantityInput.style.backgroundColor = '#eeeeee';
                quantityInput.style.width = '80%';
                quantityInput.style.borderRadius = '0';
                quantityInput.value = element['amount'];
                quantityCol.appendChild(quantityInput);
                let unitCol = document.createElement("div");
                unitCol.classList.add("col");
                ingredientRow.appendChild(unitCol);
                let unitInput = document.createElement("input");
                unitInput.type = 'text';
                unitInput.name = 'unitInput';
                unitInput.id = 'unitForm';
                unitInput.classList.add('form-control');
                unitInput.style.backgroundColor = '#eeeeee';
                unitInput.style.width = '80%';
                unitInput.style.borderRadius = '0';
                unitInput.value = element['unit_name'];
                unitCol.appendChild(unitInput);
            });

            let buttonRow = document.createElement("div");
            buttonRow.classList.add("row");
            container.appendChild(buttonRow);
            let emailDiv = document.createElement("div");
            emailDiv.classList.add("col-auto");
            emailDiv.style.marginLeft = "5.4vw";
            buttonRow.appendChild(emailDiv);
            let emailButton = document.createElement("button");
            emailButton.type = "button";
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
            deleteButton.type = "button";
            deleteButton.classList.add("btn");
            deleteButton.classList.add("btn-success");
            deleteButton.classList.add("mt-4");
            deleteButton.style.color = "black";
            deleteButton.style.backgroundColor = "#27AE60";
            deleteButton.style.fontSize = "1.5vw";
            deleteButton.style.height = "2.7vw";
            deleteButton.style.width = "15vw";
            deleteButton.textContent = "USUŃ LISTĘ";
            deleteButton.id = 'deleteButton' + chosenShopList;
            deleteButton.addEventListener("click", () => {
                deleteShoppingList(event);
            });
            deleteDiv.appendChild(deleteButton);
        }
    });

}

function deleteShoppingList(e) {
    let clicked = document.getElementById(e.target.id);
    console.log(clicked);
    let shopListToDelete = clicked.parentNode.parentNode.parentNode.querySelector('h2')
    console.log(shopListToDelete);
    let string = shopListToDelete.textContent;
    let recipe = string.substr(string.indexOf(' ') + 1);

    $.ajax({
        url: '/api/shoppingList/shoppingList',
        type: 'DELETE',
        data: {
            email_address: email_address,
            recipe_name: recipe,
        }
    });
    location.reload();
}

function deleteFromShoppingList(e) {
    let clicked = document.getElementById(e.target.id);
    let parentId = clicked.parentNode.parentNode.id;
    let ingredientId = splitIngredientId(parentId);
    let rowToDelete = document.getElementById(parentId);
    let typeId = rowToDelete.parentNode.id;
    let typeDiv = rowToDelete.parentNode;
    console.log(typeDiv);
    let ingredientsDivs = false;
    rowToDelete.remove();
    typeDiv.childNodes.forEach(node => {
        if (node.tagName === 'DIV') {
            ingredientsDivs = false;
        } else {
            ingredientsDivs = true;
        }
    });
    if (ingredientsDivs) {
        typeDiv.remove();
    }
    //numberOfIngredients = numberOfIngredients - 1;
    // $.ajax({
    //     url: '/api/shoppingList/ingredient',
    //     type: 'DELETE',
    //     data: {
    //         ingredient_id: ingredientId,
    //     }
    // });
}

//$.getJSON("/api/users/shopping_list", (data) => {
$.ajax({
    url: '/api/users/shopping_list',
    dataType: 'json',
    async:false,
    success: function(data) {
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
        button.classList.add("btn-shoppingList", "toggle");
        button.setAttribute("data-toggle", "collapse");
        button.setAttribute("data-target", "#div_" + item['recipe_name'].split(" ").join("_"));
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", "div_" + item['recipe_name'].split(" ").join("_"));
        button.setAttribute("data-parent", "#allRecipesShoppingList");
        //button.style='width: 75%; margin-top: 1%; margin-bottom: 1%;';

        button.id = item['recipe_name'].split(" ").join("_");
        button.textContent = item['recipe_name'];
        listOfRecipes.appendChild(button);

        ingredientsInShoppingList(button.id);
    });
}
});


