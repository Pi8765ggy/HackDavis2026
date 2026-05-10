import { createApp } from 'vue'
import App from './App.vue'
import { createAuth0 } from '@auth0/auth0-vue'
import router from './router.js'
import './assets/styles.css';

const app = createApp(App)

app.use(
    createAuth0({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        cacheLocation: "localstorage",
        useRefreshTokens: true,
        useRefreshTokensFallback: true,
        authorizationParams: {
            redirect_uri: window.location.origin,
            audience: 'garden-api',
            scope: 'openid profile email offline_access'
        }
    })
)
app.use(
    router
)
app.mount('#app')
