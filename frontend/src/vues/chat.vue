<script setup>
    import { useAuth0 } from '@auth0/auth0-vue'
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const {
        getAccessTokenSilently,
        error,
        loginWithRedirect,
        logout: auth0Logout,
        user
    } = useAuth0()
    
    const loadingResp = ref(false)
    const notLiveprompt = ref("")
    const livePrompt = ref("")
    const response = ref("")
    const promptExa = async () => {
        if (loadingResp.value) {
            return;
        }
        loadingResp.value = true;
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'garden-api'
                }
            });
            console.log("Token created.")
            notLiveprompt.value = livePrompt.value
            console.log(token)
            const res = await fetch("http://localhost:3000/api/ai/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: notLiveprompt.value
                })
            });
            if (!res.ok) {
                throw new Error(res.error)
            }
            const data = await res.json()
            console.log(data)

            response.value = data.answer

        } catch (err) {
            console.error(err)
        } finally {
            loadingResp.value = false
        }
    }

</script>

<template>
    <header>
        <RouterLink to='/'>
            <img src="../images/logo-full.svg" alt="gardinspiration logo" id="logo">
        </RouterLink>
        <div id="user">
            <p>Welcome back, {{ user.name }}!</p>
            <RouterLink to='/garden'>
                <img :src="user.picture" alt="user icon" referrerpolicy="no-referrer">
            </RouterLink>
        </div>
    </header>

    <div id="chatField">
        <div id="texts">
            <p class="prompt">{{ notLiveprompt }}</p>

            <p class="bot" v-if="!loadingResp">{{ response }}</p>
            <p class="bot" v-else>Thinking...</p>

        </div>

        <form @submit.prevent="promptExa">
            <input v-model="livePrompt" type="text" name="prompt" id="prompt" placeholder="What's on your mind?">
            <input type="submit" value="send" id="submit">
        </form>
        <!--<button>Manage Garden</button>-->
    </div>

</template>

<style scoped>
    form {
        position: absolute;
        width: 90%;
        bottom: 30px;
        height: 75px;
        left: 50%;
        transform: translateX(-50%);
    }

    #submit {
        position: absolute;
        right: 20px;
        bottom: 10px;
        font-size: 24px;
        padding: 5px;
        width: 150px;
        height: 45px;
        margin: 0;
        box-sizing: border-box;
    }

    #chatField {
        position: relative;
        max-width: 1000px;
        margin: auto;
        /* background-color: aliceblue; */
        height: calc(100vh - 120px);
    }

    #chatField p {
        max-width: 60%;
        font-size: 22px;
    }

    #texts {
        display: flex;
        flex-direction: column;
        overflow-y:auto ;
        height: calc(100% - 150px);
    }

    .prompt {
        text-align: right;
        margin-left: auto;
        padding: 10px;
        background-color: #FFFAC7;
        color: #403520;
        border-radius: 20px;
    }

    .bot {
        margin-right: auto;
        font-size: 18px;
    }

    #prompt {
        margin: 0;
        margin-right: 20%;
        text-align: left;
        height: 100%;
        width: 80%;
        background: none;
        border:none;
    }

    button {
        background-color: #FFFAC7;
        color: #403520;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 20px;
        padding: 15px;
        margin-left: auto;
    }
</style>
