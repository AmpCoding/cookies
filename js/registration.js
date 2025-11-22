/*
 * JavaScript for handling client-side validation for the registration form (registration.html).
 * This script leverages HTML5 validation attributes (required, minlength, pattern)
 * and adds custom JavaScript validation for password matching.
 */

// Helper function to create/delete a cookie.
const setCookie = function(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        // Set expiry date in the future for writing, or in the past for clearing
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Set the cookie with proper path and expiration
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
};

/**
 * Checks if the password and password verification fields meet HTML5 requirements
 * and if their values match.
 */
const checkPassword = function() {
    const passwordField = document.getElementById("reg-password-input");
    const verifyPasswordField = document.getElementById("reg-password-verify-input");

    // Clear custom validity from previous attempts
    passwordField.setCustomValidity("");
    verifyPasswordField.setCustomValidity("");

    // Browser will handle invalid minlength/pattern/etc.
    if (!passwordField.checkValidity() || !verifyPasswordField.checkValidity()) {
        return false;
    }

    // Compare values
    if (passwordField.value !== verifyPasswordField.value) {
        const errorMessage = "Passwords do not match.";
        passwordField.setCustomValidity(errorMessage);
        verifyPasswordField.setCustomValidity(errorMessage);
        return false;
    }

    return true;
};

/**
 * Writes form data to cookies.
 * Clears old cookies first, then writes one cookie per form field (excluding submit).
 * Finally submits the form.
 */
const writeCookieData = function(form) {
    const inputs = form.querySelectorAll("input:not([type='submit'])");
    const processedGroups = new Set();

    const nameMap = {
        'reg-username-input': 'username',
        'reg-first-name-input': 'firstname',
        'reg-last-name-input': 'lastname',
        'reg-email-input': 'email',
        'reg-phone-input': 'phone',
    };

    // --- 1. CLEAR old cookies ---
    ['username', 'firstname', 'lastname', 'email', 'phone', 'newsletter'].forEach(name => {
        setCookie(name, "", -1);
    });

    // --- 2. WRITE new cookies (set to expire in 1 day) ---
    inputs.forEach(input => {
        let cookieName = '';
        let cookieValue = input.value;

        // Skip passwords for security/cleanliness
        if (input.type === 'password') return;

        // Determine the cookie name
        if (input.type === 'radio' && input.name === 'newsletter') {
            cookieName = 'newsletter';
            // ONLY write newsletter cookie if "Yes" is checked
            if (input.checked && input.value === 'Yes' && !processedGroups.has(cookieName)) {
                setCookie(cookieName, cookieValue, 1);
                processedGroups.add(cookieName);
            }
            return;
        } else if (nameMap[input.id]) {
            cookieName = nameMap[input.id];
        } else {
            return;
        }

        // Write standard fields
        setCookie(cookieName, cookieValue, 1);
    });

        // ADD THIS DEBUG CODE:
    console.log("All cookies after writing:", document.cookie);

    // --- 3. SUBMIT the form ---
    form.submit();
};

/**
 * Configures form submission behavior & submit button event.
 */
const configureFormValidation = function() {
    // Get form elements
    const form = document.getElementById("reg-form");
    const resultMessageDiv = document.getElementById("reg-result-message");
    // Note: We no longer need a separate reference to submitButton

    // Attach ALL validation and submission logic to the form's ONSUBMIT event.
    form.onsubmit = function(event) {
        // 1. Temporarily prevent the default HTML form submission/redirection.
        event.preventDefault();

        // 2. Run custom validation
        const passwordsMatch = checkPassword();

        // 3. Since the browser already checked HTML5 validity BEFORE firing onsubmit,
        //    we only need to check our custom logic (passwordsMatch).

        // We *must* re-check form.checkValidity() here because checkPassword() sets
        // custom validity that the form might not yet recognize in the submit event's context.
        const formIsValid = form.checkValidity();

        if (formIsValid && passwordsMatch) {
            // Success message
            resultMessageDiv.innerHTML = "<p style='color: green;'>Registration successful! Redirecting…</p>";

            // ★ Write cookies + submit the form (or redirect) ★
            writeCookieData(form); // This function contains the final form.submit()

        } else {
            // Failure message
            // The browser will highlight the first failing field (either from HTML5 or checkPassword)
            resultMessageDiv.innerHTML = "<p style='color: red;'>Please correct the errors shown above the Register button and in the highlighted fields.</p>";

            // If the form fails, we do nothing; the preventDefault() at the top stops the submission.
        }
    };

    // We do NOT need the separate submitButton.addEventListener("click", ...) block anymore.
    // However, if you want a failure message to appear *before* the browser's default validation message
    // when HTML5 validation fails, you can keep a simplified 'click' handler (see notes below).

    // For simplicity and reliability, the above logic is sufficient.
};

// Event handler when page has loaded
window.onload = () => {
    configureFormValidation();
};
