const code = (new URLSearchParams(window.location.search)).get('code');
if(!code && !document.cookie.includes("token=")) window.location.href = '/';

if(code) axios.get(`/genToken?code=${code}`).then(res => {
    const body = res.data
    if(!body) return window.location.href = '/';
    document.cookie = "token="+body+";path=/";
});

const token = document.cookie.split("token=")[1];

axios.get("https://api.github.com/user", {
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
.then(res => {
    $("#welcome")[0].innerHTML = `Welcome, ${res.data.name}!`
})