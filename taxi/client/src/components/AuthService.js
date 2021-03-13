export const getAccessToken = () => {
    const auth = JSON.parse(window.localStorage.getItem('taxi.auth'));
    if (auth) {
        return auth.access;
    }
    return undefined;
};