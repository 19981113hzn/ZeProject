import React from 'react';
import styles from './index.less';
import AdCard from '../AdCard';

export default class FullAd extends React.Component {
    constructor() {
        super();
        this.state = {
            // visible: false,
            // duration: 0
        };
    }

    render() {
        const {
            sourceData,
            addInnerAdCount = () => {}
        } = this.props;

        // const { visible } = this.state;

        const layoutStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 0
        };

        return <div className={styles.fullAd}>
            {<AdCard
                addInnerAdCount={addInnerAdCount}
                isFullAd={true}
                sourceData={sourceData}
                layoutStyle={layoutStyle}
                showDuration={true}
                type={'undefined'}/>}
        </div>;
    }
}
