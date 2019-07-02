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

let numberOfIngredients = 2;
let createIngredient;
let deleteIngredient;
let autocompleteIngredientName;
let addActive;
let removeActive;
let closeAllLists;

let unitsPromise = $.getJSON('/api/units/names');
let ingredientsPromise = $.getJSON('/api/ingredients/names');

$.when(unitsPromise, ingredientsPromise).then((unitData, ingredientData) => {

    let ingredientsDataObjArr = ingredientData[2]["responseJSON"]

    let unitNames = unitData[2]["responseJSON"];
    let ingredientsNames = [];

    ingredientsDataObjArr.forEach(ingredientNameObj => {
        ingredientsNames.push(ingredientNameObj["ingredient_name"]);
    });

    // Units part
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

    // Ingredients part

    autocompleteIngredientName = function (inp, arr) {
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });


        addActive = function (x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }

        removeActive = function (x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        closeAllLists = function (elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    autocompleteIngredientName(document.getElementById("ingredientName1"), ingredientsNames);
    autocompleteIngredientName(document.getElementById("ingredientName2"), ingredientsNames);

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
        autocompleteIngredientName(document.getElementById(ingredientName.id), ingredientsNames);
    }

    deleteIngredient = function (rowId) {
        let ingredientToGetDeleted = document.getElementById(rowId);
        ingredientToGetDeleted.remove();
        numberOfIngredients--;
    }
});

// // Wypełnienie autocompleta ze składnikami
// $.getJSON('/api/ingredients/names').then((ingredientsNames) => {
//     console.log(ingredientsNames);
// });
// // Wypełnianie jednostek i dodawanie składników
// $.getJSON('/api/units/names').then((unitNames) => {

//     let ingredientUnitsOne = document.getElementById('ingredientUnit1');
//     let ingredientUnitsTwo = document.getElementById('ingredientUnit2');

//     unitNames.forEach(element => {
//         let unitOption = document.createElement('option');
//         unitOption.value = element["unit_name"];
//         unitOption.textContent = element["unit_name"];
//         ingredientUnitsOne.appendChild(unitOption);
//     });

//     unitNames.forEach(element => {
//         let unitOption = document.createElement('option');
//         unitOption.value = element["unit_name"];
//         unitOption.textContent = element["unit_name"];
//         ingredientUnitsTwo.appendChild(unitOption);
//     });

//     createIngredient = function () {
//         numberOfIngredients++;
//         let ingredientsField = document.getElementById('ingredients');

//         let ingredientRow = document.createElement('div');
//         ingredientRow.classList.add('row', 'mt-3');
//         ingredientRow.id = `ingredientRow${numberOfIngredients}`

//         let ingredientDeleteCol = document.createElement('div');
//         ingredientDeleteCol.classList.add('col-md-auto');

//         let ingredientDeleteButton = document.createElement('button');
//         ingredientDeleteButton.classList.add('btn', 'btn-danger');
//         ingredientDeleteButton.textContent = 'X';
//         ingredientDeleteButton.addEventListener("click", () => {
//             deleteIngredient(ingredientRow.id)
//         });

//         ingredientDeleteCol.appendChild(ingredientDeleteButton);

//         let ingredientNameCol = document.createElement('div');
//         ingredientNameCol.classList.add('col-6');

//         let ingredientName = document.createElement('input');
//         ingredientName.type = 'text';
//         ingredientName.name = 'ingredientName';
//         ingredientName.id = `ingredientName${numberOfIngredients}`
//         ingredientName.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
//         ingredientName.style.backgroundColor = '#eeeeee';
//         ingredientName.placeholder = 'Składnik';
//         ingredientName.minLength = '5';
//         ingredientName.maxLength = '50';

//         ingredientNameCol.appendChild(ingredientName);

//         let ingredientQuantityCol = document.createElement('div');
//         ingredientQuantityCol.classList.add('col');

//         let ingredientQuantity = document.createElement('input');
//         ingredientQuantity.type = 'text';
//         ingredientQuantity.name = 'ingredientQuantity';
//         ingredientQuantity.id = `ingredientQuantity${numberOfIngredients}`
//         ingredientQuantity.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
//         ingredientQuantity.style.backgroundColor = '#eeeeee';
//         ingredientQuantity.placeholder = 'Ilość';

//         ingredientQuantityCol.appendChild(ingredientQuantity);

//         let ingredientUnitCol = document.createElement('div');
//         ingredientUnitCol.classList.add('col');

//         let ingredientUnitSelect = document.createElement('select');
//         ingredientUnitSelect.name = 'ingredientUnit';
//         ingredientUnitSelect.id = `ingredientUnit${numberOfIngredients}`
//         ingredientUnitSelect.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
//         ingredientUnitSelect.style.backgroundColor = '#eeeeee';

//         let ingredientUnitOption = document.createElement('option');
//         ingredientUnitOption.disabled = true;
//         ingredientUnitOption.selected = true;
//         ingredientUnitOption.hidden = true;
//         ingredientUnitOption.value = '';
//         ingredientUnitOption.textContent = 'Jednostka';

//         ingredientUnitSelect.appendChild(ingredientUnitOption);

//         unitNames.forEach(element => {
//             let unitOption = document.createElement('option');
//             unitOption.value = element["unit_name"];
//             unitOption.textContent = element["unit_name"];
//             ingredientUnitSelect.appendChild(unitOption);
//         });

//         ingredientUnitCol.appendChild(ingredientUnitSelect);

//         ingredientRow.appendChild(ingredientDeleteCol);
//         ingredientRow.appendChild(ingredientNameCol);
//         ingredientRow.appendChild(ingredientQuantityCol);
//         ingredientRow.appendChild(ingredientUnitCol);

//         ingredientsField.appendChild(ingredientRow);
//     }

//     deleteIngredient = function(rowId) {
//         let ingredientToGetDeleted = document.getElementById(rowId);
//         ingredientToGetDeleted.remove();
//         numberOfIngredients--;
//     }
// });