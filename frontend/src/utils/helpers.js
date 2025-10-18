import { APP_MESSAGES } from './messages.js';

export const defaultAvatar = (letter) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
    <rect width="50" height="50" fill="#ccc"/>
    <text x="50%" y="50%" font-size="24" text-anchor="middle" dominant-baseline="central" fill="#000">${letter}</text>
  </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const getAvatar = (userData) => {
    if (!userData) return defaultAvatar('U');
    if (userData.profilePicture) return userData.profilePicture;
    return defaultAvatar(userData.username?.charAt(0).toUpperCase() || APP_MESSAGES.UNKNOWN_USER.charAt(0));
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return APP_MESSAGES.JUST_NOW;
    if (minutes < 60) return APP_MESSAGES.MINUTES_AGO(minutes);
    if (hours < 24) return APP_MESSAGES.HOURS_AGO(hours);
    if (days < 7) return APP_MESSAGES.DAYS_AGO(days);
    return date.toLocaleDateString('fr-FR');
};
