export function formatDisplayDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;
    const formatedDay = day < 10 ? `0${day}` : day;
    const formatedMonth = month < 10 ? `0${month}` : month;

    return `${formatedDay}.${formatedMonth}.${year}`;
}

export function cleanData(data) {
    const dataArr = data.data.transaction;
    const cleanedData = Array.from(dataArr.reduce((acc, obj) => {
        if (!acc.has(obj.type) || obj.amount > acc.get(obj.type).amount) {
            acc.set(obj.type,obj);
        }
        return acc;
    }, new Map()).values());

    return cleanedData;
}

export function getRank(level) {
    if (level < 10) {
        return "Aspiring";
    }
    if (level < 20) {
        return "Beginner";
    }
    if (level < 30) {
        return "Apprentice";
    }
    if (level < 40) {
        return "Assistant";
    }
    if (level < 50) {
        return "Basic";
    }
    if (level < 55) {
        return "Junior";
    }
    if (level < 60) {
        return "Confirmed";
    }
    return "Full-Stack";
}

export function formatSkillName(skill) {
    let formated = skill.slice(6);
    switch (formated) {
        case 'go':
            return 'GoLang';
        case 'js':
            return 'Javascript';
        case 'html':
            return 'Html';
        case 'css':
            return 'Css';
        case 'docker':
            return 'Docker';
        case 'algo':
            return 'Algorithms';
        case 'front-end':
            return 'Frontend';
        case 'back-end':
            return 'Backend';
        case 'stats':
            return 'Statistics';
        case 'game':
            return 'Game';
        default:
            return formated;
    }
}

export function cleanGraphData(data) {
    const dataArr = data.data.transaction;
    let dataCleaned = [];
    for (let i = 0; i < dataArr.length; i++) {
        let dataPoint = {};
        dataPoint.XP = dataArr[i].amount;
        dataPoint.Time = new Date(dataArr[i].createdAt);
        dataPoint.Name = dataArr[i].object.name;
        dataPoint.TimeDisplay = formatDisplayDate(new Date(dataArr[i].createdAt));
        dataCleaned.push(dataPoint);
    }

    return dataCleaned;
}