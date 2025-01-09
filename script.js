document.getElementById("captchaForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const N = parseInt(document.getElementById("number").value);
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
                const response = await fetch("...WAF-protected URL...", {
                    method: "GET",
                    headers: { "x-amz-captcha-token": wafToken },
                });
                const data = await response.json();
                if (data.type === "403 FORBIDDEN") {
                    output.innerHTML += `<p>${i}. ${data.message}</p>`;
                }
            } catch (error) {
                output.innerHTML += `<p>${i}. Error occurred</p>`;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    sendRequests();
}

function captchaErrorFunction(error) {
    alert("Error with captcha: " + error.message);
}
