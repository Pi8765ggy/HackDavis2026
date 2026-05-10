<script setup>
    import { useAuth0 } from '@auth0/auth0-vue'
    import { ref, onMounted } from 'vue'

    const {
        isLoading,
        isAuthenticated,
        getAccessTokenSilently,
        error,
        loginWithRedirect,
        logout: auth0Logout,
        user
    } = useAuth0()

    const login = () => loginWithRedirect({
        authorizationParams: {
            audience: "garden-api"
        }
    })
    const logout = () => auth0Logout({ logoutParams: { returnTo: window.location.origin } })
    const signup = () => loginWithRedirect({ authorizationParams: { screen_hint: 'signup', audience: "garden-api" } })

    const createUser = async () => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'garden-api'
                }
            })
            console.log("Created token")
            const res = await fetch("http://localhost:3000/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    zipcode: "95616",
                    zone_code: "7a"
                })
            })
            if (!res.ok) {
                throw new Error("Reponse error")
            }
            const data = await res.json()

            console.log(data)

        } catch (err) {
            console.error("Error catch executed.")
            console.error(err)
        }
    }

    onMounted(async () => {
    })

</script>

<template>

    <h1>Dev Page</h1>

    <div v-if="isLoading">
        <p>Loading...</p>
    </div>

    <div v-else-if="!isAuthenticated">
        <button @click="login">Login</button>
    </div>

    <div v-else>
        <p>You are logged in.</p>
        <button @click="createUser">Create User</button>
    </div>

</template>

<style scoped></style>
