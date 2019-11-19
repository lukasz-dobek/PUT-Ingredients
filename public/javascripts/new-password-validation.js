
// Validate the field
let hasError = function (field) {

    // Don't validate submits, buttons, file and reset inputs, and disabled fields
    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

    // if(field.name === 'oldPassword'){
    //     let email_address = field.value;
    //     if(email_address) {
    //         // $.getJSON(`/api/users/email/${email_address}`, (jsonData) => {
    //         //     if(arg)
    //         // });
    //     }
    // }

    if (checkPassw()) {
        if (field.name === 'passwordConfirm') return 'Hasła nie zgadzają się.';
    }
    let validity = field.validity;

    if (validity.valid) return;
    // If too short

    if (validity.valueMissing) {
        return 'To pole jest obowiązkowe.';
    }

    if (validity.tooShort) {
        if (field.name === 'newPassword') return 'Hasło musi składać się z co najmniej 8 znaków, w tym co najmniej jednej małej litery, jednej litery wielkiej, jednej cyfry oraz znaku specjalnego..'
    }

    // If pattern doesn't match
    if (validity.patternMismatch) {
        if (field.name === 'newPassword') return 'Podane hasło nie spełnia wymagań. Musi składać się ono z co najmniej 8 znaków, w tym co najmniej jednej małej litery, jednej litery wielkiej, jednej cyfry oraz znaku specjalnego.';
    }

    return 'Podana wartość jest błędna.';

};


// Show an error message
let showError = function (field, error) {

    // Add error class to field
    field.classList.add('error');
    // Get field id or name
    let id = field.id || field.name;
    if (!id) return;

    // If not, create one
    let message = field.form.querySelector('.error-message#error-for-' + id);
    if (!message) {
        message = document.createElement('div');
        message.className = 'error-message';
        //message.style.wordWrap = 'normal;'
        message.id = 'error-for-' + id;

        // If the field is a radio button or checkbox, insert error after the label
        let label;
        //if (field.type === 'radio' || field.type ==='checkbox') {
        label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;
        if (label) {
            label.parentNode.insertBefore(message, label.nextSibling);
        }
        //}

        // Otherwise, insert it after the field
        if (!label) {
            field.parentNode.insertBefore(message, field.nextSibling);
        }

    }

    // Add ARIA role to the field
    field.setAttribute('aria-describedby', 'error-for-' + id);

    // Update error message
    message.innerHTML = error;

    // Show error message
    message.style.marginLeft = '2%';
    message.style.display = 'block';
    message.style.visibility = 'visible';
    //   }
};


// Remove the error message
let removeError = function (field) {

    // Remove error class to field
    field.classList.remove('error');

    // Remove ARIA role from the field
    field.removeAttribute('aria-describedby');
    // Get field id or name
    let id = field.id || field.name;
    if (!id) return;


    // Check if an error message is in the DOM
    let message = field.form.querySelector('.error-message#error-for-' + id + '');
    if (!message) return;

    // If so, hide it
    message.innerHTML = '';
    message.style.display = 'none';
    message.style.visibility = 'hidden';


};

document.addEventListener('blur', function (event) {

    let error = hasError(event.target);
    if (error) {
        showError(event.target, error);
        return;
    }

    // Otherwise, remove any existing error message
    removeError(event.target);
}, true);

// Check all fields on submit
document.addEventListener('submit', function (event) {

    // Only run on forms flagged for validation
    // Get all of the form elements
    let fields = event.target.elements;
    // Validate each field
    // Store the first field with an error to a letiable so we can bring it into focus leter
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
    // Ifthere are errrors, don't submit form and focus on first element with error
    if (hasErrors) {
        event.preventDefault();
        hasErrors.focus();
    }
    // Otherwise, let the form submit normally
    // You could also bolt in an Ajax form submit process here
}, false);


let checkPassw = function () {
    let password = document.getElementById('passwordForm2');
    let confirmPass = document.getElementById('passwordForm3');
    if (confirmPass.value) {
        if (password.value !== confirmPass.value) {
            return true;
        } else {
            return false;
        }
    }
};

//});