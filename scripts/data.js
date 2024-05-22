import * as gql from "./graphql.js"
import * as format from "./format.js"

export function appendToPrimaryData(key, value) {
    let primaryData = JSON.parse(localStorage.getItem('primary'));
    primaryData.data.user[0][key] = value;
    localStorage.setItem('primary', JSON.stringify(primaryData));
}

export async function processData(token, primaryData) {
    primaryData = JSON.parse(localStorage.getItem('primary'));
    const userId = primaryData.data.user[0].id;
    const userLevel = await gql.getUserLevel(token, userId);
    appendToPrimaryData("userLevel", userLevel.data.transaction[0].amount);
    const topSkills = await gql.getTopSkills(token);
    const cleanedTopSkills = format.cleanData(topSkills);
    appendToPrimaryData("topSkills", cleanedTopSkills);
    const userXpTransactions = await gql.getUserXP(token);
    const totalXP = userXpTransactions.data.transaction.reduce((sum, cur) => sum + cur.amount, 0);
    appendToPrimaryData("totalXP", totalXP);
    localStorage.setItem('secondary', JSON.stringify(userXpTransactions));
}