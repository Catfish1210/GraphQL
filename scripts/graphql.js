const GQL_AP = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
const GQL_QUERIES = {
    primary: `
    {  
        user {
            id
            login
            createdAt
            auditRatio
            campus
            email
            firstName
            lastName
            totalUp
            totalDown
        }
    }`,
    userLevel: (userID) => `
    {  
        transaction(
            where: {userId: {_eq: "${userID}"}, type: {_eq: "level"}, object: {type: {_regex: "project"}}},
            order_by: {amount: desc},
            limit: 1,
        ) {
            amount
        }
    }`,
    userXP: `
    {  
        transaction(
            where: {type: {_eq: "xp"}, object: {type: {_eq: "project"}}},
            order_by: {createdAt: desc},
        ) {
            amount
            object {
                name
            }
            createdAt
        }
    }`,
    topSkills: `
    {  
        transaction(
            where: {type: {_ilike: "%skill%"}},
            order_by: {amount: desc}
        ) {
            type
            amount
        }
    }`
};

export async function getPrimaryData(token) {
    const query = GQL_QUERIES.primary;
    return await fetchGQL(token, query);
}

export async function getUserLevel(token, userID) {
    const query = GQL_QUERIES.userLevel(userID);
    return await fetchGQL(token, query);
}

export async function getUserXP(token) {
    const query = GQL_QUERIES.userXP;
    return await fetchGQL(token, query);
}

export async function getTopSkills(token) {
    const query = GQL_QUERIES.topSkills;
    return await fetchGQL(token, query);
}

export async function fetchGQL(token, query) {
    const tokenObj = JSON.parse(token);
    try {
        const response = await fetch(GQL_AP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenObj.value}`
            },
            body: JSON.stringify({query})
        });
        if (!response.ok) {
            throw new Error(`GraphQL request failed with status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[fetchGQL] Error: ", error);
        throw error;
    }
}