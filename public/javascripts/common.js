async function getCategoryNames() {
    const categoriesPromise = await fetch("/api/categories/all");
    const categoriesJSON = await categoriesPromise.json();
    const categories = [];

    categoriesJSON.forEach(element => {
        categories.push(element["category_name"]);
    });

    return categories;
}

export { getCategoryNames };