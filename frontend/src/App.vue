<script setup lang="ts">
  import { useAuth0 } from '@auth0/auth0-vue'
  import { ref } from 'vue'

  const userID = ref("default")

  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
    logout: auth0Logout,
    user
  } = useAuth0()
  
  const signup = () =>
    loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
  
  const login = () => loginWithRedirect()
  
  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } })
    
  const token = await getAccessTokenSilently()

  const test = async () => {
    try{
        const res = await fetch("http://localhost:3000/api/ai", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        if (!res.ok) {
            userID.value = "Bad!"
            throw new Error("Login auth fail")
        }

        const data = await res.json()

        userID.value = data.user
    } catch (err) {
        throw new err
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
    <p>{{ userID.value }}</p>
  </div>

  <div v-else>
    <p v-if="error">Error: {{ error.message }}</p>

    <button @click="signup">Signup</button>

    <button @click="login">Login</button>
  </div>
</template>
<style scoped></style>
