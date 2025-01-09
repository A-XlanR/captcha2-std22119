const form = document.getElementById('inputForm');
const output = document.getElementById('output');
const API_KEY = "QFYeykBdQKdBtLhvHuK+hlH19ZxKrOLx3L6WUx+qRpfh9vMYAJdYb2oxcpE5KTBfEhmqrrhEvRVeODIZAQEnIOTQqqG/j6FUGLohcKveATIuOWDePxGmPOdcu4NLMCWwCg8dGdatkqKZlUhos2yl3DGIuUL4JVhlpmvPN5Li8WUQXFptUmZqBZupowmVQ+Sb82O/zdObyaLVdjNnlXe02zWpeepFsOxUqk2nVJGN0RCEgH+OG8t5bdeLm4lKFoBQa4wAh5oVpJ8ErwhZNgdkLKqbwYX4cUGWHtOAcjRYcY1wxY/T8CXm6TG3tRwqbWmdGN0jvg9rVqpSPTFI7uwyVDxTtP5PAMBqMh4OZbwbidupU2OAw8wMGiHVj67ekOMI6dfq+7rZq/QcQJYjsEzMMNeA6hkj0Em8f8GUCpSIhSmPcgTqGt/bi3g/bkSwkNNaYQnu+X0GYKHH/fm88SJHUKVxvMb4TFBi7PDTDFH0qoXrbd4Z25D1mveDTjO0D65McMVwyg5CQlifCfGDmlSTSpgEHJ3uRPSYeF6ueJo8JGufYRv9HwAd1zKyHsASV2DmYT/p9dXFrNRqp9OmYM1lmqjdwLLibJ5mKF28B1Ku2sDg93UM1CBTgsDw9lsXOmccYSzVHUfbUL8C+qUJZ1cDZP34kEwbt/q+f9eWtD26vzQ=_0_1";

form.addEventListener('submit', function (event) {
    event.preventDefault();
    output.innerHTML = ""; // Clear previous output
    const n = parseInt(document.getElementById('nValue').value);

    if (isNaN(n) || n < 1 || n > 1000) {
        output.innerHTML = "<p style='color:red'>Please enter a valid number between 1 and 1000.</p>";
        return;
    }

    let counter = 1;
    const intervalId = setInterval(() => {
        fetch('https://api.prod.jcloudify.com/whoami', {
            headers: { 'x-api-key': API_KEY }
        })
            .then(response => {
                if (response.ok) {
                    output.innerHTML += `<p>${counter}. Forbidden</p>`;
                } else if (response.status === 403) {
                    console.error('Captcha required');
                    handleCaptcha(intervalId, counter, n);
                } else {
                    console.error("Unexpected error:", response);
                    output.innerHTML += `<p style="color:red">${counter}. Error occurred</p>`;
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                output.innerHTML += `<p style="color:red">${counter}. Fetch error</p>`;
            });

        counter++;
        if (counter > n) {
            clearInterval(intervalId);
        }
    }, 1000);
});

function handleCaptcha(intervalId, counter, n) {
    if (typeof AwsWafCaptcha !== 'undefined') {
        AwsWafCaptcha.showChallenge();
        AwsWafCaptcha.addEventHandler(function (event) {
            if (event.type === 'success') {
                console.log("Captcha solved successfully");
                AwsWafCaptcha.removeEventHandler();
            } else {
                console.error("Captcha event:", event);
            }
        });
    } else {
        console.error("AwsWafCaptcha not defined");
        clearInterval(intervalId);
        output.innerHTML += `<p style="color:red">${counter}. Captcha handling failed</p>`;
    }
}
