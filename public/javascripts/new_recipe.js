$.getJSON("/api/categories/all", (data) => {
    let items = [];

    data.forEach(element => {
        items.push(element);
    });

    console.log(items);

    let selectCategories  = document.getElementById('categorySelect1');
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });

     selectCategories  = document.getElementById('categorySelect2');
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });

     selectCategories  = document.getElementById('categorySelect3');
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });

     selectCategories  = document.getElementById('categorySelect4');
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });

     selectCategories  = document.getElementById('categorySelect5');
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });

     selectCategories  = document.getElementById('categorySelect6');
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['category_name'];
        option.textContent = item['category_name'];
        selectCategories.appendChild(option)
    });
});


$.getJSON("/units/api/names", (data) => {
    let items = [];

    data.forEach(element => {
        items.push(element);
    });

    console.log(items);

    let selectUnits  = document.getElementById('unitSelect1');
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['unit_name'];
        option.textContent = item['unit_name'];
        selectUnits.appendChild(option)
    });

    selectUnits  = document.getElementById('unitSelect2');
    items.forEach(item =>{
        let option = document.createElement('option');
        option.value = item['unit_name'];
        option.textContent = item['unit_name'];
        selectUnits.appendChild(option)
    });

});