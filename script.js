document.getElementById("captchaForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const N = parseInt(document.getElementById("number").value);
    if (N < 1 || N > 1000) {
        alert("Please enter a number between 1 and 1000.");
        return;
    }
    document.getElementById("captchaForm").style.display = "none";
    showMyCaptcha(N);
});

function showMyCaptcha(N) {
    const container = document.querySelector("#my-captcha-container");
    container.style.display = "block";

    AwsWafCaptcha.renderCaptcha(container, {
        apiKey: window.WAF_API_KEY,
        onSuccess: (wafToken) => captchaSuccessFunction(wafToken, N),
        onError: captchaErrorFunction,
    });
}

function captchaSuccessFunction(wafToken, N) {
    const output = document.getElementById("output");
    document.getElementById("my-captcha-container").style.display = "none";
    output.innerHTML = "";

    async function sendRequests() {
        for (let i = 1; i <= N; i++) {
            try {
                const response = await fetch("https://api.prod.jcloudify.com/whoami", {
                    method: "GET",
                    headers: { "x-amz-captcha-token": wafToken },
                });

                if (response.status === 403) {
                    output.innerHTML += `<p>${i}. Forbidden</p>`;
                } else if (response.ok) {
                    const data = await response.json();
                    output.innerHTML += `<p>${i}. ${JSON.stringify(data)}</p>`;
                } else {
                    output.innerHTML += `<p>${i}. Unexpected Response: ${response.status}</p>`;
                }
            } catch (error) {
                output.innerHTML += `<p>${i}. Error: ${error.message}</p>`;
            }

            // Scroll to the latest message
            output.scrollTop = output.scrollHeight;

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    sendRequests();
}

function captchaErrorFunction(error) {
    alert("Error with captcha: " + error.message);
}
