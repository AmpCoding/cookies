/*
 * Function to read cookies, get their name-value pairs, and display the name-value
 * pairs in the output area of the confirm.html page.
 */
const displayCookieValues = function() {
    // Locate the output area on the confirm.html page
    const outputDiv = document.getElementById("output");

    if (!outputDiv) {
        console.error("The required output <div> with id='output' was not found. Cannot display cookie data.");
        return;
    }

    // Get the raw cookie string
    const cookieString = document.cookie;

    if (!cookieString) {
        outputDiv.innerHTML = "<p class='text-red-600 font-semibold'>No registration data found in cookies. Please register first.</p>";
        return;
    }

    // Split the cookie string into individual name=value pairs
    const cookiesArray = cookieString.split(';');

    let outputHTML = '<h2 class="text-xl font-bold mb-4">Registration Details Stored in Cookies:</h2>';
    outputHTML += '<ul class="cookie-list border rounded-lg p-4 bg-white shadow-sm">';

    // Loop through the cookies and display the names and values
    cookiesArray.forEach(cookie => {
        const cleanCookie = cookie.trim();
        const separatorIndex = cleanCookie.indexOf('=');

        if (separatorIndex > 0) {
            let name = cleanCookie.substring(0, separatorIndex).trim();
            let value = cleanCookie.substring(separatorIndex + 1).trim();

            // Decode the URI components
            try {
                value = decodeURIComponent(value);
            } catch (e) {
                console.warn(`Could not decode cookie value for ${name}.`);
            }

            // Cleanup cookie names for presentation
            let readableName = name
                .replace('reg-', '')
                .replace('-input', '')
                .replace('-', ' ')
                .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word

            // Hide the password information
            if (name.includes('password')) {
                value = '******** (Hidden for security)';
            }

            outputHTML += `<li class="py-2 border-b border-gray-100 last:border-b-0">
                <span class="font-medium text-gray-700">${readableName}:</span>
                <span class="text-gray-900">${value}</span>
            </li>`;
        }
    });

    outputHTML += '</ul>';

    // Output the generated HTML to the div
    outputDiv.innerHTML = outputHTML;
}

// Event handler called when page has loaded
window.onload = () => {
    // Call function to display cookie values
    displayCookieValues();
}
