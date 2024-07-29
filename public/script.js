axios.get("/prompt").then((response) => $("#idea")[0].innerHTML = response.data);
const searchParams = new URLSearchParams(window.location.search);
if(searchParams.has("error")) $("#desc")[0].innerHTML = "An error occurred. Please try again later.";
if(searchParams.has("message")) $("#desc")[0].innerHTML = searchParams.get("message");
const seconds = Math.floor((new Date().getTime())/1000)
const endDate = 259200+(Math.floor((seconds-259200)/604800)+1)*604800;
const updateTimer = () => {
    const now = Math.floor((new Date().getTime())/1000);
    const timeLeft = endDate-now;
    const days = Math.floor(timeLeft/86400);
    const hours = Math.floor((timeLeft%86400)/3600);
    const minutes = Math.floor((timeLeft%3600)/60);
    const seconds = timeLeft%60;
    $("#timer")[0].innerHTML = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}
updateTimer()
setInterval(updateTimer, 1000)

axios.get("/showcase").then((response) => {
    const showcaseHTML = response.data.map((item) => `<div class="project"><p class="author">${item.author}</p><a href="${item.github}" target="_blank">Github Project</a></div>`);
    $("#showcase")[0].innerHTML = showcaseHTML.join("");
})

$("#submit-button")[0].addEventListener("click", () => {
    if(document.cookie.includes("token="))
        return window.location.href="/submit";
    
    window.location.href="/login";
})