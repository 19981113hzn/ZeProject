import { createSelector } from 'reselect';

const accountSelector = (state) => state.get('account');

export default createSelector(accountSelector, (account) => ({
    isRequesting: account.get('isRequesting'),
    userInfo: account.get('userInfo'),
    dateList: account.get('dateList'),
    historyByDate: account.get('historyByDate')
}));
