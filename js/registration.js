/*
 * JavaScript for handling client-side validation for the registration form (registration.html).
 * This script leverages HTML5 validation attributes (required, minlength, pattern)
 * and adds custom JavaScript validation for password matching.
 */

/**
 * Checks if the password and password verification fields meet HTML5 requirements
 * and, crucially, if their values match. Sets custom validity messages if problems are found.
 */
const checkPassword = function() {
    const passwordField = document.getElementById("reg-password-input");
    const verifyPasswordField = document.getElementById("reg-password-verify-input");

    /* Clear custom validity property for password fields before checking the validity of the form
       This is essential so that a previous custom error doesn't block validation if fixed. */
    passwordField.setCustomValidity("");
    verifyPasswordField.setCustomValidity("");

    // Check if both fields meet their HTML5 requirements (like minlength="8")
    // If they fail, the built-in validation will handle the error message.
    if (!passwordField.checkValidity() || !verifyPasswordField.checkValidity()) {
        // If HTML5 attributes fail, let the browser handle the error messages/focus.
        return false;
    }

    // Complete code to compare password & verify password.
    if (passwordField.value !== verifyPasswordField.value) {
        const errorMessage = "Passwords do not match.";

        // Use setCustomValidity() to assign an error string when the passwords don't match.
        // This will cause the form's checkValidity() to fail and display the message.
        passwordField.setCustomValidity(errorMessage);
        verifyPasswordField.setCustomValidity(errorMessage);

        return false;
    }

    // If the values match and all HTML5 checks pass, the fields are valid.
    // Setting the custom validity to an empty string means the input is valid (already done above).
    return true;
}

/**
 * Configures form submission behavior and the click handler for the submit button.
 */
const configureFormValidation = function() {
    const form = document.getElementById("reg-form");
    const submitButton = document.getElementById("reg-submit-button");
    const resultMessageDiv = document.getElementById("reg-result-message");

    // Block form submission (using preventDefault) - need to stay on the same page.
    form.onsubmit = function(event) {
        event.preventDefault();
    }

    submitButton.addEventListener("click", function() {
        // 1. Call the checkPassword() function to validate password length and matching.
        const passwordsMatch = checkPassword();

        // 2. Use the form's checkValidity() function to check all HTML5 validation rules.
        const formIsValid = form.checkValidity();

        // 3. Display the appropriate message based on validation results.
        if (formIsValid && passwordsMatch) {
            // Success: Form is valid and passwords match
            resultMessageDiv.innerHTML = "<p style='color: green;'>Registration successful! Data is ready for submission (submission disabled for this assessment).</p>";
        } else {
            // Failure: Form is invalid (either passwords don't match, or an HTML5 field failed)
            resultMessageDiv.innerHTML = "<p style='color: red;'>Please correct the errors shown above the Register button and in the highlighted fields.</p>";

            /*
             When form.checkValidity() fails, the browser automatically prevents submission,
             sets focus to the first invalid field, and displays the appropriate error message
             (based on 'title' or built-in messages). We just need to ensure the password
             fields have their custom validity set correctly by checkPassword().
             */
        }
    });
}

// Event handler called when page has loaded
window.onload = () => {
    // Add code here to call function to configure validation when page has loaded
    configureFormValidation();
}
