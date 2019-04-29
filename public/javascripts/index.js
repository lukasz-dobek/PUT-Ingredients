window.onload = () => {
    // showRecipeNames();
}

let main = document.getElementById("mainRecipesContent");

$.getJSON("/recipes/api/all", function (data) {
    let items = [];

    data.forEach(element => {
        items.push(element);
    });

    console.log(items);
    console.log(data[0]);

    let iterate = 0;
    items.forEach(item => {
        console.log(item["recipe_name"]);
        let el = document.getElementById('item'+(iterate+1).toString());
        let image = document.createElement('img');
        image.classList = ['card-img-top'];
        image.src = item['photo'];

        let cardBody = document.createElement('div');
        cardBody.classList = ['card-body'];
        
        let cardText = document.createElement('p');
        cardText.classList = ['card-text'];
        cardText.textContent = item["recipe_name"]
        
        cardBody.appendChild(cardText);

        el.appendChild(image);
        el.appendChild(cardBody);

        iterate++;
    })

});