function sendMail(email) {
    console.log(email);
    let id = 'userMessage_'+email;
    let elValue = document.getElementById(id).value;
    let adminEmailValue = document.getElementById('adminEmail').value;
    $.post("/api/users/send_email", {
        message: elValue,
        send_to: email,
        sent_from: adminEmailValue
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