/* Function to read cookies, get their name-value pairs, and display the name-value
   pairs in the output area */
const displayCookieValues = function() {
    // 1. Locate the output area (the div with the id output) on the confirm.html page.
    const outputDiv = document.getElementById("output");

    // Check if the output div exists (it should on confirm.html)
    if (!outputDiv) {
        console.error("Output div with id 'output' not found.");
        return;
    }

    // Initialize HTML string for display
    let outputHTML = "<h3>Registration Data from Cookies:</h3><ul>";

    // Get all cookies as a single string
    const cookies = document.cookie;

    if (cookies) {
        // Split the cookies string into individual name=value pairs
        const cookieArray = cookies.split(';');

        // 2. Loop through the cookies and display the names and values
        cookieArray.forEach(cookie => {
            // Trim whitespace from the start/end of the cookie string
            const cookiePair = cookie.trim();
            // Find the index of the first '=' to separate name and value
            const separatorIndex = cookiePair.indexOf('=');

            // Ensure the cookie is a valid name=value pair
            if (separatorIndex > 0) {
                // Extract and decode the cookie name and value
                const name = cookiePair.substring(0, separatorIndex);
                // DecodeURIComponent is used because the values were encoded in registration.js
                const value = decodeURIComponent(cookiePair.substring(separatorIndex + 1));

                // Add to the output HTML in a readable format
                outputHTML += `<li><strong>${name}:</strong> ${value}</li>`;
            }
        });
    } else {
        outputHTML += "<li>No registration data found in cookies.</li>";
    }

    outputHTML += "</ul>";

    // Inject the generated HTML into the output div
    outputDiv.innerHTML = outputHTML;
}

// Event handler called when page has loaded
window.onload = () => {
    // Complete the code for the window.onload so that the displayCookieValue() function is called.
    displayCookieValues();
}
