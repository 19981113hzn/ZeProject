import Cookie from 'js-cookie';

/**
 * 本地存储
 */
export function saveLocal(key, data) {
    Cookie.set(key, data, { expires: 7 });
    if (typeof window === 'object') {
        const str = typeof data === 'object' ? JSON.stringify(data) : data;
        localStorage.setItem(key, str);
    }
}

/**
 * 取本地
 */
export function getLocal(key) {
    const data = typeof window === 'object' && localStorage.getItem(key) || Cookie.get(key);
    try {
        return data ? JSON.parse(data) : undefined;
    } catch (error) {
        return data;
    }
}
