import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        console.log('componentDidCatch', error, info);
        this.props.history.replace('/404');
    }

    render() {
        return this.props.children;
    }
}

export default ErrorBoundary;
