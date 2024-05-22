const JWT_AP = 'https://01.kood.tech/api/auth/signin';
const EXPIRE_TIME = 10; // In minutes

export async function handleLoginForm(event) {
    event.preventDefault();
    const email = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
    let isValidReq = true;
    if (email.length < 1 || password.length < 1) {
        isValidReq = false;
        displayLoginError("Please fill in all the fields");
    }
    if (isValidReq) {
        try {
            const jwtToken = await getJWT(email, password);
            setNewToken(jwtToken);
        } catch(err) {
            displayLoginError(err);
        }
    }
}

export function isTokenValid(token) {
    if (token === null) {
        return false;
    }
    if (isExpiredToken(token)) {
        window.location.reload();
        return false;
    }
    return true;
}

export function initLogoutBtn(btn) {
    btn.addEventListener('click', () => {
        handleClientLogout();
    });
    const btn2 = btn.cloneNode(true);
    btn2.id = 'logout2';
    const logout2dest = document.getElementById('logout2');
    logout2dest.appendChild(btn2);
    logout2dest.addEventListener('click', () => {
        handleClientLogout();
    });
}

export function isExpiredToken(token) {
    const tokenExpires = JSON.parse(token).expire;
    const now = new Date().getTime();
    if (now > tokenExpires) {
        localStorage.clear();
        return true;
    } else {
        return false;
    }
}

export function displayLoginError(errMsg) {
    const errDom = document.getElementById('auth-error');
    errDom.style.opacity = 1;
    const msgDom = errDom.querySelector('p');
    msgDom.innerHTML = errMsg;
    setTimeout(() => {
        errDom.style.opacity = 0;
        msgDom.innerHTML = '';
    },2500)
}

export async function getJWT(username, password) {
    const encodedData = btoa(`${username}:${password}`);
    const JWTrequest = await fetch(JWT_AP, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encodedData}`,
            'Content-Type': 'application/json',
        },
    });
    if (JWTrequest.ok) {
        const token = await JWTrequest.json();
        return token;
    } else {
        throw "Invalid Credentials";
    }
}

export function setNewToken(token) {
    const expire = new Date().getTime() + (60000*EXPIRE_TIME);
    localStorage.setItem('token', JSON.stringify({value: token, expire}));
    window.location.reload();
}

export function handleClientLogout() {
    localStorage.clear();
    window.location.reload();
}