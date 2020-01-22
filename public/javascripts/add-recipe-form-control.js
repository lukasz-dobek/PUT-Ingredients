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

$("[id^=category]").on('change', function () {
    let selects = document.querySelectorAll("[id^=category]");
    let oneSelect = document.getElementById("category1");
    let allCategories = [];
    let i;
    for (i = 0; i < oneSelect.length; i++) {
        allCategories.push(oneSelect.options[i].value);
    }
    let values = [];
    for (i = 0; i < selects.length; i++) {
        values.push($(selects[i]).children("option:selected").val());
    }
    for (i = 0; i < values.length; i++) {
        if ($("[id^=category]").find('option[value="' + values[i] + '"]')) {
            $("[id^=category]").find('option[value="' + values[i] + '"]').hide();
        }
    }
    for (i = 0; i < allCategories.length; i++) {
        if (values.includes(allCategories[i]) === false) {
            $("[id^=category]").find('option[value="' + allCategories[i] + '"]').show();
        }
    }

});

let numberOfIngredients = 2;
let createIngredient;
let deleteIngredient;
let autocompleteIngredientName;
let addActive;
let removeActive;
let closeAllLists;
let ingredientsNames;
let unitsPromise = $.getJSON('/api/units/names');
let ingredientsPromise = $.getJSON('/api/ingredients/names');

$.when(unitsPromise, ingredientsPromise).then((unitData, ingredientData) => {

    let ingredientsDataObjArr = ingredientData[2]["responseJSON"]

    let unitNames = unitData[2]["responseJSON"];
    ingredientsNames = [];

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
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            for (i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    b.addEventListener("click", function (e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) { //up
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });


        addActive = function (x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
        }

        removeActive = function (x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        closeAllLists = function (elmnt) {
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
        ingredientName.placeholder = '*Składnik';
        ingredientName.maxLength = '50';
        ingredientName.autocomplete = "off";
        ingredientName.setAttribute('required', '');

        ingredientNameCol.appendChild(ingredientName);

        let ingredientQuantityCol = document.createElement('div');
        ingredientQuantityCol.classList.add('col');

        let ingredientQuantity = document.createElement('input');
        ingredientQuantity.type = 'number';
        ingredientQuantity.name = 'ingredientQuantity';
        ingredientQuantity.id = `ingredientQuantity${numberOfIngredients}`
        ingredientQuantity.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
        ingredientQuantity.style.backgroundColor = '#eeeeee';
        ingredientQuantity.placeholder = '*Ilość';
        ingredientQuantity.step = '0.01';
        ingredientQuantity.setAttribute('required', '');

        ingredientQuantityCol.appendChild(ingredientQuantity);

        let ingredientUnitCol = document.createElement('div');
        ingredientUnitCol.classList.add('col');

        let ingredientUnitSelect = document.createElement('select');
        ingredientUnitSelect.name = 'ingredientUnit';
        ingredientUnitSelect.id = `ingredientUnit${numberOfIngredients}`
        ingredientUnitSelect.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
        ingredientUnitSelect.style.backgroundColor = '#eeeeee';
        ingredientUnitSelect.setAttribute('required', '');

        let ingredientUnitOption = document.createElement('option');
        ingredientUnitOption.disabled = true;
        ingredientUnitOption.selected = true;
        ingredientUnitOption.hidden = true;
        ingredientUnitOption.value = '';
        ingredientUnitOption.textContent = '*Jednostka';

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
    };

    deleteIngredient = function (rowId) {
        let ingredientToGetDeleted = document.getElementById(rowId);
        ingredientToGetDeleted.remove();
        numberOfIngredients--;
    }
});

function readURL(input) {
    let selectMainPhotoElement = document.getElementById('mainPhotoSelect');
    while (selectMainPhotoElement.firstChild) {
        selectMainPhotoElement.removeChild(selectMainPhotoElement.firstChild);
    }

    if (input.files) {
        $('#photoOne').attr('src', "");

        $('#photoTwo').attr('src', "");

        $('#photoThree').attr('src', "");

        $('#photoFour').attr('src', "");


        let counter = 0;

        for (let file of input.files) {
            let reader = new FileReader();
            if (counter == 0) {
                reader.onload = function (e) {

                    let photoOneOption = document.createElement('option');
                    photoOneOption.value = "0";
                    photoOneOption.textContent = "Zdjęcie pierwsze (lewo-góra)";

                    selectMainPhotoElement.appendChild(photoOneOption);
                    $('#photoOne').attr('src', e.target.result);
                }
            } else if (counter == 1) {
                reader.onload = function (e) {

                    let photoTwoOption = document.createElement('option');
                    photoTwoOption.value = "1";
                    photoTwoOption.textContent = "Zdjęcie drugie (prawo-góra)";

                    selectMainPhotoElement.appendChild(photoTwoOption);
                    $('#photoTwo').attr('src', e.target.result);
                }
            } else if (counter == 2) {
                reader.onload = function (e) {

                    let photoThreeOption = document.createElement('option');
                    photoThreeOption.value = "2";
                    photoThreeOption.textContent = "Zdjęcie trzecie (lewo-dół)";

                    selectMainPhotoElement.appendChild(photoThreeOption);
                    $('#photoThree').attr('src', e.target.result);
                }
            } else if (counter == 3) {
                reader.onload = function (e) {

                    let photoFourOption = document.createElement('option');
                    photoFourOption.value = "3";
                    photoFourOption.textContent = "Zdjęcie czwarte (prawo-dół)";

                    selectMainPhotoElement.appendChild(photoFourOption);
                    $('#photoFour').attr('src', e.target.result);
                }
            }
            counter++;

            reader.readAsDataURL(file);
        }

    }
}

$("#file-input").change(function () {
    readURL(this);
});

$.getJSON("/api/recipes/all", (data) => {
    let customRecipeName = document.getElementById('recipeName');
    let recipeNameTaken = false;
    let items = [];

    data.forEach(element => {
        items.push(element);
    });

    let recipeNames = [];
    items.forEach(item => {
        recipeNames.push(item['recipe_name']);
    });

    let checkRecipeName = function () {
        if (customRecipeName.value) {
            for (let i = 0; i < recipeNames.length; i++) {
                if (customRecipeName.value.toUpperCase() != recipeNames[i].toUpperCase()) {
                    recipeNameTaken = false;
                } else {
                    recipeNameTaken = true;
                    break;
                }
            }
        }
        return recipeNameTaken;
    };

    let hasError = function (field) {

        if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

        if (checkRecipeName()) {
            if (field.name === 'recipeName') return 'Podany przepis juz istnieje.';
        }

        if (field.type === 'number') {
            if (field.id.includes("ingredientQuantity") && field.value > 2000) return 'Wartość nie może być większa niż 2000';
            if (field.id === 'numberOfPortions' && field.value > 20) return 'Wartość nie może być większa niż 20';
            if (field.value <= 0) return "Wartość nie może być zerowa, lub ujemna."
        }
        let validity = field.validity;

        if (validity.valid) return;

        if (validity.typeMismatch) {
            if (field.type === 'number') return 'Wprowadzone dane muszą być liczbą.';
        }

        if (field.id === "mainPhotoSelect") {
            return "Musisz dodać co najmniej jedno zdjęcie i wybrać, które ma być główne";
        }
        if (validity.valueMissing) {
            if (field.id === "categorySelect1") return 'Musi zostać wybrana co najmniej jedna kategoria.';
            if (field.name === 'check') return 'Musisz zaakceptować regulamin.';
            return 'To pole jest obowiązkowe.';
        }
        if (validity.tooShort) {
            if (field.name === 'recipename') return 'Nazwa przepisu musi składać się co najmniej 5 znaków.'
            if (field.name === 'ingredientName') return 'Nazwa składnika musi mieć co najmniej 3 znaki.'
        }

        if (validity.tooLong) {
            if (field.name === 'nickname') return 'Nazwa przepisu może się składać masymalnie z 35 znaków.'
            if (field.name === 'ingredientName') return 'Nazwa składnika może się składać maksymalnie z 50 znaków.'
        }
        return 'Podana wartość jest błędna.';

    };


    let showError = function (field, error) {

        field.classList.add('error');
        let id = field.id || field.name;
        if (!id) return;

        let message = field.form.querySelector('.error-message#error-for-' + id);
        if (!message) {
            message = document.createElement('div');
            message.className = 'error-message container';
            message.id = 'error-for-' + id;

            let label;
            label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;
            if (label) {
                if (field.id === 'category1') {
                    let lastChild = document.getElementById('categoryRow');
                    lastChild.parentNode.insertBefore(message, lastChild.nextSibling);
                } else if (label.parentNode.parentNode.id === 'ingredients' || label.parentNode.id === 'generalInfo') {
                    field.parentNode.appendChild(message);
                } else if (id === 'mainPhotoSelect') {
                    $(message).insertAfter(field);
                } else {
                    label.parentNode.insertBefore(message, label.nextSibling);
                }

            }
            if (!label) {
                field.parentNode.insertBefore(message, field.nextSibling);
            }

        }

        field.setAttribute('aria-describedby', 'error-for-' + id);

        message.innerHTML = error;

        message.style.display = 'block';
        message.style.visibility = 'visible';
    };


    let removeError = function (field) {

        field.classList.remove('error');

        field.removeAttribute('aria-describedby');
        let id = field.id || field.name;
        if (!id) return;


        let message = field.form.querySelector('.error-message#error-for-' + id + '');
        if (!message) return;

        message.innerHTML = '';
        message.style.display = 'none';
        message.style.visibility = 'hidden';
    };

    document.addEventListener('blur', function (event) {
        let error = hasError(event.target);

        if (event.target.name === 'ingredientName') {
            let customIngredient = event.target.value;
            if (event.target.id === 'mainPhotoSelect') {
                error = "";
            }
        }
        if (error) {
            showError(event.target, error);
            return;
        }

        removeError(event.target);

    }, true);


    document.addEventListener('submit', function (event) {

        let fields = event.target.elements;

        let error, hasErrors;
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].id.includes("mainPhotoSelect")) {
                if (fields[i].value === "") {
                    error = "Musisz dodać co najmniej jedno zdjęcie i wybrać, które ma być główne";
                } else {
                    removeError(fields[i]);
                }
            }
            if (fields[i].id.includes("ingredientName")) {
                let customIngredient = fields[i].value;
                if (customIngredient) {
                    if (!ingredientsNames.includes(customIngredient)) {
                        error = "Taki składnik nie występuje w bazie."
                    } else {
                        let selectedIngredients = document.querySelectorAll("[id^=ingredientName]");
                        let usedIngredients = [];
                        selectedIngredients.forEach(item => {
                            usedIngredients.push(item['value']);
                        });
                        let num = event.target.id.replace(/^\D+/g, "");
                        let index = usedIngredients.indexOf(customIngredient);
                        usedIngredients.splice(index, 1);
                        for (let i = 1; i <= usedIngredients.length; i++) {
                            if (i != num) {
                                if (usedIngredients[num - 1] === customIngredient) {
                                    break;
                                } else if (usedIngredients.includes(customIngredient)) {
                                    error = "Taki składnik został już dodany";
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            else {
                error = hasError(fields[i]);
            }
            if (error) {
                showError(fields[i], error);
                if (!hasErrors) {
                    hasErrors = fields[i];
                }
            }
        }
        if (hasErrors) {
            event.preventDefault();
            hasErrors.focus();
        }
    }, false);

});