

// Historical way of displaying items
// window.onload = () => {
//     // showRecipeNames();
// }

// let main = document.getElementById("mainRecipesContent");

// $.getJSON("/recipes/api/all", function (data) {
//     let items = [];

//     data.forEach(element => {
//         items.push(element);
//     });

//     console.log(items);
//     console.log(data[0]);

//     let iterate = 0;
//     items.forEach(item => {
//         console.log(item["recipe_name"]);
//         let el = document.getElementById('item'+(iterate+1).toString());

//         let imageAnchor = document.createElement('a');
        
//         let image = document.createElement('img'); // <img class="card-img-top" src="">
//         image.classList.add('card-img-top');
//         image.src = item['photo'];

//         let cardBody = document.createElement('div');
//         cardBody.classList.add('card-body');
        
//         let cardText = document.createElement('p'); // <p class="card-text"></p>
//         cardText.classList.add('card-text');
//         cardText.textContent = item["recipe_name"]
        
//         cardBody.appendChild(cardText);

//         el.appendChild(image);
//         el.appendChild(cardBody);

//         iterate++;
//     })
// });

// $.getJSON("/categories/api/all", (data) => {
//     let items = [];

//     data.forEach(element => {
//         items.push(element);
//     });

//     console.log(items);

//     let dropdownCategories = document.getElementById('dropdownCategories');
//     let dropdownUnorderedList = document.createElement('ul');
//     dropdownUnorderedList.style = 'columns: 2;';
//     dropdownUnorderedList.classList.add('dropdown-menu');
//     items.forEach(item => {
 
//         let categoriesCheckboxItem = document.createElement('li');
//         categoriesCheckboxItem.classList.add('dropdown-item');
//         let categoriesAnchorItem = document.createElement('label');
//         let categoriesCheckbox = document.createElement('input');
//         categoriesCheckbox.type = 'checkbox';
//         categoriesCheckbox.name = 'categories-checkboxes';
//         categoriesCheckbox.classList.add('form-check-input');
//         categoriesCheckbox.value = item['category_name'];
//         categoriesAnchorItem.text=item['category_name'];
//         categoriesCheckboxItem.appendChild(categoriesCheckbox);
//         categoriesCheckboxItem.appendChild(categoriesAnchorItem);
//         dropdownUnorderedList.appendChild(categoriesCheckboxItem);
//     });
//     dropdownCategories.appendChild(dropdownUnorderedList);
// });