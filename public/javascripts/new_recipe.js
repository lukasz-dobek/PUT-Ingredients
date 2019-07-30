$.getJSON("/api/categories/all", (data) => {
    let items = [];

    data.forEach(element => {
        items.push(element);
    });


    let selectCategories = document.querySelectorAll("[id^=categorySelect]");
    selectCategories.forEach(select => {
        items.forEach(item => {
            let option = document.createElement('option');
            option.value = item['category_name'];
            option.textContent = item['category_name'];
            select.appendChild(option);
        });
    })
});

$("[id^=category]").on('change', function () {
    let selects = document.querySelectorAll("[id^=category]");
    let oneSelect = document.getElementById("category1");
    let allCategories =[];
    let i;
    for(i=0;i<oneSelect.length;i++){
        allCategories.push(oneSelect.options[i].value);
    }
    let values = [];
    for(i=0 ;i<selects.length;i++)
    {
        values.push($(selects[i]).children("option:selected").val());
    }
    for(i =0; i<values.length;i++){
        if($("[id^=category]").find('option[value="' + values[i] + '"]')){
            $("[id^=category]").find('option[value="' + values[i] + '"]').hide();
        }
    }
    for(i=0;i<allCategories.length;i++){
        if(values.includes(allCategories[i]) === false){
            $("[id^=category]").find('option[value="' + allCategories[i] + '"]').show();
        }
    }

});

$.getJSON("/api/units/names", (data) => {
    let items = [];

    data.forEach(element => {
        items.push(element);
    });


    let selectUnits = document.querySelectorAll("[id^=unitSelect]");
    selectUnits.forEach(select => {
        items.forEach(item => {
            let option = document.createElement('option');
            option.value = item['unit_name'];
            option.textContent = item['unit_name'];
            select.appendChild(option);
        });
    });
});


$.getJSON("/api/recipes/all", (data) => {
    let customRecipeName = document.getElementById('recipeNameForm');
    let recipeNameTaken = false;
    let items = [];

    data.forEach(element => {
        items.push(element);
    });

    let recipeNames = [];
    items.forEach(item => {
        recipeNames.push(item['recipe_name']);
    });

    let checkRecipeName = function () {
        if (customRecipeName.value) {

            for (let i = 0; i < recipeNames.length; i++) {
                if (customRecipeName.value != recipeNames[i]) {
                    recipeNameTaken = false;
                } else {
                    recipeNameTaken = true;
                    break;
                }
            }
        }
        return recipeNameTaken;
    };

    // Validate the field
    let hasError = function (field) {

        // Don't validate submits, buttons, file and reset inputs, and disabled fields
        if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

        if (checkRecipeName()) {
            if (field.name === 'recipename') return 'Podany przepis juz istnieje.';
        }

        if(field.type === 'number'){
            if(field.value <=0) return "Wartość nie może być zerowa, lub ujemna."
        }
        // Get validity
        let validity = field.validity;

        // If valid, return null
        if (validity.valid) return;

        if (validity.typeMismatch) {
            // Email
            if (field.type === 'number') return 'Wprowadzone dane muszą być liczbą.';
        }
        // If field is required and empty
        if (validity.valueMissing) {
            if (field.id === "categorySelect1") return 'Musi zostać wybrana co najmniej jedna kategoria.';
            if (field.name === 'check') return 'Musisz zaakceptować regulamin.';
            return 'To pole jest obowiązkowe.';
        }
        // If too short
        if (validity.tooShort) {
            if (field.name === 'recipename') return 'Nazwa przepisu musi składać się co najmniej 5 znaków.'
            if (field.name === 'ingredientName') return 'Nazwa składnika musi mieć co najmniej 5 znaków.'
        }

        // If too long
        if (validity.tooLong) {
            if (field.name === 'nickname') return 'Nazwa przepisu może się składać masymalnie z 100 znaków.'
            if (field.name === 'ingredientName') return 'Nazwa składnika może się składać maksymalnie z 50 znaków.'
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
            message.className = 'error-message container';
            message.id = 'error-for-' + id;

            // If the field is a radio button or checkbox, insert error after the label
            let label;
            //if (field.type === 'radio' || field.type ==='checkbox') {
            label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;
            if (label) {
                if (field.id==='categorySelect1') {
                    let form = document.getElementById('categories');
                    let lastChild = document.getElementById('secondRow');
                    lastChild.parentNode.insertBefore(message,lastChild.nextSibling);
                }
                else if(label.parentNode.parentNode.id==='ingredients' || label.parentNode.parentNode.id === 'generalInfo'){
                    field.parentNode.appendChild(message);
                }
                    else{
                        label.parentNode.insertBefore(message,label.nextSibling);
                }

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

});