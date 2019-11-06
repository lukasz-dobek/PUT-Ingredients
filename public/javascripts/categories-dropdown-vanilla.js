(async () => {
    const categoriesPromise = await fetch("/api/categories/all");
    const categoriesJSON = await categoriesPromise.json();
    const categories = [];

    categoriesJSON.forEach(element => {
        categories.push(element["category_name"]);
    });

    let dropdownCategories = document.getElementById('dropdownCategories');
    let dropdownUnorderedList = document.createElement('ul');
    dropdownUnorderedList.style = 'columns: 2;';
    dropdownUnorderedList.classList.add('dropdown-menu', 'checkbox-menu', 'allow-focus');

    categories.forEach(category => {
        let categoriesCheckboxItem = document.createElement('li');
        let categoriesAnchorItem = document.createElement('label');
        let categoriesCheckbox = document.createElement('input');
        let categoriesName = document.createElement('span');
        categoriesCheckbox.type = 'checkbox';
        categoriesCheckbox.name = 'categories-checkboxes';
        categoriesCheckbox.classList.add('form-check-input');
        categoriesCheckbox.value = category;
        categoriesAnchorItem.classList.add('form-check-label');
        categoriesName.textContent = category;

        categoriesAnchorItem.appendChild(categoriesCheckbox);
        categoriesAnchorItem.appendChild(categoriesName);

        categoriesCheckboxItem.appendChild(categoriesAnchorItem);
        dropdownUnorderedList.appendChild(categoriesCheckboxItem);
    });

    let searchButton = document.createElement('button');
    searchButton.classList.add('btn', 'btn-success', 'float-right', 'm-2', 'w-100', 'rounded-0');
    searchButton.type = 'submit';
    searchButton.textContent = 'Szukaj';
    dropdownUnorderedList.appendChild(searchButton);
    dropdownCategories.appendChild(dropdownUnorderedList);
})();

document.addEventListener('click', element => {
    if (event.target.matches('.allow-focus, .allow-focus *')) {
        event.stopPropagation();
    }
}, true);