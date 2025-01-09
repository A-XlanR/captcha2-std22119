document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('inputForm');
    const outputDiv = document.getElementById('output');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        const nValue = parseInt(document.getElementById('nValue').value);

        if (isNaN(nValue) || nValue < 1 || nValue > 1000) {
            alert('Please enter a valid number between 1 and 1000.');
            return;
        }

        form.style.display = 'none'; // Hide the form
        outputDiv.style.display = 'block';

        let counter = 1;
        const intervalId = setInterval(function () {
            fetch('https://api.prod.jcloudify.com/whoami', {
                method: 'GET',
                headers: {
                    'x-api-key': 'QFYeykBdQKdBtLhvHuK+hlH19ZxKrOLx3L6WUx+qRpfh9vMYAJdYb2oxcpE5KTBfEhmqrrhEvRVeODIZAQEnIOTQqqG/j6FUGLohcKveATIuOWDePxGmPOdcu4NLMCWwCg8dGdatkqKZlUhos2yl3DGIuUL4JVhlpmvPN5Li8WUQXFptUmZqBZupowmVQ+Sb82O/zdObyaLVdjNnlXe02zWpeepFsOxUqk2nVJGN0RCEgH+OG8t5bdeLm4lKFoBQa4wAh5oVpJ8ErwhZNgdkLKqbwYX4cUGWHtOAcjRYcY1wxY/T8CXm6TG3tRwqbWmdGN0jvg9rVqpSPTFI7uwyVDxTtP5PAMBqMh4OZbwbidupU2OAw8wMGiHVj67ekOMI6dfq+7rZq/QcQJYjsEzMMNeA6hkj0Em8f8GUCpSIhSmPcgTqGt/bi3g/bkSwkNNaYQnu+X0GYKHH/fm88SJHUKVxvMb4TFBi7PDTDFH0qoXrbd4Z25D1mveDTjO0D65McMVwyg5CQlifCfGDmlSTSpgEHJ3uRPSYeF6ueJo8JGufYRv9HwAd1zKyHsASV2DmYT/p9dXFrNRqp9OmYM1lmqjdwLLibJ5mKF28B1Ku2sDg93UM1CBTgsDw9lsXOmccYSzVHUfbUL8C+qUJZ1cDZP34kEwbt/q+f9eWtD26vzQ=_0_1'
                }
            })
                .then(response => {
                    if (!response.ok && response.status === 403) {
                        // Handle WAF Captcha
                         console.log("Captcha detected")
                        clearInterval(intervalId); // Stop the interval while captcha is displayed

                        const captchaDiv = document.createElement("div");
                        captchaDiv.id = "captchaContainer";
                        outputDiv.appendChild(captchaDiv);

                        AWSWAF.renderCaptcha(
                           'captchaContainer',
                           (token) => {
                                console.log("Captcha Solved")
                                // Continue the sequence after captcha is solved
                                outputDiv.removeChild(captchaDiv);
                                outputDiv.innerHTML += `${counter}. Forbidden<br>`;
                                counter++;
                                const newIntervalId = setInterval(function(){
                                    if (counter <= nValue) {
                                        fetch('https://api.prod.jcloudify.com/whoami', {
                                            method: 'GET',
                                            headers: {
                                                'x-api-key': 'QFYeykBdQKdBtLhvHuK+hlH19ZxKrOLx3L6WUx+qRpfh9vMYAJdYb2oxcpE5KTBfEhmqrrhEvRVeODIZAQEnIOTQqqG/j6FUGLohcKveATIuOWDePxGmPOdcu4NLMCWwCg8dGdatkqKZlUhos2yl3DGIuUL4JVhlpmvPN5Li8WUQXFptUmZqBZupowmVQ+Sb82O/zdObyaLVdjNnlXe02zWpeepFsOxUqk2nVJGN0RCEgH+OG8t5bdeLm4lKFoBQa4wAh5oVpJ8ErwhZNgdkLKqbwYX4cUGWHtOAcjRYcY1wxY/T8CXm6TG3tRwqbWmdGN0jvg9rVqpSPTFI7uwyVDxTtP5PAMBqMh4OZbwbidupU2OAw8wMGiHVj67ekOMI6dfq+7rZq/QcQJYjsEzMMNeA6hkj0Em8f8GUCpSIhSmPcgTqGt/bi3g/bkSwkNNaYQnu+X0GYKHH/fm88SJHUKVxvMb4TFBi7PDTDFH0qoXrbd4Z25D1mveDTjO0D65McMVwyg5CQlifCfGDmlSTSpgEHJ3uRPSYeF6ueJo8JGufYRv9HwAd1zKyHsASV2DmYT/p9dXFrNRqp9OmYM1lmqjdwLLibJ5mKF28B1Ku2sDg93UM1CBTgsDw9lsXOmccYSzVHUfbUL8C+qUJZ1cDZP34kEwbt/q+f9eWtD26vzQ=_0_1'
                                            }
                                        })
                                        .then(response => {
                                            outputDiv.innerHTML += `${counter}. Forbidden<br>`;
                                            counter++;
                                        })
                                    }else{
                                        clearInterval(newIntervalId)
                                    }
                                }, 1000)
                           },
                           (error) => {
                                console.error("Captcha rendering failed:", error);
                           }
                       );

                    } else {
                        outputDiv.innerHTML += `${counter}. Forbidden<br>`;
                        counter++;
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    clearInterval(intervalId); // Stop on error
                    outputDiv.innerHTML += "An error occurred. Please check the console.";
                });

            if (counter > nValue) {
                clearInterval(intervalId);
            }
        }, 1000);
    });
});