import React from 'react';
import ReactCropper from 'react-cropper';
import styles from './index.less';

class Cropper extends React.Component {
    consumeAspectRatio = (aspectRatio) => {
        const { width, height } = aspectRatio;
        return {
            label: `${width}*${height}`,
            ratio: width / height
        };
    }

    getCroppedCanvas = () => ({ base64Data: this.cropper.getCroppedCanvas(), value: this.props.value })

    render() {
        const { aspectRatio, value } = this.props;
        const { label, ratio } = this.consumeAspectRatio(aspectRatio);
        return (
            <React.Fragment>
                <p className={styles['cropper-tips']}>最小尺寸{label}，封面避免使用gif、带大量文字、卡通元素</p>
                <div className={styles['cropper-container']}>
                    <ReactCropper
                        zoomable={false}
                        zoomOnWheel={false}
                        zoomOnTouch={false}
                        guides={false}
                        viewMode={2}
                        className={styles.cropper}
                        aspectRatio={ratio}
                        preview={`.${styles['cropper-preview-zone']}`}
                        src={value}
                        ref={c => { this.cropper = c; }}
                    />
                    <div className={styles['cropper-preview-container']}>
                        <p>预览</p>
                        <div className={styles['cropper-preview-zone']} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Cropper;
