import { splitElementId, postData } from './common.js'

const heart = document.querySelectorAll('[id^="favouritesButton_"]')[0];
const recipeId = splitElementId(heart.id);
const currentUserEmail = document.getElementById('userProfileDropdown').textContent.trim();

function hasVoted() {
    let starBox = document.getElementById('starBox');
    let voteValue = 0;
    for (let i = 0; i < 5; i++) {
        if (starBox.childNodes[i].classList.contains('fas')) {
            voteValue++;
        }
    }
    if (voteValue !== 0) {
        return false;
    } else {
        return true;
    }
}

(async function scoreMechanism(){
    const request = await fetch(`/api/votes/${recipeId}/${currentUserEmail}`);
    const vote = await request.json();

    const starBox = document.getElementById('starBox');

    for (let i = 0; i < 5; i++) {
        let star = document.createElement('i');
        star.classList.add('far', 'fa-star');
        star.id = `scoreStar_${i}`;
        star.addEventListener("click", async (e) => {
            let star = document.getElementById(e.target.id);
            let scoreValue = parseInt(splitElementId(star.id)) + 1;
            if (!hasVoted()) {
                return alert('Nie możesz zagłosować na przepis, na który już zagłosowałeś!');
            } else {
                await postData("/api/votes/", {
                    userEmail: currentUserEmail, // uwaga, w post odbieram ale korzystam z ID dla ulatwienia query
                    recipeId: recipeId,
                    vote: scoreValue,
                    voteDate: Date.now()
                });
                location.reload();
            }
        });

        starBox.appendChild(star);
    }
    if (vote.length !== 0) {
        for (let i = 0; i < vote[0]["score"]; i++) {
            starBox.childNodes[i].classList = [];
            starBox.childNodes[i].classList.add('fas');
            starBox.childNodes[i].classList.add('fa-star');
        }
    }
})();
