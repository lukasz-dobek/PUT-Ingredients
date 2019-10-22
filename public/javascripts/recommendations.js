(async () => {

    let recommendations = await fetch("http://localhost:3000/api/favourites/recommendations");
    let myJson = await recommendations.json();

    let recipesArray;
    if (myJson.length > 3) {
        shuffle(myJson);
        recipesArray = myJson.slice(0,3);
    } else {
        recipesArray = myJson.slice(0);
    }

    let recommendationsContainer = document.getElementById("recomm");
    await Promise.all(recipesArray.map(async value => {

        let getRecipeData = await fetch(`http://localhost:3000/api/recipes/id/${value}`);
        let recipeJson = await getRecipeData.json();
        let graphicalRecomm = document.createElement("p");
        graphicalRecomm.innerHTML = `<a href="${recipeJson[0]["link_to_recipe"]}"><img class="card-img-top" style="12vw" src="${recipeJson[0]["photo_one"]}"></a>`;

        recommendationsContainer.appendChild(graphicalRecomm);
    }));
})();

// lel
// const pickRandomThree = array => {
//     if (array.length <= 3) {
//         return array;
//     } else {
//         let randomIndexes = [];
//         do {
//             let randomNumber = Math.floor(Math.random() * array.length);
//             if (randomIndexes.includes(randomNumber)) continue;
//         } while (randomIndexes.length !== 3);
//         return [
//             array[randomIndexes[0]],
//             array[randomIndexes[1]],
//             array[randomIndexes[2]]
//         ]
//     }
// }

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }