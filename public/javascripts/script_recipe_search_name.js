let recipeName = document.getElementById('recipeName').textContent.toLowerCase();
let endpoint = "/recipes/api/name/" + recipeName;
console.log(endpoint);

$.getJSON(endpoint, function (data) {
    let items = [];

    data.forEach(element => {
        items.push(element);
    });

    let listOfRecipes = document.getElementById('listOfRecipes');


    let iterate = 0;
    items.forEach(item => {
        console.log(item["recipe_name"]);
        let row = document.createElement('div');
        row.classList.add('row');
        row.classList.add('align-items-center');

        row.style='margin-top: 30px;';

        let imageSection = document.createElement('div');
        imageSection.classList.add('col-6');
        imageSection.classList.add('col-md-4');

        let image = document.createElement('img');
        image.classList = ['card-img-top'];
        image.src = item['photo'];

        imageSection.appendChild(image);

        let textSection = document.createElement('div');
        textSection.classList.add('col-6');
        textSection.classList.add('col-md-4');

        let title = document.createElement('h3');
        title.textContent = item["recipe_name"];

        let descripton = document.createElement('p');
        descripton.textContent = item["description"];

        let complicity = document.createElement('p');
        complicity.textContent = `Stopień trudności: ${item["complicity"]}`;

        let preparationTime = document.createElement('p');
        preparationTime.textContent = `Czas przygotowania: ${item["preparation_time"]}`;

        let portionSize = document.createElement('p');
        portionSize.textContent = `Liczba porcji: ${item["number_of_people"]}`;

        let score = document.createElement('p');
        score.textContent = `Ocena: ${item["score"]}`;

        let id = item['id_recipe'];

        let categoriesList = document.createElement('p');

        $.getJSON('/categories/api/categories_per_recipe/'+id, (result)=>{
            let cats = [];
            result.forEach(resultItem => {
                cats.push(resultItem);
            });
            cats.forEach(cat => {
                categoriesList.textContent += cat['category_name'] + ' ';
            });
        });

        textSection.appendChild(title);
        textSection.appendChild(complicity);
        textSection.appendChild(preparationTime);
        textSection.appendChild(portionSize);
        textSection.appendChild(score);
        textSection.appendChild(categoriesList);

        row.appendChild(imageSection);
        row.appendChild(textSection);

        listOfRecipes.appendChild(row);

        iterate++;
    })

});