import React from 'react';
import { urlParams } from 'Utils/utils';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (urlParams().code) {
            const { code } = urlParams();
            window.opener.postMessage({ code, target: 'www.gdtv.cn' }, '*');
            window.close();
        }
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default LoginPage;
