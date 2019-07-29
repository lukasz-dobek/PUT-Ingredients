function acceptRecipe(recipeId) {
    $.post("/api/recipes/accept_recipe", {
        recipeId: recipeId,
    });
    alert('Poprawnie zweryfikowano przepis!');
    location.reload();
}

function rejectRecipe(recipeId) {
    $.post("/api/recipes/reject_recipe", {
        recipeId: recipeId,
    });
    alert('Poprawnie odrzucono przepis! Wyślij użytkownikowi wiadomość, aby wiedział jakie kroki podjąć, aby przywrócić jego przepis.');
    location.reload();
}