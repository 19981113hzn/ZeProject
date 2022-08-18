import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

process.env.NODE_ENV === 'production' && Sentry.init({
    dsn: 'https://f6d6a6129a41486e932e86ad348afb17@sentry.itouchtv.cn/38',
    sampleRate: 0.25
});
