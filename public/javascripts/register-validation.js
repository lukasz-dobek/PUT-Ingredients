
let hasError = function (field) {

    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

    if (checkPassw()) {
        if (field.name === 'passwordConfirm') return 'Hasła nie zgadzają się.';
    }

    let validity = field.validity;

    if (validity.valid) return;

    if (validity.valueMissing) {
        if (field.name === 'check') return 'Musisz zaakceptować regulamin.';
        return 'To pole jest obowiązkowe.';
    }

    if (validity.typeMismatch) {
        if (field.type === 'email') return 'Wprowadź poprawny adres e-mail.';
    }
    if (validity.tooShort) {
        if (field.name === 'password') return 'Hasło musi składać się z co najmniej 8 znaków, w tym co najmniej jednej małej litery, jednej litery wielkiej, jednej cyfry oraz znaku specjalnego..'
        if (field.name === 'nickname') return 'Pseudonim musi składać się z co najmniej 3 znaków.'
    }

    if (validity.tooLong) {
        if (field.name === 'nickname') return 'Pseudonim może składać się z maksymalnie 50 znaków.'
    }

    if (validity.patternMismatch) {
        if (field.name === 'password') return 'Podane hasło nie spełnia wymagań. Musi składać się ono z co najmniej 8 znaków, w tym co najmniej jednej małej litery, jednej litery wielkiej, jednej cyfry oraz znaku specjalnego.';
        if (field.type === 'email') return 'Podany e-mail jest nieprawidłowy.'
    }

    return 'Podana wartość jest błędna.';

};


let showError = function (field, error) {

    field.classList.add('error');
    let id = field.id || field.name;
    if (!id) return;

    let message = field.form.querySelector('.error-message#error-for-' + id);
    if (!message) {
        message = document.createElement('div');
        message.className = 'error-message';
        message.id = 'error-for-' + id;

        let label;
        label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;
        if (label) {
            label.parentNode.insertBefore(message, label.nextSibling);
        }
        if (!label) {
            field.parentNode.insertBefore(message, field.nextSibling);
        }

    }

    field.setAttribute('aria-describedby', 'error-for-' + id);

    message.innerHTML = error;

    message.style.display = 'block';
    message.style.visibility = 'visible';
};


let removeError = function (field) {

    field.classList.remove('error');

    field.removeAttribute('aria-describedby');
    let id = field.id || field.name;
    if (!id) return;


    let message = field.form.querySelector('.error-message#error-for-' + id + '');
    if (!message) return;

    message.innerHTML = '';
    message.style.display = 'none';
    message.style.visibility = 'hidden';

};

document.addEventListener('blur', function (event) {
    let error = hasError(event.target);

    if (event.target.name === 'email') {
        let customEmail = document.getElementById('emailForm1').value;
        if (customEmail) {
            $.getJSON(`/api/users/email/${customEmail}`, (jsonData) => {
                if (jsonData !== 0) {
                    error = 'Podany adres email jest już zajęty.';
                }
                if (error) {
                    showError(event.target, error);
                    return;
                }
                removeError(event.target);
            });
        }
    }

    if (event.target.name === 'nickname') {
        let customNickname = document.getElementById('nickForm1').value.toLowerCase();
        if (customNickname) {
            $.getJSON(`/api/users/nickname/${customNickname}`, (jsonData) => {
                if (jsonData === 1) {
                    error = 'Podany pseudonim jest już zajęty.';
                }
                if (error) {
                    showError(event.target, error);
                    return;
                }
                removeError(event.target);
            });
        }
    }

    if (error) {
        showError(event.target, error);
        return;
    }
    removeError(event.target);
}, true);

document.addEventListener('submit', function (event) {

    let fields = event.target.elements;
    let error, hasErrors;

    for (let i = 0; i < fields.length; i++) {
        if (fields[i].parentElement.nextSibling.textContent === 'Podany adres email jest już zajęty.') {
            error = 'Podany adres email jest już zajęty.'
        }
        else if (fields[i].parentElement.nextSibling.textContent === 'Podany pseudonim jest już zajęty.') {
            error = 'Podany pseudonim jest już zajęty.'
        }
        else { error = hasError(fields[i]) }
        if (error) {
            showError(fields[i], error);
            if (!hasErrors) {
                hasErrors = fields[i];
            }
        }
    }

    if (hasErrors) {
        event.preventDefault();
        hasErrors.focus();
    }
}, false);


let checkPassw = function () {
    let password = document.getElementById('passwordForm1');
    let confirmPass = document.getElementById('passwordForm2');
    if (confirmPass.value) {
        if (password.value != confirmPass.value) {
            return true;
        } else {
            return false;
        }
    }
};