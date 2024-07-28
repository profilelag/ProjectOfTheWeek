const code = (new URLSearchParams(window.location.search)).get('code');
if(!code && !document.cookie.includes("token=")) window.location.href = '/';
var token = document.cookie.split("token=")[1];
if(code) axios.get(`/genToken?code=${code}`).then(res => {
    const body = res.data
    if(!body) return window.location.href = '/';
    document.cookie = "token="+body+";path=/";
    window.location.href = '/submit';
});

axios.get("https://api.github.com/user", {
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
.then(res => {
    $("#welcome")[0].innerHTML = `Welcome, ${res.data.name}!`
    axios.get("https://api.github.com/user/repos", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(repos => {
        repos.data.filter(x => x.owner.login == res.data.login).forEach(repo => {
            $("#projects")[0].innerHTML += `<div class="project">${repo.full_name}</div>`
        })
    })
}).catch(err => {
    console.log(err)
    window.location.href = '/';
})
