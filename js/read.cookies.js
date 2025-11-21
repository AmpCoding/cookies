/*
 * JavaScript for handling client-side validation for the registration form (registration.html).
 * This script leverages HTML5 validation attributes (required, minlength, pattern)
 * and adds custom JavaScript validation for password matching.
 */

/**
 * Utility function to set or clear a cookie.
 * To clear a cookie, pass a negative number for 'days' (e.g., -1).
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to store.
 * @param {number} days - Number of days until the cookie expires.
 */
const setCookie = function(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Set the cookie with the name, value, expiration, and path
    // URI-encode the value to handle special characters
    document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/; SameSite=Strict";
}


/**
 * Loops over the form inputs, clears any existing cookies for them,
 * writes new cookies containing the current field values, and finally
 * navigates to the confirmation page using a direct redirect.
 */
const writeCookieData = function(form) {
    // Get all form controls within the registration form
    const controls = form.elements;

    // --- 1. Clear existing cookies ---
    for (let i = 0; i < controls.length; i++) {
        const control = controls[i];

        // Skip non-input elements or those without an ID
        if (control.type === "submit" || !control.id) {
            continue;
        }

        // Clear the cookie for this control's ID
        setCookie(control.id, "", -1);
    }

    // --- 2. Write new cookies ---
    for (let i = 0; i < controls.length; i++) {
        const control = controls[i];

        // Skip the submit button and fields we don't need to save (like password verify)
        // Also skip saving the password itself for safety
        if (control.type === "submit" || !control.id || control.id === "reg-password-verify-input" || control.type === "password") {
            continue;
        }

        // Write the data for the field to a cookie. Store for 1 day.
        setCookie(control.id, control.value, 1);
    }

    // --- 3. Navigate to the confirmation page ---
    const targetUrl = form.getAttribute('action') || 'confirm.html';

    console.log("Validation successful. Cookies written. Navigating to:", targetUrl);

    // GUARANTEED NAVIGATION: Use direct location change (window.location.href) instead of
    // the potentially unreliable form.submit() when triggered from an event listener.
    window.location.href = targetUrl;
}


/**
 * Checks if the password and password verification fields meet HTML5 requirements
 * and, crucially, if their values match. Sets custom validity messages if problems are found.
 */
const checkPassword = function() {
    const passwordField = document.getElementById("reg-password-input");
    const verifyPasswordField = document.getElementById("reg-password-verify-input");

    /* Clear custom validity property for password fields before checking the validity of the form */
    passwordField.setCustomValidity("");
    verifyPasswordField.setCustomValidity("");

    // Check if both fields meet their HTML5 requirements (like minlength="8")
    if (!passwordField.checkValidity() || !verifyPasswordField.checkValidity()) {
        return false;
    }

    // Compare password & verify password.
    if (passwordField.value !== verifyPasswordField.value) {
        const errorMessage = "Passwords do not match.";

        // Set custom validity to display the error message next to the input field.
        passwordField.setCustomValidity(errorMessage);
        verifyPasswordField.setCustomValidity(errorMessage);

        return false;
    }

    return true;
}

/**
 * Configures form submission behavior and the click handler for the submit button.
 */
const configureFormValidation = function() {
    const form = document.getElementById("reg-form");
    const submitButton = document.getElementById("reg-submit-button");
    const resultMessageDiv = document.getElementById("reg-result-message");

    // Clear form.onsubmit to allow manual control
    form.onsubmit = null;

    submitButton.addEventListener("click", function() {
        // 1. Validate password matching/length.
        const passwordsMatch = checkPassword();

        // 2. Check all HTML5 validation rules (required, email format, minlength, etc.).
        const formIsValid = form.checkValidity();

        // 3. Conditional execution based on validation.
        if (formIsValid && passwordsMatch) {
            // Success: Form is valid and passwords match.
            resultMessageDiv.innerHTML = ""; // Clear messages
            writeCookieData(form); // Writes cookies and performs the guaranteed redirect

        } else {
            // Failure: Display general error message.
            resultMessageDiv.innerHTML = "<p style='color: red;'>Please correct the errors shown above the Register button and in the highlighted fields.</p>";

            // Note: The browser automatically handles showing HTML5 validation errors (like "too short").
        }
    });
}

// Event handler called when page has loaded
window.onload = () => {
    configureFormValidation();
}
