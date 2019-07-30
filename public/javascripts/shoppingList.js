$.ajaxSetup({
    async: false
});

let chosenShopList;
let numberOfIngredients = 0;
let deletedIngredients = {};
let updatedIngredients = {};

const email_address = document.getElementById('userProfileDropdown').textContent.trim();

function splitIngredientId(elementId) {
    return elementId.split('_')[1];
}

function ingredientsInShoppingList(name) {
    let shopList = document.getElementById(name);
    chosenShopList = shopList.id;
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
    container.id = 'container_' + chosenShopList;
    formField.appendChild(container);
    let header = document.createElement("h2");
    let pom = chosenShopList.split("_").join(" ");
    header.textContent = "Wybrano: " + pom;
    container.appendChild(header);
    let recipeName = chosenShopList.split("_").join(" ");

    $.ajax({
        url: `/api/shoppingList/recipe/${recipeName}`,
        dataType: 'json',
        async: false,
        success: function (data) {

            let items = [];
            data.forEach(element => {
                items.push(element);
            });
            let ingredientsTypes = [];
            items.forEach(element => {
                if (!ingredientsTypes.includes(element['name'])) {
                    ingredientsTypes.push(element['name']);
                }
            });
            items.forEach(element => {
                numberOfIngredients = numberOfIngredients + 1;
                let typeName = element['name'];
                typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
                typeName = typeName.split(" ").join('_');
                let mainDiv = document.getElementById('container_' + chosenShopList);
                let ingredientTypeDivExists = mainDiv.querySelector('#' + typeName);
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
                }
                let ingredient = element['ingredient_name'];
                ingredientTypeDivExists = mainDiv.querySelector('#' + typeName);
                let ingredientRow = document.createElement("div");
                ingredientRow.classList.add("row");
                ingredientRow.style.marginTop = '3%';
                ingredientRow.style.paddingBottom = '2%';
                ingredientRow.id = ingredient + '_' + element['ingredient_id'] + '_' + chosenShopList;
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
                let nameOfIngredient = document.createElement("input");
                nameOfIngredient.style.textAlign = 'left';
                nameOfIngredient.style.marginTop = '2%';
                nameOfIngredient.style.backgroundColor = '#eeeeee';
                nameOfIngredient.value = ingredient;
                nameOfIngredient.readOnly = 'readonly';
                nameOfIngredient.style.borderWidth = '0px';
                nameOfIngredient.style.border = 'none';
                nameOfIngredient.name = typeName + '[nazwa]';
                nameOfIngredient.id = 'nameForm';
                nameCol.appendChild(nameOfIngredient);
                let quantityCol = document.createElement("div");
                quantityCol.classList.add("col");
                ingredientRow.appendChild(quantityCol);
                let quantityInput = document.createElement("input");
                quantityInput.type = 'number';
                quantityInput.step = '0.25';
                quantityInput.name = typeName + '[ilosc]';
                quantityInput.id = 'quantityForm';
                quantityInput.classList.add('form-control');
                quantityInput.style.backgroundColor = '#eeeeee';
                quantityInput.style.width = '80%';
                quantityInput.style.borderRadius = '0';
                quantityInput.value = element['amount'];
                quantityInput.addEventListener('change', function (e) {
                    addToUpdated(e);
                });
                quantityCol.appendChild(quantityInput);
                let unitCol = document.createElement("div");
                unitCol.classList.add("col");
                ingredientRow.appendChild(unitCol);
                let ingredientUnitSelect = document.createElement('select');
                ingredientUnitSelect.name = typeName + '[jednostka]';
                ingredientUnitSelect.id = `ingredientUnit${numberOfIngredients}`
                ingredientUnitSelect.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
                ingredientUnitSelect.style.backgroundColor = '#eeeeee';
                ingredientUnitSelect.addEventListener('change', function (e) {
                    addToUpdated(e);
                });
                unitCol.appendChild(ingredientUnitSelect);
                let ingredientUnitOption = document.createElement('option');
                ingredientUnitOption.selected = true;
                ingredientUnitOption.hidden = true;
                ingredientUnitOption.value = element["id_unit"];
                ingredientUnitOption.textContent = element['unit_name'];
                ingredientUnitSelect.appendChild(ingredientUnitOption);
                $.getJSON('/api/units/namesandId', (jsonData) => {
                    jsonData.forEach(element => {
                        let unitOption = document.createElement('option');
                        unitOption.value = element["id_unit"];
                        unitOption.textContent = element["unit_name"];
                        ingredientUnitSelect.appendChild(unitOption);
                    });
                });
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
            emailButton.addEventListener("click", function (e) {
                sendMail(email_address,e)
            });
            emailDiv.appendChild(emailButton);
            let saveDiv = document.createElement("div");
            saveDiv.classList.add("col-auto");
            saveDiv.style.marginLeft = "5.4vw";
            buttonRow.appendChild(saveDiv);
            let saveButton = document.createElement("button");
            saveButton.type = "button";
            saveButton.classList.add("btn");
            saveButton.classList.add("btn-success");
            saveButton.classList.add("mt-4");
            saveButton.style.color = "black";
            saveButton.style.backgroundColor = "#27AE60";
            saveButton.style.fontSize = "1.5vw";
            saveButton.style.height = "2.7vw";
            saveButton.style.width = "15vw";
            saveButton.textContent = "ZAPISZ ZMIANY";
            saveButton.id = 'saveButton_' + chosenShopList;
            saveButton.addEventListener("click", (e) => {
                saveChanges(e);
            });
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

function sendMail(email,e) {
    let id = 'userMessage_'+email;
    let recipeHeader = e.target.parentNode.parentNode.parentNode.querySelector('h2');
    let string = recipeHeader.textContent;
    let recipe = string.substr(string.indexOf(' ') + 1);
    let message = "Oto Twoja lista zakupów dla przepisu: "+ recipe+'<br><br>\n';
    let mainContainer = e.target.parentNode.parentNode.parentNode;
    let typeDivs = mainContainer.querySelectorAll('#'+mainContainer.id+' > div[id]');
    for(let i=0; i<typeDivs.length;i++){
        let typeName = typeDivs[i].id.split("_").join(" ");
        let ingredinetRows = typeDivs[i].querySelectorAll('#'+typeDivs[i].id+' > div[id] > div > input,select');
        message=message+' '+typeName+':\n<br>';
        for (let j = 0;j<ingredinetRows.length;j++){
            if(ingredinetRows[j].id === 'nameForm'){
                message = message + '<p style="padding-left: 3%;">' + ingredinetRows[j].value;
            }
            else if(ingredinetRows[j].id === 'quantityForm'){
                message = message + ' ' + ingredinetRows[j].value;
            }
            else if (ingredinetRows[j].id.includes("ingredientUnit")){
                message = message + ' ' + ingredinetRows[j].options[ingredinetRows[j].selectedIndex].textContent+'</p>\n';
            }

            if(j===ingredinetRows.length-1){
                message=message+'\n';
            }
        }
        console.log(message);
    }
    $.post("/api/users/send_shopping_list", {
        message: message,
        send_to: email,
        recipe: recipe
    });
    alert('Wiadomość została wysłana!');
    eraseText(id);
}

function addToUpdated(e) {
    let clicked = e.target;
    let recipeDiv = clicked.parentNode.parentNode.parentNode.parentNode;
    let recipeHeader = recipeDiv.querySelector('h2');
    let string = recipeHeader.textContent;
    let recipe = string.substr(string.indexOf(' ') + 1);
    let quantity;
    let unit;
    let ingredientId;
    if (e.target.tagName.toUpperCase() === 'SELECT') {
        unit = clicked.value;
        let nameDiv = clicked.parentNode.parentNode;
        ingredientId = splitIngredientId(nameDiv.id);
        quantity = nameDiv.querySelector('.col > #quantityForm').value;
        if (quantity <= 0) {
            let errorField = nameDiv.querySelector('.col > #quantityForm');
            errorField.classList.add('error');
            // Get field id or name
            let id = errorField.id || errorField.name;
            if (!id) return;
            if (!e.target.parentNode.parentNode.querySelector('[id^=error]')) {
                let message = document.createElement('div');
                message.className = 'error-message';
                message.id = 'error-for-' + id;

                errorField.parentNode.insertBefore(message, errorField.nextSibling);

                errorField.setAttribute('aria-describedby', 'error-for-' + id);

                message.innerHTML = "Wartosć nie może być mniejsza, lub równa 0.";

                message.style.display = 'block';
                message.style.visibility = 'visible';
            }
        }
    }
    if (e.target.tagName.toUpperCase() === 'INPUT') {
        quantity = clicked.value;
        let nameDiv = clicked.parentNode.parentNode;
        ingredientId = splitIngredientId(nameDiv.id);
        unit = nameDiv.querySelector('.col > select').value;
    }
    let ingredientOnList = false;
    let counter = 0;
    for (let i = 0; i < updatedIngredients[recipe]['ingredients'].length; i++) {
        if (ingredientId == updatedIngredients[recipe]['ingredients'][i]['id']) {
            ingredientOnList = true;
            break;
        }
        counter++;
    }
    if (ingredientOnList === false) {
        updatedIngredients[recipe]["ingredients"].push({"id": ingredientId, "quantity": quantity, "unit": unit});
    } else {
        updatedIngredients[recipe]["ingredients"][counter]['quantity'] = quantity;
        updatedIngredients[recipe]["ingredients"][counter]['unit'] = unit;
    }
}

function saveChanges(e) {
    let clicked = e.target;
    let recipeHeader = clicked.parentNode.parentNode.parentNode.querySelector('h2');
    let string = recipeHeader.textContent;
    let recipe = string.substr(string.indexOf(' ') + 1);
    let emptyLists = false;
    if (Object.keys(deletedIngredients[recipe]['ingredients']).length === 0  && Object.keys(updatedIngredients[recipe]['ingredients']).length === 0) {
        emptyLists = true;

        clicked.classList.add('error');
        // Get field id or name
        let id = clicked.id || clicked.name;
        if (!id) return;
        if(!e.target.parentNode.parentNode.querySelector('[id^=error]')) {
            let message = document.createElement('div');
            message.className = 'error-message';
            message.id = 'error-for-' + id;

            clicked.parentNode.insertBefore(message, clicked.nextSibling);

            clicked.setAttribute('aria-describedby', 'error-for-' + id);

            message.innerHTML = "Brak zmian w liście zakupów";

            message.style.display = 'block';
            message.style.visibility = 'visible';
        }
    }
    if (Object.keys(deletedIngredients[recipe]['ingredients']).length != 0 && Object.keys(updatedIngredients[recipe]['ingredients']).length != 0) {
        for (let i = 0; i < updatedIngredients[recipe]['ingredients'].length; i++) {
            let id = updatedIngredients[recipe]['ingredients'][i]['id'];
            if (deletedIngredients[recipe]['ingredients'].includes(id)) {
                updatedIngredients[recipe]['ingredients'].splice(i, 1);
            }
        }
    }
    if (Object.keys(deletedIngredients[recipe]['ingredients']).length != 0 && !emptyLists) {
        for (let i = 0; i < deletedIngredients[recipe]['ingredients'].length; i++) {
            let ingredientId = deletedIngredients[recipe]['ingredients'][i];
            $.ajax({
                url: '/api/shoppingList/ingredient',
                type: 'DELETE',
                data: {
                    ingredient_id: ingredientId,
                    recipe_name: recipe,
                    email_address: email_address,
                }
            });
        }
    }
    if (Object.keys(updatedIngredients[recipe]['ingredients']).length != 0) {
        for (let i = 0; i < updatedIngredients[recipe]['ingredients'].length; i++) {
            let ingredientId = updatedIngredients[recipe]['ingredients'][i]['id'];
            let unit_id = updatedIngredients [recipe]['ingredients'][i]['unit'];
            let quantity = updatedIngredients [recipe]['ingredients'][i]['quantity'];
            $.ajax({
                url: '/api/shoppingList/update',
                type: 'POST',
                data: {
                    unit_id: unit_id,
                    quantity: quantity,
                    ingredient_id: ingredientId,
                    recipe_name: recipe,
                    email_address: email_address,
                }
            });
        }
    }
    if (Object.keys(deletedIngredients[recipe]['ingredients']).length != 0 || Object.keys(updatedIngredients[recipe]['ingredients']).length != 0) {
        let pom = confirm("Czy chcesz odświeżyć stronę, aby pokazać zmiany? UWAGA! Zmiany w innych przepisach nie zostaną zapisane.");
        if (pom) {
            location.reload();
        }
        else{
            delete deletedIngredients[recipe];
            delete updatedIngredients[recipe];
        }
    }

}


function deleteShoppingList(e) {
    let clicked = document.getElementById(e.target.id);
    let shopListToDelete = clicked.parentNode.parentNode.parentNode.querySelector('h2')
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
    let parentDiv = clicked.parentNode.parentNode;
    let recipeDiv = parentDiv.parentNode.parentNode;
    let recipeHeader = recipeDiv.querySelector('h2');
    let string = recipeHeader.textContent;
    let recipe = string.substr(string.indexOf(' ') + 1);
    let ingredientId = splitIngredientId(parentDiv.id);
    let rowToDelete = document.getElementById(parentDiv.id);
    let typeDiv = rowToDelete.parentNode;
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
    numberOfIngredients = numberOfIngredients - 1;
    deletedIngredients[recipe]["ingredients"].push(ingredientId);

}

//$.getJSON("/api/users/shopping_list", (data) => {
$.ajax({
    url: '/api/users/shopping_list',
    dataType: 'json',
    async: false,
    success: function (data) {
        let items = [];

        data.forEach(element => {
            items.push(element);
        });


        let listOfRecipes = document.getElementById("panel");
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
            updatedIngredients[item['recipe_name']] = {"ingredients": []};
            deletedIngredients[item['recipe_name']] = {"ingredients": []};
            ingredientsInShoppingList(button.id);
        });
    }
});

jQuery('#panel > button').click(function (e) {
    jQuery('.collapse').collapse('hide');
    let temp = document.querySelectorAll('#panel > button');
    temp.forEach(item => {
        item.style.backgroundColor = '';
    });
    e.target.style.backgroundColor = 'green';
});
