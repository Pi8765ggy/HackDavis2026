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
                    // Currently using a static zipcode. TODO: Read from user input
                    zipcode: "95616"
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
    const createPlant = async () => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'garden-api'
                }
            })
            console.log("Created token")
            const res = await fetch("http://localhost:3000/api/plants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: "planty mcplantface",
                    date_planted: "today!"
                })
            })
            if (!res.ok) {
                throw new Error("Response error")
            }
            const data = await res.json()
            console.log(data)
        } catch (err) {
            console.error("Error catch executed.")
            console.error(err)
        }
    }
    const getPlant = async () => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'garden-api'
                }
            })
            console.log("Created token")
            const res = await fetch("http://localhost:3000/api/plants", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            if (!res.ok) {
                throw new Error("Response error")
            }
            const data = await res.json()
            console.log(data)
        } catch (err) {
            console.error("Error catch executed.")
            console.error(err)
        }
    }

    const chatbot = async () => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'garden-api'
                }
            })
            console.log("Created token")
            const res = await fetch("http://localhost:3000/api/ai/", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: "What plants should i grow to eat?"
                })
            })
            if (!res.ok) {
                throw new Error("Reponse error")
            }
            const data = await res.text()
            console.log(data)

        } catch (err) {
            console.error("Error catch executed.")
            console.error(err)
        }
    }

    const promptExa = async () => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'garden-api'
                }
            });
            console.log("Created token")
            const res = await fetch("http://localhost:3000/api/ai/user", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: "What plants do I have growing right now?"
                })
            })
            if (!res.ok) {
                throw new Error("Response error")
            }
            const data = await res.text()
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
    <header>
        <img src="../images/logo-full.svg" alt="gardinspiration logo" id="logo">
        <img src="../images/user-icon.svg" alt="user icon" id="user">
    </header>

    <h1>Dev Page</h1>

    <div v-if="isLoading">
        <p>Loading...</p>
    </div>

    <div v-else-if="!isAuthenticated">
        <button @click="login">Login</button>
    </div>

    <div v-else>
        <p>You are logged in.</p>
        <button @click="logout">Logout</button>
        <button @click="createUser">Create User</button>
        <button @click="createPlant">Create Plant</button>
        <button @click="getPlant">Get Plants</button>
        <button @click="chatbot">chatbot (click create user first)</button>
        <button @click="promptExa">Prompt</button>
    </div>

</template>

<style scoped></style>
