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
        ingredientCheckBox.name = 'ingredientCheck';
        ingredientCheckBox.id = `ingredientCheck${(i * 4) + j}`;
        ingredientCheckBox.type = "checkbox";
        ingredientCheckBox.value = quickIngredientsSearch[(i * 4) + j];

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
