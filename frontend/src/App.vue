<script setup></script>

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
  </div>

  <div v-else>
    <p v-if="error">Error: {{ error.message }}</p>

    <button @click="signup">Signup</button>

    <button @click="login">Login</button>
  </div>
</template>
<style scoped></style>
<script setup lang="ts">
  import { useAuth0 } from '@auth0/auth0-vue'
  
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
</script>
