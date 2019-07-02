let ingredientsNumber = 16;
let quickIngredientsSearch = ['Makaron', 'Ser żółty', 'Pieczywo pszenne', 'Chleb tostowy',
    'Mleko', 'Pierś z kurczaka', 'Pomidor', 'Ogórek kiszony', 'Ziemniaki',
    'Ser topiony', 'Przecier pomidorowy', 'Cytryna', 'Musztarda',
    'Jajka', 'Masło', 'Ser twarogowy'];
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
        ingredientCheckBox.id = `ingredientCheck${(i*4)+j}`;
        ingredientCheckBox.type = "checkbox";
        ingredientCheckBox.value=quickIngredientsSearch[(i*4)+j];

        let ingredientCheckBoxLabel = document.createElement('label');
        ingredientCheckBoxLabel.classList.add('form-check-label');
        ingredientCheckBoxLabel.htmlFor = ingredientCheckBox.id;
        ingredientCheckBoxLabel.textContent = quickIngredientsSearch[(i*4)+j];

        ingredientFormCheck.appendChild(ingredientCheckBox);
        ingredientFormCheck.appendChild(ingredientCheckBoxLabel);
        ingredientCol.appendChild(ingredientFormCheck);
        ingredientsRow.appendChild(ingredientCol);
    }
    quickIngredientsSearchBox.appendChild(ingredientsRow);
}
