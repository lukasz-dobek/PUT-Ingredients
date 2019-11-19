async function fetchIngredients() {
    const request = await fetch("/api/ingredients/names");
    const data = await request.json();
    return data;
}

async function getIngredientNames() {
    let ingredientsNames = [];
    let ingredientsData = await fetchIngredients();
    ingredientsData.forEach(ingredientNameObj => {
        ingredientsNames.push(ingredientNameObj["ingredient_name"]);
    });
    return ingredientsNames;
}

function isIngredientSelected(ingredientName) {
    let ingredientsContainer = document.getElementById('ingredientsContainer');
    for (let node of ingredientsContainer.childNodes) {
        if (node.childNodes[1].htmlFor === ingredientName) {
            return true;
        }
    }
    return false;
}

function createIngredientCheckGroup(ingredientName) {
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
    ingredientCheck.addEventListener("change", () => {
        if (!(ingredientCheck.checked)) {
            deleteIngredientCheckGroup(ingredientCheckGroup.id);
        }
    });

    ingredientCheckGroup.appendChild(ingredientCheck);
    ingredientCheckGroup.appendChild(ingredientCheckLabel);
    return ingredientCheckGroup;
}

function deleteIngredientCheckGroup(groupId) {
    let ingredientCheckGroupToBeDeleted = document.getElementById(groupId);
    ingredientCheckGroupToBeDeleted.remove();
}

async function autocompleteIngredientName(inp, arr) {
    let currentFocus;

    inp.addEventListener("input", async function (e) {
        let autocompleteDiv, ingredientDiv, val = this.value;
        // Close any already open lists of autocompleted values
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;

        autocompleteDiv = document.createElement("div");
        autocompleteDiv.setAttribute("id", this.id + "autocomplete-list");
        autocompleteDiv.setAttribute("class", "autocomplete-items");
        // this.parentNode = inp = document.getElementById("ingredientName")
        this.parentNode.appendChild(autocompleteDiv);

        for (let i = 0; i < arr.length; i++) {
            // Check if the item starts with the same letters as the text field value
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                ingredientDiv = document.createElement("DIV");
                ingredientDiv.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                ingredientDiv.innerHTML += arr[i].substr(val.length);
                ingredientDiv.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                ingredientDiv.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                autocompleteDiv.appendChild(ingredientDiv);
            }
        }
    });

    inp.addEventListener("keydown", async function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) { // down
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { // up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) { // enter
            e.preventDefault();
            if (currentFocus > -1) {
                // simulate a click on the "active" item:
                if (x) x[currentFocus].click();
            }
        }
    });

    addActive = async function (x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    removeActive = async function (x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    closeAllLists = async function (elmnt) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

(async function prepareSearchEngine() {
    const ingredientsNames = await getIngredientNames();
    autocompleteIngredientName(document.getElementById("ingredientName"), ingredientsNames);
})();

(function createQuickSearch() {
    let quickIngredientsSearch = [
        "Marchew",
        "Pomidor",
        "Jabłko",
        "Wołowina",
        "Pieczarki",
        "Krewetki",
        "Łosoś",
        "Cukier",
        "Pierś z kurczaka",
        "Pieczywo",
        "Miód",
        "Twaróg",
        "Jajka",
        "Mleko",
        "Mąka pszenna",
        "Proszek do pieczenia"
    ];

    let rows = 4, ingredientsInRow = 4;
    let quickIngredientsSearchBox = document.getElementById('quickIngredientsSearch');
    for (let i = 0; i < rows; i++) {
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
            ingredientCheckBox.id = `ingredientCheck_${quickIngredientsSearch[(i * 4) + j].replace(' ', '_')}`;
            ingredientCheckBox.type = "checkbox";
            ingredientCheckBox.value = quickIngredientsSearch[(i * 4) + j];
            ingredientCheckBox.addEventListener("change", () => {
                if (ingredientCheckBox.checked) {
                    let ingredientsContainer = document.getElementById('ingredientsContainer');
                    if (!isIngredientSelected(`ingredientCheck_${ingredientCheckBox.value}`.replace(' ', '_'))) {
                        let ingredientCheckGroup = createIngredientCheckGroup(ingredientCheckBox.value);
                        ingredientsContainer.appendChild(ingredientCheckGroup);
                    } else {
                        alert('Taki składnik został już dodany.');
                    }
                } else {
                    deleteIngredientCheckGroup(`ingredientGroup_${ingredientCheckBox.value}`);
                }
            });

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
})();

async function addIngredientFromField() {
    const ingredientsNames = await getIngredientNames();
    let ingredientsContainer = document.getElementById('ingredientsContainer');

    let ingredientInputField = document.getElementById('ingredientName');
    let ingredientName = ingredientInputField.value;

    if (ingredientsNames.includes(ingredientName)) {
        if (!isIngredientSelected(`ingredientCheck_${ingredientName}`.replace(' ', '_'))) {
            let ingredientCheckGroup = createIngredientCheckGroup(ingredientName);
            ingredientsContainer.appendChild(ingredientCheckGroup);
        } else {
            alert('Taki składnik został już dodany.');
        }
    } else {
        alert('Taki składnik nie występuje w bazie.');
    }
}