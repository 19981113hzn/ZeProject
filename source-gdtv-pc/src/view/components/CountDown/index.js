/* eslint-disable */
import React, { useState } from "react";

export default function CountDown(props) {
    let [countDownTime, setCountDownTime] = useState(null);

    const now = new Date();
    const prefix0 = num => num < 10 ? `0${num}` : `${num}`;
    let countDownFn = (startTime) => {
        let timer = setInterval(() => {
            let nowTime = new Date();
            let time = startTime - nowTime;
            let hour = parseInt(time / 1000 / 60 / 60);
            let minute = parseInt(time / 1000 / 60 % 60);
            let seconds = parseInt(time / 1000 % 60);
            let ret = `${prefix0(hour)}:${prefix0(minute)}:${prefix0(seconds)}`
            setCountDownTime(ret)
        }, 1000)
    }
    countDownFn(props.startTime);

    if (props.startTime < now) return (
        // 已经到开播但是仍未开播
        <div className={props.className}>
            主播正在路上
            <div>请稍候</div>
        </div>
    )

    return (
        <div className={props.className}>
            {`该直播将于${countDownTime}后开始`}
            <div>敬请期待</div>
        </div>
    )
}
