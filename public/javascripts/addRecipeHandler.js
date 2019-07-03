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
    let allCategories =[];
    let i;
    for(i=0;i<oneSelect.length;i++){
        allCategories.push(oneSelect.options[i].value);
    }
    // console.log(allCategories);
    // console.log(allCategories.length);
    let values = [];
    for(i=0 ;i<selects.length;i++)
    {
        values.push($(selects[i]).children("option:selected").val());
    }
    console.log(values);
    console.log(values.length);
    for(i =0; i<values.length;i++){
        if($("[id^=category]").find('option[value="' + values[i] + '"]')){
            $("[id^=category]").find('option[value="' + values[i] + '"]').hide();
        }
    }
    for(i=0;i<allCategories.length;i++){
        if(values.includes(allCategories[i]) === false){
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
        ingredientName.placeholder = '*Składnik';
        ingredientName.minLength = '5';
        ingredientName.maxLength = '50';
        ingredientName.setAttribute('required','');

        ingredientNameCol.appendChild(ingredientName);

        let ingredientQuantityCol = document.createElement('div');
        ingredientQuantityCol.classList.add('col');

        let ingredientQuantity = document.createElement('input');
        ingredientQuantity.type = 'text';
        ingredientQuantity.name = 'ingredientQuantity';
        ingredientQuantity.id = `ingredientQuantity${numberOfIngredients}`
        ingredientQuantity.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
        ingredientQuantity.style.backgroundColor = '#eeeeee';
        ingredientQuantity.placeholder = '*Ilość';
        ingredientQuantity.setAttribute('required','');

        ingredientQuantityCol.appendChild(ingredientQuantity);

        let ingredientUnitCol = document.createElement('div');
        ingredientUnitCol.classList.add('col');

        let ingredientUnitSelect = document.createElement('select');
        ingredientUnitSelect.name = 'ingredientUnit';
        ingredientUnitSelect.id = `ingredientUnit${numberOfIngredients}`
        ingredientUnitSelect.classList.add('form-control', 'border-top-0', 'border-left-0', 'border-right-0', 'rounded-0');
        ingredientUnitSelect.style.backgroundColor = '#eeeeee';
        ingredientUnitSelect.setAttribute('required','');

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
    }

    deleteIngredient = function (rowId) {
        let ingredientToGetDeleted = document.getElementById(rowId);
        ingredientToGetDeleted.remove();
        numberOfIngredients--;
    }
});

// weryfikacja

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
    console.log(recipeNames);

    let checkRecipeName = function () {
        if (customRecipeName.value) {
            console.log(items);

            for (let i = 0; i < recipeNames.length; i++) {
                if (customRecipeName.value != recipeNames[i]) {
                    recipeNameTaken = false;
                } else {
                    recipeNameTaken = true;
                    break;
                }
            }
        }
        return recipeNameTaken;
    };

    // Validate the field
    let hasError = function (field) {

        // Don't validate submits, buttons, file and reset inputs, and disabled fields
        if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

        if (checkRecipeName()) {
            if (field.name === 'recipeName') return 'Podany przepis juz istnieje.';
        }

        if(field.type === 'number'){
            if(field.value <=0) return "Wartość nie może być zerowa, lub ujemna."
        }
        // Get validity
        let validity = field.validity;

        // If valid, return null
        if (validity.valid) return;

        if (validity.typeMismatch) {
            // Email
            if (field.type === 'number') return 'Wprowadzone dane muszą być liczbą.';
        }
        // If field is required and empty
        if (validity.valueMissing) {
            if (field.id === "categorySelect1") return 'Musi zostać wybrana co najmniej jedna kategoria.';
            if (field.name === 'check') return 'Musisz zaakceptować regulamin.';
            return 'To pole jest obowiązkowe.';
        }
        // If too short
        if (validity.tooShort) {
            if (field.name === 'recipename') return 'Nazwa przepisu musi składać się co najmniej 5 znaków.'
            if (field.name === 'ingredientName') return 'Nazwa składnika musi mieć co najmniej 3 znaki.'
        }

        // If too long
        if (validity.tooLong) {
            if (field.name === 'nickname') return 'Nazwa przepisu może się składać masymalnie z 35 znaków.'
            if (field.name === 'ingredientName') return 'Nazwa składnika może się składać maksymalnie z 50 znaków.'
        }
        // If all else fails, return a generic catchall error
        return 'Podana wartość jest błędna.';

    };


    // Show an error message
    let showError = function (field, error) {

        // Add error class to field
        field.classList.add('error');
        // Get field id or name
        let id = field.id || field.name;
        if (!id) return;

        // Check if error message field already exists
        // If not, create one
        let message = field.form.querySelector('.error-message#error-for-' + id);
        if (!message) {
            message = document.createElement('div');
            message.className = 'error-message container';
            message.id = 'error-for-' + id;

            // If the field is a radio button or checkbox, insert error after the label
            let label;
            //if (field.type === 'radio' || field.type ==='checkbox') {
            label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;
            if (label) {
                if (field.id==='category1') {
                    let lastChild = document.getElementById('categoryRow');
                    lastChild.parentNode.insertBefore(message,lastChild.nextSibling);
                }
                else if(label.parentNode.parentNode.id==='ingredients' || label.parentNode.id === 'generalInfo'){
                    field.parentNode.appendChild(message);
                }
                else{
                    label.parentNode.insertBefore(message,label.nextSibling);
                }

            }
            //}

            // Otherwise, insert it after the field
            if (!label) {
                field.parentNode.insertBefore(message, field.nextSibling);
            }

        }

        // Add ARIA role to the field
        field.setAttribute('aria-describedby', 'error-for-' + id);

        // Update error message
        message.innerHTML = error;

        // Show error message
        message.style.display = 'block';
        message.style.visibility = 'visible';
        //   }
    };


    // Remove the error message
    let removeError = function (field) {

        // Remove error class to field
        field.classList.remove('error');

        // Remove ARIA role from the field
        field.removeAttribute('aria-describedby');
        // Get field id or name
        let id = field.id || field.name;
        if (!id) return;


        // Check if an error message is in the DOM
        let message = field.form.querySelector('.error-message#error-for-' + id + '');
        if (!message) return;

        // If so, hide it
        message.innerHTML = '';
        message.style.display = 'none';
        message.style.visibility = 'hidden';

    };

    document.addEventListener('blur', function (event) {

        let error = hasError(event.target);
        // If there's an error, show it
        if (error) {
            showError(event.target, error);
            return;
        }

        // Otherwise, remove any existing error message
        removeError(event.target);

    }, true);


    // Check all fields on submit
    document.addEventListener('submit', function (event) {

        // Only run on forms flagged for validation
        // Get all of the form elements
        let fields = event.target.elements;

        // Validate each field
        // Store the first field with an error to a letiable so we can bring it into focus leter
        let error, hasErrors;
        for (let i = 0; i < fields.length; i++) {
            error = hasError(fields[i]);
            if (error) {
                showError(fields[i], error);
                if (!hasErrors) {
                    hasErrors = fields[i];
                }
            }
        }

        // If there are errrors, don't submit form and focus on first element with error
        if (hasErrors) {
            event.preventDefault();
            hasErrors.focus();
        }

        // Otherwise, let the form submit normally
        // You could also bolt in an Ajax form submit process here

    }, false);

});


// $.getJSON("/api/ingredients/names", (data) => {
//     let customIngredientName = document.getElementsByName('ingredientName');
//     let ingredientExist = false;
//     let items = [];
//
//     data.forEach(element => {
//         items.push(element);
//     });
//
//     let ingredientNames = [];
//     items.forEach(item => {
//         ingredientNames.push(item['ingredient_name']);
//     });
//     console.log(customIngredientName);
//
//     let checkIngredientName = function () {
//         console.log(customIngredientName);
//         customIngredientName.forEach(item =>{
//
//         if (item.value) {
//             console.log(item.value);
//
//             for (let i = 0; i < ingredientNames.length; i++) {
//                 if (item.value != ingredientNames[i]) {
//                     ingredientExist = false;
//                 } else {
//                     ingredientExist = true;
//                     break;
//                 }
//             }
//         }
//         else {
//             ingredientExist=true;
//         }
//         });
//         return ingredientExist;
//     };
//
//     // Validate the field
//     let hasError = function (field) {
//
//         // Don't validate submits, buttons, file and reset inputs, and disabled fields
//         if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;
//
//         if (!checkIngredientName()) {
//             if (field.name === 'ingredientName') return 'Podany przepis juz istnieje.';
//         }
//
//         if(field.type === 'number'){
//             if(field.value <=0) return "Wartość nie może być zerowa, lub ujemna."
//         }
//         // Get validity
//         let validity = field.validity;
//
//         // If valid, return null
//         if (validity.valid) return;
//
//         if (validity.typeMismatch) {
//             // Email
//             if (field.type === 'number') return 'Wprowadzone dane muszą być liczbą.';
//         }
//         // If field is required and empty
//         if (validity.valueMissing) {
//             if (field.id === "categorySelect1") return 'Musi zostać wybrana co najmniej jedna kategoria.';
//             if (field.name === 'check') return 'Musisz zaakceptować regulamin.';
//             return 'To pole jest obowiązkowe.';
//         }
//         // If too short
//         if (validity.tooShort) {
//             if (field.name === 'recipename') return 'Nazwa przepisu musi składać się co najmniej 5 znaków.'
//             if (field.name === 'ingredientName') return 'Nazwa składnika musi mieć co najmniej 5 znaków.'
//         }
//
//         // If too long
//         if (validity.tooLong) {
//             if (field.name === 'nickname') return 'Nazwa przepisu może się składać masymalnie z 35 znaków.'
//             if (field.name === 'ingredientName') return 'Nazwa składnika może się składać maksymalnie z 50 znaków.'
//         }
//         // If all else fails, return a generic catchall error
//         return 'Podana wartość jest błędna.';
//
//     };
//
//
//     // Show an error message
//     let showError = function (field, error) {
//
//         // Add error class to field
//         field.classList.add('error');
//         // Get field id or name
//         let id = field.id || field.name;
//         if (!id) return;
//
//         // Check if error message field already exists
//         // If not, create one
//         let message = field.form.querySelector('.error-message#error-for-' + id);
//         if (!message) {
//             message = document.createElement('div');
//             message.className = 'error-message container';
//             message.id = 'error-for-' + id;
//
//             // If the field is a radio button or checkbox, insert error after the label
//             let label;
//             //if (field.type === 'radio' || field.type ==='checkbox') {
//             label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;
//             if (label) {
//                 if (field.id==='category1') {
//                     let lastChild = document.getElementById('categoryRow');
//                     lastChild.parentNode.insertBefore(message,lastChild.nextSibling);
//                 }
//                 else if(label.parentNode.parentNode.id==='ingredients' || label.parentNode.id === 'generalInfo'){
//                     field.parentNode.appendChild(message);
//                 }
//                 else{
//                     label.parentNode.insertBefore(message,label.nextSibling);
//                 }
//
//             }
//             //}
//             // Otherwise, insert it after the field
//             if (!label) {
//                 field.parentNode.insertBefore(message, field.nextSibling);
//             }
//
//         }
//
//         // Add ARIA role to the field
//         field.setAttribute('aria-describedby', 'error-for-' + id);
//
//         // Update error message
//         message.innerHTML = error;
//
//         // Show error message
//         message.style.display = 'block';
//         message.style.visibility = 'visible';
//         //   }
//     };
//
//
//     // Remove the error message
//     let removeError = function (field) {
//
//         // Remove error class to field
//         field.classList.remove('error');
//
//         // Remove ARIA role from the field
//         field.removeAttribute('aria-describedby');
//         // Get field id or name
//         let id = field.id || field.name;
//         if (!id) return;
//
//
//         // Check if an error message is in the DOM
//         let message = field.form.querySelector('.error-message#error-for-' + id + '');
//         if (!message) return;
//
//         // If so, hide it
//         message.innerHTML = '';
//         message.style.display = 'none';
//         message.style.visibility = 'hidden';
//
//     };
//
//     document.addEventListener('blur', function (event) {
//
//         let error = hasError(event.target);
//         // If there's an error, show it
//         if (error) {
//             showError(event.target, error);
//             return;
//         }
//
//         // Otherwise, remove any existing error message
//         removeError(event.target);
//
//     }, true);
//
//
//     // Check all fields on submit
//     document.addEventListener('submit', function (event) {
//
//         // Only run on forms flagged for validation
//         // Get all of the form elements
//         let fields = event.target.elements;
//
//         // Validate each field
//         // Store the first field with an error to a letiable so we can bring it into focus leter
//         let error, hasErrors;
//         for (let i = 0; i < fields.length; i++) {
//             error = hasError(fields[i]);
//             if (error) {
//                 showError(fields[i], error);
//                 if (!hasErrors) {
//                     hasErrors = fields[i];
//                 }
//             }
//         }
//
//         // If there are errrors, don't submit form and focus on first element with error
//         if (hasErrors) {
//             event.preventDefault();
//             hasErrors.focus();
//         }
//
//         // Otherwise, let the form submit normally
//         // You could also bolt in an Ajax form submit process here
//
//     }, false);
//
// });