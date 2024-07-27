axios.get("/prompt").then((response) => $("#idea")[0].innerHTML = response.data);
const seconds = Math.floor((new Date().getTime())/1000)
const endDate = 259200+(Math.floor((seconds-259200)/604800)+1)*604800;
setInterval(() => {
    const now = Math.floor((new Date().getTime())/1000);
    const timeLeft = endDate-now;
    const days = Math.floor(timeLeft/86400);
    const hours = Math.floor((timeLeft%86400)/3600);
    const minutes = Math.floor((timeLeft%3600)/60);
    const seconds = timeLeft%60;
    $("#timer")[0].innerHTML = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
})