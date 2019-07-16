function sendMail(email) {
    let id = 'userMessage_'+email;
    let elValue = document.getElementById(id).value;
    $.post("/api/users/send_email", {
        message: elValue,
        send_to: email
    });
    alert('Wiadomość została wysłana!');
    eraseText(id);
}

function eraseText(id) {
    let el = document.getElementById(id);
    el.value = "";
}

function blockUser(nickname) {
    $.post("/api/users/block_user", {
        blockedNickname: nickname
    });
}