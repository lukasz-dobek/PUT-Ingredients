$.getJSON("/api/categories/all", (data) => {
    let items = [];

    data.forEach(element => {
        items.push(element);
    });

    console.log(items);

    let dropdownCategories = document.getElementById('dropdownCategories');
    let dropdownUnorderedList = document.createElement('ul');
    dropdownUnorderedList.style = 'columns: 2;';
    dropdownUnorderedList.classList.add('dropdown-menu', 'checkbox-menu', 'allow-focus');
    items.forEach(item => {

        let categoriesCheckboxItem = document.createElement('li');
        let categoriesAnchorItem = document.createElement('label');
        let categoriesCheckbox = document.createElement('input');
        let categoriesName = document.createElement('span');
        categoriesCheckbox.type = 'checkbox';
        categoriesCheckbox.name = 'categories-checkboxes';
        categoriesCheckbox.classList.add('form-check-input');
        categoriesCheckbox.value = item['category_name'];
        categoriesAnchorItem.classList.add('form-check-label');
        categoriesName.textContent = item['category_name'];

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
});

$(".checkbox-menu").on("change", "input[type='checkbox']", function () {
    $(this).closest("li").toggleClass("active", this.checked);
});

$(document).on('click', '.allow-focus', function (e) {
    e.stopPropagation();
});