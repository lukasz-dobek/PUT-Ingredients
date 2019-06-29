$.getJSON("/categories/api/all", (data) => {
    let items = [];

    data.forEach(element => {
        items.push(element);
    });

    console.log(items);

    let selectCategories  = document.getElementById('categorySelect1');
    console.log(selectCategories);
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });

     selectCategories  = document.getElementById('categorySelect2');
    console.log(selectCategories);
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });

     selectCategories  = document.getElementById('categorySelect3');
    console.log(selectCategories);
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });

     selectCategories  = document.getElementById('categorySelect4');
    console.log(selectCategories);
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });

     selectCategories  = document.getElementById('categorySelect5');
    console.log(selectCategories);
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });

     selectCategories  = document.getElementById('categorySelect6');
    console.log(selectCategories);
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });
});