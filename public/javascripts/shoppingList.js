$.getJSON("/api/users/shopping_list", (data) => {
    let items = [];

    data.forEach(element => {
        items.push(element);
    });

    console.log(items);

    let listOfRecipes = document.getElementById("allRecipesShoppingList");
    console.log(listOfRecipes);
        items.forEach(item => {
            let button = document.createElement('button');
            button.type = "button";
            button.classList.add("btn");
            button.classList.add("btn-secondary");
            button.classList.add("btn-shoppingList");
            //button.style='width: 75%; margin-top: 1%; margin-bottom: 1%;';
            button.id=item['recipe_name'];
            button.textContent=item['recipe_name'];
            listOfRecipes.appendChild(button);
        });
});
