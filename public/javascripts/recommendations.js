(async () => {

    let recommendations = await fetch("http://localhost:3000/api/favourites/recommendations");
    let myJson = await recommendations.json();
    
    
    let recommendationsContainer = document.getElementById("recomm");
    await Promise.all(myJson.map(async value => {

        let getRecipeData = await fetch(`http://localhost:3000/api/recipes/id/${value}`);
        let recipeJson = await getRecipeData.json();

        let graphicalRecomm = document.createElement("p");
        graphicalRecomm.innerHTML = `Sprawdź również: <a href="${recipeJson[0]["link_to_recipe"]}">${recipeJson[0]["recipe_name"]}</a>`;

        recommendationsContainer.appendChild(graphicalRecomm);
    }));
})();
