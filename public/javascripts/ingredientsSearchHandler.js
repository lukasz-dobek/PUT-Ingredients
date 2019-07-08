// Autocomplete:

let createIngredientCheckGroup;
let deleteIngredientCheckGroup;
let ifIngredientExists;
let addIngredientFromField;

$.getJSON('/api/ingredients/names', (ingredientData) => {

    let ingredientsNames = [];

    ingredientData.forEach(ingredientNameObj => {
        ingredientsNames.push(ingredientNameObj["ingredient_name"]);
    });

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

    autocompleteIngredientName(document.getElementById("ingredientName"), ingredientsNames);

    // Quick search:
    let ingredientsNumber = 16;
    let quickIngredientsSearch = ["Marchew",
        "Pomidor",
        "Jablko",
        "Wołowina",
        "Pieczarki",
        "Krewetki",
        "Łosoś",
        "Cukier",
        "Pierś z kurczaka",
        "Pieczywo",
        "Miod",
        "Twaróg",
        "Jajka",
        "Mleko",
        "Mąka pszenna",
        "Proszek do pieczenia"];

    let ingredientsInRow = 4;

    let quickIngredientsSearchBox = document.getElementById('quickIngredientsSearch');
    for (let i = 0; i < ingredientsInRow; i++) {
        let ingredientsRow = document.createElement('div');
        ingredientsRow.classList.add('row', 'mt-3');
        ingredientsRow.id = `ingredientsRow${i}`;

        for (let j = 0; j < ingredientsInRow; j++) {
            let ingredientCol = document.createElement('div');
            ingredientCol.classList.add('col');

            let ingredientFormCheck = document.createElement('div');
            ingredientFormCheck.classList.add('form-check');

            let ingredientCheckBox = document.createElement('input');
            ingredientCheckBox.classList.add('form-check-input');
            // ingredientCheckBox.id = `ingredientCheck${(i * 4) + j}`;
            ingredientCheckBox.id = `ingredientCheck_${quickIngredientsSearch[(i * 4) + j].replace(' ', '_')}`;
            ingredientCheckBox.type = "checkbox";
            ingredientCheckBox.value = quickIngredientsSearch[(i * 4) + j];
            ingredientCheckBox.onchange = () => {
                if (ingredientCheckBox.checked) {
                    let ingredientsContainer = document.getElementById('ingredientsContainer');
                    if (!ifIngredientExists(`ingredientCheck_${ingredientCheckBox.value}`.replace(' ', '_'))) {

                        let ingredientCheckGroup = createIngredientCheckGroup(ingredientCheckBox.value);

                        ingredientsContainer.appendChild(ingredientCheckGroup);
                    } else {
                        alert('Taki składnik został już dodany.');
                    }
                } else {
                    deleteIngredientCheckGroup(`ingredientGroup_${ingredientCheckBox.value}`);
                }

            }

            let ingredientCheckBoxLabel = document.createElement('label');
            ingredientCheckBoxLabel.classList.add('form-check-label');
            ingredientCheckBoxLabel.htmlFor = ingredientCheckBox.id;
            ingredientCheckBoxLabel.textContent = quickIngredientsSearch[(i * 4) + j];

            ingredientFormCheck.appendChild(ingredientCheckBox);
            ingredientFormCheck.appendChild(ingredientCheckBoxLabel);
            ingredientCol.appendChild(ingredientFormCheck);
            ingredientsRow.appendChild(ingredientCol);
        }
        quickIngredientsSearchBox.appendChild(ingredientsRow);
    }

    // Ingredients to be appended to container:

    createIngredientCheckGroup = function (ingredientName) {
        let ingredientCheckGroup = document.createElement('div');
        ingredientCheckGroup.classList.add('form-check', 'form-check-inline');
        ingredientCheckGroup.id = `ingredientGroup_${ingredientName}`;

        let ingredientCheckLabel = document.createElement('label');
        ingredientCheckLabel.textContent = ingredientName;
        ingredientCheckLabel.htmlFor = `ingredientCheck_${ingredientName}`.replace(' ', '_');
        ingredientCheckLabel.classList.add('form-check-label');

        let ingredientCheck = document.createElement('input');
        ingredientCheck.type = "checkbox";
        ingredientCheck.value = ingredientName;
        ingredientCheck.checked = true;
        ingredientCheck.id = `ingredientCheck_${ingredientName}`.replace(' ', '_');
        ingredientCheck.classList.add('form-check-input');
        ingredientCheck.name = 'ingredientCheck';
        ingredientCheck.onchange = () => {
            if (!(ingredientCheck.checked)) {
                deleteIngredientCheckGroup(ingredientCheckGroup.id);
            }
        }

        ingredientCheckGroup.appendChild(ingredientCheck);
        ingredientCheckGroup.appendChild(ingredientCheckLabel);
        return ingredientCheckGroup;
    }

    deleteIngredientCheckGroup = function (groupId) {
        let ingredientCheckGroupToBeDeleted = document.getElementById(groupId);
        ingredientCheckGroupToBeDeleted.remove();
    }

    ifIngredientExists = function (ingredientName) {
        let ingredientsContainer = document.getElementById('ingredientsContainer');
        for (let node of ingredientsContainer.childNodes) {
            if (node.childNodes[1].htmlFor === ingredientName) {
                return true;
            }
        }
        return false;
    }

    addIngredientFromField = function () {
        let ingredientsContainer = document.getElementById('ingredientsContainer');

        let ingredientInputField = document.getElementById('ingredientName');
        let ingredientName = ingredientInputField.value;

        if (ingredientsNames.includes(ingredientName)) {
            if (!ifIngredientExists(`ingredientCheck_${ingredientName}`.replace(' ', '_'))) {

                let ingredientCheckGroup = createIngredientCheckGroup(ingredientName);

                ingredientsContainer.appendChild(ingredientCheckGroup);
            } else {
                alert('Taki składnik został już dodany.');
            }
        } else {
            alert('Taki składnik nie występuje w bazie.');
        }

    }

});

