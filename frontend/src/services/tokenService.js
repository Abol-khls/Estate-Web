let accessToken = null;

export const getAccessToken = () => {

    return accessToken;

};

export const saveAccessToken = (token) => {

    accessToken = token;

};

export const clearAccessToken = () => {

    accessToken = null;

};