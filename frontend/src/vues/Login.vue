<script setup>
  import { useAuth0 } from '@auth0/auth0-vue'
  import { onMounted } from 'vue'

  const signup = () => loginWithRedirect({ authorizationParams: { screen_hint: 'signup', audience: "garden-api" } })

  const login = () => loginWithRedirect({
        authorizationParams: {
            audience: "garden-api"
        }
  })

  onMounted(() => {
    login()
  })

</script>
<template></template>
<style scoped></style>
