$.getJSON("/api/users/all", (data) => {
  let customNickname = document.getElementById('nickForm1');
  let customEmail = document.getElementById('emailForm1');
  let nicknameTaken = false;
  let emailTaken = false;
  let items = [];


  data.forEach(element => {
    items.push(element);
  });
  let names = [];
  items.forEach(item => {
    names.push(item['nickname']);
  });
  let emails = [];
  items.forEach(item => {
    emails.push(item['email_address'])
  });
  console.log(emails);
  console.log(names);

  let checkNickname= function () {
    if (customNickname.value) {
     console.log(items);
   
     for (let i = 0; i < names.length; i++) {
      if (customNickname.value != names[i]) {
       nicknameTaken = false;
      } else {
       nicknameTaken = true;
       break;
      }
     }
    }
    return nicknameTaken;
   };
   
   let checkEmail = function () {
   
    if (customEmail.value) {
   //  console.log(items);
   
     for (let i = 0; i < emails.length; i++) {
      if (customEmail.value != emails[i]) {
       emailTaken = false;
      } else {
       emailTaken = true;
       break;
      }
     }
    }
    return emailTaken;
   };

  // Validate the field
  let hasError = function (field) {

    // Don't validate submits, buttons, file and reset inputs, and disabled fields
    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

    if (check()) {
      if (field.name === 'passwordConfirm') return 'Hasła nie zgadzają się.';
    }

    if (checkNickname()) {
      if (field.name === 'nickname') return 'Pseudonim jest już zajęty.';
    }

    if (checkEmail()) {
      if (field.name === 'email') return 'Konto dla danego adresu e-mail już istnieje.';
    }
    // Get validity
    let validity = field.validity;

    // If valid, return null
    if (validity.valid) return;

    // If field is required and empty
    if (validity.valueMissing) {
      if (field.name === 'check') return 'Musisz zaakceptować regulamin.';
      return 'To pole jest obowiązkowe.';
    }

    // If not the right type
    if (validity.typeMismatch) {
      // Email
      if (field.type === 'email') return 'Wprowadź poprawny adres e-mail.';
    }

    // If too short
    if (validity.tooShort) {
      if (field.name === 'password') return 'Hasło musi składać się z co najmniej 6 znaków.'
      if (field.name === 'nickname') return 'Pseudonim musi składać się z co najmniej 3 znaków.'
    }

    // If too long
    if (validity.tooLong) {
      if (field.name === 'nickname') return 'Pseudonim może składać się z maksymalnie 50 znaków.'
    }

    // If pattern doesn't match
    if (validity.patternMismatch) {
      if (field.name === 'password') return 'Podane hasło nie spełnia wymagań. Musi składać się ono z co najmniej 6 znaków, w tym jednej litery i jednej cyfry.';
      if (field.type === 'email') return 'Podany e-mail jest nieprawidłowy.'
    }

    // If all else fails, return a generic catchall error
    return 'Podana wartość jest błędna.';

  };


  // Show an error message
  let showError = function (field, error) {

    // Add error class to field
    field.classList.add('error');
    // Get field id or name
    let id = field.id || field.name;
    if (!id) return;

    // Check if error message field already exists
    // If not, create one
    let message = field.form.querySelector('.error-message#error-for-' + id);
    if (!message) {
      message = document.createElement('div');
      message.className = 'error-message';
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
    // If there's an error, show it
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
      error = hasError(fields[i]);
      if (error) {
        showError(fields[i], error);
        if (!hasErrors) {
          hasErrors = fields[i];
        }
      }
    }

    // If there are errrors, don't submit form and focus on first element with error
    if (hasErrors) {
      event.preventDefault();
      hasErrors.focus();
    }

    // Otherwise, let the form submit normally
    // You could also bolt in an Ajax form submit process here

  }, false);


  let check = function () {
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
});