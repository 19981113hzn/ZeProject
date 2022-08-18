/**
 * 将一维数组按顺序转化为二维数组
 * @param {*} array 原数组
 * @param {*} size 子节点容量
 */
export function composeArray(array = [], size = 2) {
    const list = [];
    let child = [];
    for (let i = 0; i < array.length; i += 1) {
        child.push(array[i]);
        if (i + 1 === array.length) {
            list.push(child);
            break;
        }
        if ((i + 1) % size === 0) {
            list.push(child);
            child = [];
        }
    }
    return list;
}

/**
 * 补全数组
 * @param {*} array 原数组
 * @param {*} size 容量
 */
export function completionArray(array = [], size = 0, on = false) {
    if (!on || array.length >= size) return array;
    const list = [];
    for (let i = 0; i < size; i += 1) {
        const e = array[i];
        if (e) {
            list.push(e);
        } else {
            list.push(undefined);
        }
    }
    return list;
}

export const SCREEN_SIZE = ['xxl', 'xl', 'xs'];

/** 确定浏览器宽度范围 */
export function getScreenRange() {
    const { innerWidth } = window;
    return {
        [SCREEN_SIZE[0]]: innerWidth >= 1600,
        [SCREEN_SIZE[1]]: innerWidth >= 1200 && innerWidth < 1600,
        [SCREEN_SIZE[2]]: innerWidth < 1200,
    };
}

/**
 * 栅格化数组
 * @param {*} array 原数组
 * @param {*} col 列数
 */
export function gridArray(array = [], col) {
    col = Math.ceil(col);
    if (col <= 1) {
        return [];
    }
    const list = [];
    for (let i = 0; i < col; i += 1) {
        list.push([]);
    }
    array.forEach((item, index) => {
        const i = index % col;
        list[i].push(item);
    });
    return list;
}

/**
 * 交换数组位置
 * @param {*} arr 
 * @param {*} i1 
 * @param {*} i2 
 */
export const swapPoiArray = (arr, i1, i2) => {
    const result = Array.from(arr);
    const [removed] = result.splice(i1, 1);
    result.splice(i2, 0, removed);
    return result;
};
