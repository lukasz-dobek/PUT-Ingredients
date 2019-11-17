import { postData } from './common.js';

window.acceptRecipe = async function (recipeId) {
    try {
        const response = await postData("/api/recipes/accept_recipe", { recipeId: recipeId });
        alert('Poprawnie zweryfikowano przepis!');
        location.reload();
    } catch (error) {
        console.error(error);
    }
}

window.rejectRecipe = async function (recipeId) {
    try {
        const response = await postData("/api/recipes/reject_recipe", { recipeId: recipeId });
        alert('Poprawnie odrzucono przepis! Wyślij użytkownikowi wiadomość, aby wiedział jakie kroki podjąć, aby przywrócić jego przepis.');
        location.reload();
    } catch (error) {
        console.error(error);
    }
}