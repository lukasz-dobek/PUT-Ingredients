document.addEventListener("blur", async function (event) {
    let error = hasError(event.target);

    if (error) {
        showError(event.target, error);
        return;
    }

    if (checkForExistance(event.target.name, event)) {
        return;
    }

    removeError(event.target);
}, true);

document.addEventListener("submit", function (event) {
    let fields = event.target.elements;
    let error, hasErrors;

    for (let i = 0; i < fields.length; i++) {
        error = hasError(fields[i])
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

function hasError(field) {

    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button' || field.URL) return;

    if (arePasswordsEquivalent()) {
        if (field.name === 'passwordConfirm') return 'Hasła nie zgadzają się.';
    }

    let validity = field.validity;

    if (validity.valid) return;

    if (validity.valueMissing) {
        if (field.name === 'check') return 'Musisz zaakceptować regulamin.'; return 'To pole jest obowiązkowe.';
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
}

function showError(field, error) {

    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button' || field.URL) return;

    field.classList.add('error');

    let id = field.id;
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

function removeError(field) {
    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button' || field.URL) return;

    field.classList.remove('error');
    field.removeAttribute('aria-describedby');

    let id = field.id || field.name;
    if (!id) return;

    let message = field.form.querySelector('.error-message#error-for-' + id + '');
    if (!message) return;

    message.innerHTML = '';
    message.style.display = 'none';
    message.style.visibility = 'hidden';
}

function arePasswordsEquivalent() {
    let password = document.getElementById('passwordForm1');
    let confirmPass = document.getElementById('passwordForm2');
    if (confirmPass.value) {
        if (password.value != confirmPass.value) {
            return true;
        } else {
            return false;
        }
    }
}

async function checkForExistance(type, event) {
    let error;
    let enteredValue = type === "email" ? document.getElementById("emailForm1").value : document.getElementById('nickForm1').value.toLowerCase();
    let url = type === "email" ? `/api/users/email/${enteredValue}` : `/api/users/nickname/${enteredValue}`;
    
    if (enteredValue) {
        let fetchRequest = await fetch(url);
        let fetchResult = await fetchRequest.json();

        if (fetchResult !== 0) {
            error = type === "email" ? "Podany adres email jest już zajęty." : "Podany pseudonim jest już zajęty.";
        }
        if (error) {
            showError(event.target, error);
            return true;
        }
        removeError(event.target);
        return false;
    }
}