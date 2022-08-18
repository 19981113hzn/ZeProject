import React from 'react';
import Helmet from 'react-helmet';
import { wxSharePost } from 'Utils/weixin';

class HelmetSEO extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.title !== this.props.title
            || prevProps.description !== this.props.description
            || prevProps.imgUrl !== this.props.imgUrl
        ) {
            this.handleSetWxShare();
        }
    }

    componentDidMount() {
        this.handleSetWxShare();
    }

    handleSetWxShare = () => {
        const {
            title = '荔枝网',
            description,
            imgUrl
        } = this.props;
        wxSharePost({ title, desc: description || ' ', imgUrl });
    }

    render() {
        const {
            title = '荔枝网',
            keywords = '荔枝网',
            description = '荔枝网'
        } = this.props;

        return (
            <Helmet>
                <title>{title}</title>
                <meta name='title' content={title} />
                <meta name='keywords' content={keywords} />
                <meta name='description' content={description} />
            </Helmet>
        );
    }
}

export default HelmetSEO;
