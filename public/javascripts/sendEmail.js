let adminEmailValue = document.getElementById('adminEmail').value;

function sendMail(email) {
    let id = 'userMessage_' + email;
    let elValue = document.getElementById(id).value;

    if (elValue === '') {
        alert('Nie wolno wysłać pustej wiadomości!');
    } else {
        $.post("/api/users/send_email", {
            message: elValue,
            send_to: email,
            sent_from: adminEmailValue
        });
        alert('Wiadomość została wysłana!');
        eraseText(id);
        location.reload();
    }
}

function eraseText(id) {
    let el = document.getElementById(id);
    el.value = "";
}

function blockUser(nickname, email) {
    $.post("/api/users/block_user", {
        blockedNickname: nickname
    });
    $.post("/api/users/send_email", {
        message: "Twoje konto zostało zablokowane. W celu wyjaśnienia sytuacji, skontaktuj się z administratorem.",
        send_to: email,
        sent_from: adminEmailValue
    });
    alert(`Zablokowano użytkownika ${nickname}`);
    location.reload();
}

function unblockUser(nickname, email) {
    $.post("/api/users/unblock_user", {
        unblockedNickname: nickname
    });
    $.post("/api/users/send_email", {
        message: "Twoje konto zostało odblokowane.",
        send_to: email,
        sent_from: adminEmailValue
    });
    alert(`Odblokowano użytkownika ${nickname}`);
    location.reload();
}