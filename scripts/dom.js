import * as format from "./format.js"
import * as charts from "./charts.js"
import * as auth from "./auth.js"
import * as data from "./data.js"
import * as gql from "./graphql.js"

export async function displayHUD(loginModule, HUDModule, token) {
    loginModule.style.display = 'none';
    let primaryData = localStorage.getItem('primary');
    if (primaryData === null) {
        primaryData = await gql.getPrimaryData(token);
        localStorage.setItem('primary', JSON.stringify(primaryData));
    }
    await data.processData(token, primaryData);

    const logout = document.getElementById('logout');
    auth.initLogoutBtn(logout);

    primaryData = localStorage.getItem('primary');
    insertPrimaryData(primaryData);

    const secondaryData = JSON.parse(localStorage.getItem('secondary'));
    const graphData = format.cleanGraphData(secondaryData);
    const lineChartContainer = document.getElementById('graph-1');
    const barChartContainer = document.getElementById('graph-2');
    insertChart(graphData, 'line', lineChartContainer, 1);
    insertChart(graphData, 'bar', barChartContainer, 2);

    HUDModule.style.display = 'flex';
}

export function displayLogin(loginModule, HUDModule) {
    HUDModule.style.display = 'none';
    loginModule.style.display = 'flex';
    const loginForm = document.querySelector('form');
    loginForm.addEventListener('submit', auth.handleLoginForm);
}

export function insertChart(data, chartType, container, chartID) {
    if (chartType === 'line') {
        container.innerHTML = '';
        const chart = charts.lineChart(data, container, chartID)
        container.append(chart)
    }
    if (chartType === 'bar') {
        container.innerHTML = '';
        const chart = charts.barChart(data, container, chartID)
        container.append(chart)
    }
}

export function insertPrimaryData(primaryData) {
    const dataObj = JSON.parse(primaryData);
    const data = (dataObj.data.user)[0];
    const navUsername = document.getElementById('nav-username');
    const profileRank = document.getElementById('profile-rank');
    const rankName = format.getRank(data.userLevel);
    const profileUsername = document.getElementById('profile-username');
    const profileLogin = document.getElementById('profile-login');
    const profileID = document.getElementById('profile-userID');
    const profileLevel = document.getElementById('profile-level-amount');
    const profileXP = document.getElementById('total-XP');
    const roundedXP = (data.totalXP / 1000).toFixed(0);
    const auditsRatio = document.getElementById('audits-ratio');
    const ratioBarDone = document.getElementById('profile-ratioBar-done');
    const totalBarWeight = data.totalDown + data.totalUp;
    const totalDownFormated = (data.totalDown / 1000000).toFixed(2);
    const totalUpFormated = (data.totalUp / 1000000).toFixed(2);
    const doneBarWeight = ((data.totalUp / totalBarWeight) * 100).toFixed(0);
    const auditsCompleted = document.getElementById('audits-completed');
    const auditsRecieved = document.getElementById('audits-recieved');
    const TopSkillsContainer = document.getElementById('profile-skills-list');
    const profileEmail = document.getElementById('profile-email');
    const welcomeName = document.getElementById('welcome-tab-name');

    navUsername.innerHTML = `${data.firstName} ${data.lastName}`;
    profileRank.innerHTML = `${rankName} developer`;
    profileUsername.innerHTML = `${data.firstName} ${data.lastName}`;
    profileLogin.innerHTML = `${data.login}`;
    profileLogin.setAttribute('href', `https://01.kood.tech/git/${data.login}`);
    profileID.innerHTML = `${data.id}`;
    profileLevel.innerHTML = `Level ${data.userLevel}`;
    profileXP.innerHTML = `${roundedXP}`;
    auditsRatio.innerHTML =`${(data.auditRatio).toFixed(1)}`;
    ratioBarDone.style.width = `${doneBarWeight}%`;
    auditsCompleted.innerHTML = `${totalUpFormated} MB`;
    auditsRecieved.innerHTML = `${totalDownFormated} MB`;
    profileEmail.innerHTML = `${data.email}`;
    welcomeName.innerHTML = `Welcome ${data.firstName}!`;

    for (let i = 0; i < 5; i++) {
        let addSkill = data.topSkills[i];
        const newSkillDOM = makeSkillBarDom(addSkill.type, addSkill.amount);
        TopSkillsContainer.appendChild(newSkillDOM);
    }
}

function makeSkillBarDom(skillName, amount) {
    const formatedSkill = format.formatSkillName(skillName);
    let li = document.createElement('li');
    li.classList.add('w-full', 'h-fit', 'px-1', 'profile-skill-list-item')
    let nameContainer = document.createElement('div')
    nameContainer.classList.add('w-max')
    let skillNameHeader = document.createElement('a')
    skillNameHeader.classList.add('text-gray-50', 'font-changa', 'ml-1', 'mb-0', 'select-none', 'relative', 'z-10')
    skillNameHeader.innerHTML = `${formatedSkill}`
    skillNameHeader.style.fontWeight = 500;
    nameContainer.appendChild(skillNameHeader)
    let skillNameUnderline = document.createElement('div');
    skillNameUnderline.id = 'skill-Underline';
    skillNameUnderline.classList.add('w-full', 'ml-1', 'mt-0');
    skillNameUnderline.style.height = '2px';
    skillNameUnderline.style.transform = 'translateY(-6px)';
    nameContainer.appendChild(skillNameUnderline);
    li.appendChild(nameContainer);
    let divBar = document.createElement('div')
    divBar.classList.add('w-full', 'h-6', 'bg-purple-300', 'rounded', 'border-2', 'border-gray-100');
    divBar.id = 'skill-Completion-bg';
    let completionBar = document.createElement('div');
    completionBar.id = 'skill-Completion';
    completionBar.classList.add('bg-purple-500', 'rounded', 'rounded-e', 'h-full', 'flex', 'items-center', 'justify-start')
    completionBar.style.width = `${amount}%`;
    completionBar.style.left = 0;
    let completionAmount = document.createElement('a')
    completionAmount.classList.add('h-min', 'w-fit', 'text-gray-50', 'font-changa', 'align-text-top', 'ml-1', 'select-none')
    completionAmount.style.position = 'relative';
    completionAmount.style.fontWeight = 500;
    completionAmount.style.lineHeight = '17px';
    completionAmount.style.fontStyle = 'italic';
    completionAmount.style.fontSize = '14px';
    completionAmount.style.textWrap = 'nowrap';
    completionAmount.innerHTML = `${amount}%`
    completionBar.appendChild(completionAmount)
    divBar.appendChild(completionBar)
    li.appendChild(divBar);

    return li;
}
