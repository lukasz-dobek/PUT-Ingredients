function action(e){
    let heart = document.getElementById(e.target.id);
    heart.classList = [];
    heart.classList.add('fas', 'fa-heart');
    heart.style = "color: red; font-size: 1.3vw; position: absolute; bottom:0.4vw; right:1vw;";
}