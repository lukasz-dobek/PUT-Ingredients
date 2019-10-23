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

        let recommendationCard = document.createElement('div');
        recommendationCard.classList.add('card');
        recommendationCard.style.width = "18rem";
        recommendationCard.style.display = 'inline-block';
        recommendationCard.style.marginRight = '20px';

        let recommendationCardImage = document.createElement('img');
        recommendationCardImage.classList.add('card-img-top');
        recommendationCardImage.style.height = '15vw';
        recommendationCardImage.style.objectFit = 'cover';
        recommendationCardImage.style.width = '100%';
        recommendationCardImage.src = recipeJson[0]["photo_one"];
        recommendationCardImage.alt = recipeJson[0]["recipe_name"];

        let recommendationCardBody = document.createElement('div');
        recommendationCardBody.classList.add('card-body');

        let recommendationCardHeader = document.createElement('h6');
        recommendationCardHeader.classList.add('card-title');
        recommendationCardHeader.textContent = recipeJson[0]["recipe_name"];

        let recommendationCardAnchor = document.createElement('a');
        recommendationCardAnchor.classList.add('btn', 'btn-info');
        recommendationCardAnchor.text = ('Sprawdź!');
        recommendationCardAnchor.href = recipeJson[0]["link_to_recipe"];

        recommendationCardBody.appendChild(recommendationCardHeader);
        recommendationCardBody.appendChild(recommendationCardAnchor);

        recommendationCard.appendChild(recommendationCardImage);
        recommendationCard.appendChild(recommendationCardBody);

        recommendationsContainer.appendChild(recommendationCard);
    }));
})();

const shuffle = array => {
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