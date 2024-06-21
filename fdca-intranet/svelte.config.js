import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte'],
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [vitePreprocess()],

    vitePlugin: {
        inspector: true,
    },
    kit: {
adapter: adapter(),
csp: {
    directives: {
        'default-src': ['self'],
        'script-src': ['self', 'https://apis.google.com', 'https://*.cloudflare.com', 'https://ajax.cloudflare.com', 'unsafe-inline', 'static.cloudflareinsights.com', 'https://*.googleapis.com'],
        'style-src': ['self', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css' , 'unsafe-inline'],
        'img-src': ['self', 'data:', 'https://as1.ftcdn.net', 'https://*.discordapp.com', 'https://lh3.googleusercontent.com'],
        'object-src': ['none'],
        'connect-src': ['self', 'https://firestore.googleapis.com', 'https://identitytoolkit.googleapis.com', 'cloudflareinsights.com', 'https://*.googleapis.com'],
        'frame-src': ['https://discord.com', 'https://fdca-intranet-dev-test.firebaseapp.com']
    },
    reportOnly: {
        'default-src': ['self'],
        'script-src': ['self', 'https://apis.google.com', 'https://*.cloudflare.com', 'https://ajax.cloudflare.com', 'unsafe-inline', 'static.cloudflareinsights.com', 'https://*.googleapis.com'],
        'style-src': ['self', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css' , 'unsafe-inline'],
        'img-src': ['self', 'data:', 'https://as1.ftcdn.net', 'https://*.discordapp.com', 'https://lh3.googleusercontent.com'],
        'object-src': ['none'],
        'connect-src': ['self', 'https://firestore.googleapis.com', 'https://identitytoolkit.googleapis.com', 'cloudflareinsights.com', 'https://*.googleapis.com'],
        'frame-src': ['https://discord.com', 'https://fdca-intranet-dev-test.firebaseapp.com'],
        'report-uri': ['/api/report-violation']
    }
}
    }
};
export default config;