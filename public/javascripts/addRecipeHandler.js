// Wypełnianie pól z kategoriami
$.getJSON('/api/categories/all').then((categoriesJSON) => {
    let categoriesInputs = [
        document.getElementById('category1'),
        document.getElementById('category2'),
        document.getElementById('category3'),
        document.getElementById('category4'),
        document.getElementById('category5'),
        document.getElementById('category6')
    ];
    categoriesJSON.forEach(categoryRow => {
        categoriesInputs.forEach(categoryInput => {
            let categoryOption = document.createElement('option');
            categoryOption.value = categoryRow["category_name"];
            categoryOption.textContent = categoryRow["category_name"];
            categoryInput.appendChild(categoryOption);
        });
    });
});

// Wypełnienie autocompleta ze składnikami
$.getJSON('/api/ingredients/names').then((ingredientsNames) => {
    console.log(ingredientsNames);
});

let numberOfIngredients = 2;
let createIngredient;
let deleteIngredient;
// Wypełnianie jednostek i dodawanie składników
$.getJSON('/api/units/names').then((unitNames) => {

    let ingredientUnitsOne = document.getElementById('ingredientUnit1');
    let ingredientUnitsTwo = document.getElementById('ingredientUnit2');

    unitNames.forEach(element => {
        let unitOption = document.createElement('option');
        unitOption.value = element["unit_name"];
        unitOption.textContent = element["unit_name"];
        ingredientUnitsOne.appendChild(unitOption);
    });

    unitNames.forEach(element => {
        let unitOption = document.createElement('option');
        unitOption.value = element["unit_name"];
        unitOption.textContent = element["unit_name"];
        ingredientUnitsTwo.appendChild(unitOption);
    });

    createIngredient = function () {
        numberOfIngredients++;
        let ingredientsField = document.getElementById('ingredients');

        let ingredientRow = document.createElement('div');
        ingredientRow.classList.add('row', 'mt-3');
        ingredientRow.id = `ingredientRow${numberOfIngredients}`

        let ingredientDeleteCol = document.createElement('div');
        ingredientDeleteCol.classList.add('col-md-auto');

        let ingredientDeleteButton = document.createElement('button');
        ingredientDeleteButton.classList.add('btn', 'btn-danger');
        ingredientDeleteButton.textContent = 'X';
        ingredientDeleteButton.addEventListener("click", () => {
            deleteIngredient(ingredientRow.id)
        });

        ingredientDeleteCol.appendChild(ingredientDeleteButton);

        let ingredientNameCol = document.createElement('div');
        ingredientNameCol.classList.add('col-6');

        let ingredientName = document.createElement('input');
        ingredientName.type = 'text';
        ingredientName.name = 'ingredientName';
        ingredientName.id = `ingredientName${numberOfIngredients}`
        ingredientName.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
        ingredientName.style.backgroundColor = '#eeeeee';
        ingredientName.placeholder = 'Składnik';
        ingredientName.minLength = '5';
        ingredientName.maxLength = '50';

        ingredientNameCol.appendChild(ingredientName);

        let ingredientQuantityCol = document.createElement('div');
        ingredientQuantityCol.classList.add('col');

        let ingredientQuantity = document.createElement('input');
        ingredientQuantity.type = 'text';
        ingredientQuantity.name = 'ingredientQuantity';
        ingredientQuantity.id = `ingredientQuantity${numberOfIngredients}`
        ingredientQuantity.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
        ingredientQuantity.style.backgroundColor = '#eeeeee';
        ingredientQuantity.placeholder = 'Ilość';

        ingredientQuantityCol.appendChild(ingredientQuantity);

        let ingredientUnitCol = document.createElement('div');
        ingredientUnitCol.classList.add('col');

        let ingredientUnitSelect = document.createElement('select');
        ingredientUnitSelect.name = 'ingredientUnit';
        ingredientUnitSelect.id = `ingredientUnit${numberOfIngredients}`
        ingredientUnitSelect.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
        ingredientUnitSelect.style.backgroundColor = '#eeeeee';

        let ingredientUnitOption = document.createElement('option');
        ingredientUnitOption.disabled = true;
        ingredientUnitOption.selected = true;
        ingredientUnitOption.hidden = true;
        ingredientUnitOption.value = '';
        ingredientUnitOption.textContent = 'Jednostka';

        ingredientUnitSelect.appendChild(ingredientUnitOption);

        unitNames.forEach(element => {
            let unitOption = document.createElement('option');
            unitOption.value = element["unit_name"];
            unitOption.textContent = element["unit_name"];
            ingredientUnitSelect.appendChild(unitOption);
        });

        ingredientUnitCol.appendChild(ingredientUnitSelect);

        ingredientRow.appendChild(ingredientDeleteCol);
        ingredientRow.appendChild(ingredientNameCol);
        ingredientRow.appendChild(ingredientQuantityCol);
        ingredientRow.appendChild(ingredientUnitCol);

        ingredientsField.appendChild(ingredientRow);
    }

    deleteIngredient = function(rowId) {
        let ingredientToGetDeleted = document.getElementById(rowId);
        ingredientToGetDeleted.remove();
        numberOfIngredients--;
    }
});