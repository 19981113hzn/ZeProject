export default function env() {
    const isProd = process.env.NODE_ENV !== 'development';
    return isProd;
}
