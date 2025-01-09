// script.js
const form = document.getElementById("inputForm");
const outputDiv = document.getElementById("output");

// API endpoint
const API_URL = "https://api.prod.jcloudify.com/whoami";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the value of N
    const nValue = parseInt(document.getElementById("nValue").value, 10);

    if (isNaN(nValue) || nValue < 1 || nValue > 1000) {
        alert("Please enter a valid number between 1 and 1000.");
        return;
    }

    form.style.display = "none";
    outputDiv.innerHTML = "<p>Generating sequence...</p>";

    for (let i = 1; i <= nValue; i++) {
        try {
            // Call the API
            const response = await fetch(API_URL, {
                method: "GET",
                credentials: "include", // Include cookies for CAPTCHA handling
            });

            if (response.status === 403) {
                // CAPTCHA encountered
                await handleCaptcha();
            }

            // Append the result
            appendLine(`${i}. Forbidden`);
        } catch (error) {
            console.error("Error during API call:", error);
            appendLine(`${i}. Error`);
        }

        // Wait for 1 second
        await delay(1000);
    }

    appendLine("<p>Sequence completed!</p>");
});

// Helper to append a line to the output
function appendLine(text) {
    const line = document.createElement("p");
    line.innerHTML = text;
    outputDiv.appendChild(line);
}

// Helper to handle CAPTCHA
async function handleCaptcha() {
    return new Promise((resolve) => {
        // AWS WAF CAPTCHA integration
        window.wafCaptcha.render({
            container: document.body, // Render CAPTCHA on the body
            apiKey: "QFYeykBdQKdBtLhvHuK+hlH19ZxKrOLx3L6WUx+qRpfh9vMYAJdYb2oxcpE5KTBfEhmqrrhEvRVeODIZAQEnIOTQqqG/j6FUGLohcKveATIuOWDePxGmPOdcu4NLMCWwCg8dGdatkqKZlUhos2yl3DGIuUL4JVhlpmvPN5Li8WUQXFptUmZqBZupowmVQ+Sb82O/zdObyaLVdjNnlXe02zWpeepFsOxUqk2nVJGN0RCEgH+OG8t5bdeLm4lKFoBQa4wAh5oVpJ8ErwhZNgdkLKqbwYX4cUGWHtOAcjRYcY1wxY/T8CXm6TG3tRwqbWmdGN0jvg9rVqpSPTFI7uwyVDxTtP5PAMBqMh4OZbwbidupU2OAw8wMGiHVj67ekOMI6dfq+7rZq/QcQJYjsEzMMNeA6hkj0Em8f8GUCpSIhSmPcgTqGt/bi3g/bkSwkNNaYQnu+X0GYKHH/fm88SJHUKVxvMb4TFBi7PDTDFH0qoXrbd4Z25D1mveDTjO0D65McMVwyg5CQlifCfGDmlSTSpgEHJ3uRPSYeF6ueJo8JGufYRv9HwAd1zKyHsASV2DmYT/p9dXFrNRqp9OmYM1lmqjdwLLibJ5mKF28B1Ku2sDg93UM1CBTgsDw9lsXOmccYSzVHUfbUL8C+qUJZ1cDZP34kEwbt/q+f9eWtD26vzQ=_0_1",
            onSuccess: () => {
                console.log("CAPTCHA solved.");
                resolve();
            },
        });
    });
}

// Helper to delay execution
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
