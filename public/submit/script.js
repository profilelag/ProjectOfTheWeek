const code = (new URLSearchParams(window.location.search)).get('code');
if(!code && !document.cookie.includes("token=")) window.location.href = '/';

if(code) axios.get("/genToken?code=" + code)