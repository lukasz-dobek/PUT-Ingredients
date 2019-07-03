
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
            button.onclick="clickMe(this)";
            //button.style='width: 75%; margin-top: 1%; margin-bottom: 1%;';
            button.id=item['recipe_name'];
            button.textContent=item['recipe_name'];
            listOfRecipes.appendChild(button);
        });
});


$(":button").on('click', function () {
    let id = this.id;
    let value = document.getElementById(id);
    recipeName=value;
    console.log(recipeName);

});

module.exports = router;