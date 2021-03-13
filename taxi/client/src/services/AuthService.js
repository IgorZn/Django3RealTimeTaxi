export const getUser = () => {

    // {
    //   "id": 1,
    //   "username": "jason.parent@example.com",
    //   "first_name": "Jason",
    //   "last_name": "Parent",
    //   "group": "rider",
    //   "photo": "/media/images/image.jpg"
    // }

    const auth = JSON.parse(window.localStorage.getItem('taxi.auth'));
    if (auth) {
        const [,payload,] = auth.access.split('.');
        const decoded = window.atob(payload);
        return JSON.parse(decoded);
    }
    return undefined;
};

export const isDriver = () => {
    const user = getUser();
    return user && user.group === 'driver';
};

export const isRider = () => {
    const user = getUser();
    return user && user.group === 'rider';
};

export const getAccessToken = () => {
    const auth = JSON.parse(window.localStorage.getItem('taxi.auth'));
    if (auth) {
        return auth.access;
    }
    return undefined;
};