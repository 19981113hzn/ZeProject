export const renderHeader = (helmetStr, isProd, buildPath, loadableState, dependence = '') => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv='Content-Security-Policy' content='block-all-mixed-content'>
            ${helmetStr}
            <meta name="baidu-site-verification" content="7uOfgV8KB5" />
            <meta name="sogou_site_verification" content="RKo6CUD3vK"/>
            <meta name="360-site-verification" content="8fffaf13930370a126f0df0d9469ddd8" />
            <meta name="shenma-site-verification" content="d0fed8bc1c8f00a457963b05612411a2_1502433349" />
            <meta name="google-site-verification" content="u0ka1-HM7dBL9bOQmmJzsWDIlIT8TPtgXmO4ku0fsu8" />
            <script src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
            <link href="//img2-cloud.itouchtv.cn/sitecdn/cdn-lib/cropper/cropper.min.css" rel="stylesheet">
            <link href="//img2-cloud.itouchtv.cn/sitecdn/cdn-lib/antd/3.26.4/antd.min.css" rel="stylesheet">
            ${dependence}
            ${isProd ? '<link href="' + buildPath['client.css'] + '" rel="stylesheet" />' : '<link href="/dist/html/css/client.chunk.css" rel="stylesheet" />'}
            ${isProd ? '<link href="' + buildPath['vendor.css'] + '" rel="stylesheet" />' : ''}
        `;

export const renderFooter = (loadableState = {}, preloadedState, isProd, buildPath, htmlStr) => {
    if (isProd) {
        return `
            </head>
            <body>
                <div id="root">${htmlStr}</div>
                <script>
                    window.__PRELOADED_STATE__ = ${preloadedState}
                </script>
                <script src="${buildPath['manifest.js']}"></script>
                <script src="${buildPath['vendor.js']}"></script>
                <script src="${buildPath['commons.js']}"></script>
                <script src="${buildPath['client.js']}"></script>            
                <script type="text/javascript">
                    var cnzz_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
                    document.write(unescape("%3Cspan id='cnzz_stat_icon_1278159012'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "w.cnzz.com/q_stat.php%3Fid%3D1278159012' type='text/javascript'%3E%3C/script%3E"));
                </script>
            </body>
        </html>`;
    }

    return `
            ${loadableState.linkTag.join('/n')}
            ${loadableState.scriptTag.join('/n')}
        </head>
        <body>
            <div id="root">${htmlStr}</div>
            <script>
                window.__PRELOADED_STATE__ = ${preloadedState}
            </script>
            <script src="/dist/html/manifest.js"></script> 
            <script src="/dist/html/vendor.js"></script>
            <script src="/dist/html/client.js"></script>              
        </body>
    </html>`;
};
