<script setup lang="ts">
  import { useAuth0 } from '@auth0/auth0-vue'

  import { ref } from 'vue'

  const userID = ref("default")
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


  const test = async () => {
    try{
        let token = null
        if (isAuthenticated.value && !isLoading.value) {
            console.log("attempting token get")
            token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'garden-api'
                }
            })
            console.log("token got!")
        }

        const res = await fetch("http://localhost:3000/api/ai", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!res.ok) {
            userID.value = "Bad!"
            throw new Error(token)
        }

        const data = await res.json()

        userID.value = data.user
    } catch (err) {
        console.error("Error catch executed.")
        console.error("Erorr: ", err)
    }
  }
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>

  <!-- AUTH0 -->

  <div v-if="isLoading">Loading...</div>

  <div v-else-if="isAuthenticated && user">
    <p>Logged in as {{ user.email }}</p>

    <h1>User Profile</h1>

    <pre>{{ JSON.stringify(user, null, 2) }}</pre>

    <button @click="logout">Logout</button>
    <button @click="test">BIG RED BUTTON</button>

    <h1>{{ userID.value }}</h1>

  </div>

  <div v-else>
    <p v-if="error">Error: {{ error.message }}</p>

    <button @click="signup">Signup</button>

    <button @click="login">Login</button>
  </div>
</template>

<style scoped></style>
