function sendMail(email) {
    let id = 'userMessage_' + email;
    let elValue = document.getElementById(id).value;
    console.log(elValue);

    if (elValue === '') {
        alert('Nie wolno wysłać pustej wiadomości!');
    } else {
        let adminEmailValue = document.getElementById('adminEmail').value;
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

function blockUser(nickname) {
    $.post("/api/users/block_user", {
        blockedNickname: nickname
    });
    alert(`Zablokowano użytkownika ${nickname}`);
    location.reload();
}

function unblockUser(nickname) {
    $.post("/api/users/unblock_user", {
        unblockedNickname: nickname
    });
    alert(`Odblokowano użytkownika ${nickname}`);
    location.reload();
}