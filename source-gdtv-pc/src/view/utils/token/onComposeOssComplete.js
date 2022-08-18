const R = require('ramda');

const onComposeOssComplete = (res) => R.pickAll(['hash', 'key', 'name', 'sourceLink'])(res);

export default onComposeOssComplete;
