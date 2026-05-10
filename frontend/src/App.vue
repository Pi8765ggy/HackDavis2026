<script setup lang="ts">
  import { useAuth0 } from '@auth0/auth0-vue'

  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    error,
    loginWithRedirect,
    logout: auth0Logout,
    user
  } = useAuth0()

  const signup = () => loginWithRedirect({ authorizationParams: { screen_hint: 'signup', audience: "garden-api" } })

  const login = () => loginWithRedirect({
        authorizationParams: {
            audience: "garden-api"
        }
  })

  const logout = () => auth0Logout({ logoutParams: { returnTo: window.location.origin } })
    /*

    This code block serves as an example of how to fetch data from a specific endpoint.

  const test = async () => {
    try{
        let token = null
        if (isAuthenticated.value && !isLoading.value) {
            token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'garden-api'
                }
            })
        }
        const res = await fetch("http://localhost:3000/api/ai", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!res.ok) {
            throw new Error("Response is bad from fetch.")
        }

        const data = await res.json()
    } catch (err) {
        console.error("Error catch executed.")
        console.error("Erorr: ", err)
    }
  }*/

  // You can define a router link to another page like this:
  // <<router-link to="/path/defined/in/router.js">Text To Show</router-link>
</script>

<template>
    <div class="app">
        <main><router-view /></main>
    </div> 
</template>

<style scoped></style>
