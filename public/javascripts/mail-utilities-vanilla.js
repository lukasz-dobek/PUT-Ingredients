import { postData } from "./common.js";

const adminEmailValue = document.getElementById('adminEmail').value;

function eraseText(id) {
    let el = document.getElementById(id);
    el.value = "";
}

window.sendMail = async function(email) {
    let id = 'userMessage_' + email;
    let elValue = document.getElementById(id).value;
    if (elValue === '') {
        alert('Nie wolno wysłać pustej wiadomości!');
    } else {
        await postData("/api/users/send_email", {
            message: elValue,
            send_to: email,
            sent_from: adminEmailValue
        }).catch(er => console.log("purge errors"));
        alert('Wiadomość została wysłana!');
        eraseText(id);
        location.reload();
    }
}

window.blockUser = async function(nickname, email) {
    await postData("/api/users/block_user", {
        blockedNickname: nickname
    }).catch(er => console.log("purge errors"));
    await postData("/api/users/send_email", {
        message: "Twoje konto zostało zablokowane. W celu wyjaśnienia sytuacji, skontaktuj się z administratorem.",
        send_to: email,
        sent_from: adminEmailValue
    }).catch(er => console.log("purge errors"));

    alert(`Zablokowano użytkownika ${nickname}`);
    location.reload();
}

window.unblockUser = async function(nickname, email) {
    await postData("/api/users/unblock_user", {
        unblockedNickname: nickname
    }).catch(er => console.log("purge errors"));
    await postData("/api/users/send_email", {
        message: "Twoje konto zostało odblokowane.",
        send_to: email,
        sent_from: adminEmailValue
    }).catch(er => console.log("purge errors"));
    alert(`Odblokowano użytkownika ${nickname}`);
    location.reload();
}