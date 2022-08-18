import React from 'react';
import * as R from 'ramda';
import { Tabs } from 'antd';

import { IMAGE_UPLOAD_TABKEY } from '../constants';

const { TabPane } = Tabs;

export default class TabContainer extends React.PureComponent {
    render() {
        const {
            dataSource,
            current,
            render,
            tabKey,
            onTabChange,
            onItemClick
        } = this.props;

        return dataSource
            ? (
                <Tabs onChange={onTabChange} activeKey={tabKey}>
                    <TabPane tab='正文图片' key={IMAGE_UPLOAD_TABKEY.CONTENT}>
                        {dataSource?.map(({ id, imgUrl }) => (
                            <ImageItem
                                selected={R.equals(current, imgUrl)}
                                key={imgUrl}
                                src={imgUrl}
                                onClick={() => onItemClick(imgUrl)}
                            />
                        ))}
                    </TabPane>
                    <TabPane tab='本地上传' key={IMAGE_UPLOAD_TABKEY.UPLOAD}>
                        {render()}
                    </TabPane>
                </Tabs>
            ) : render();
    }
}
