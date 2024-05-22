import * as dom from "./scripts/dom.js"
import * as auth from "./scripts/auth.js"

document.addEventListener('DOMContentLoaded', async () => {
    const loginModule = document.getElementById('login-form')
    const HUDModule = document.getElementById('HUD')
    const token = localStorage.getItem('token')

    if (!auth.isTokenValid(token)) {
        dom.displayLogin(loginModule, HUDModule);
    } else {
        await dom.displayHUD(loginModule, HUDModule, token);
    }
});