import React from 'react';
import LazyLoad from 'react-lazyload';
import styles from './index.less';

class ImageLoad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            attempts: 0
        };
    }

    render() {
        const {
            src, className, isLazyLoad = true, onload
        } = this.props;
        return (
            <div className={[styles.image, className].join(' ')}>
                {isLazyLoad &&
                    <LazyLoad once>
                        <img src={src} alt='' crossOrigin='anonymous' onLoad={onload}/>
                    </LazyLoad>
                }
                {!isLazyLoad && <img src={src} alt='' crossOrigin='anonymous' onLoad={onload}/>}
            </div>
        );
    }
}

export default ImageLoad;
