import React from 'react';
import { matchPath } from 'react-router-dom';

const NotFound = () => <div>404</div>;

const getActiveRoute = (Routes = [], path = '') => {
    // 根据请求的path来匹配到对应的component
    const activeRoute = Routes
        .find(route => matchPath(path, route))
        || { Component: () => NotFound }; // 找不到对应的组件时返回NotFound组件
    return activeRoute;
};

export default getActiveRoute;
