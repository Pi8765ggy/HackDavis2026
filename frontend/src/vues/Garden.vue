<script setup>

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

    const plantForm = ref(false)
    const togglePlantForm = () => {
        plantForm.value = !plantForm.value
    }
    
    const plant_name = ref("")
    // date var defaults to today
    const date_planted = ref(new Date().toISOString().split('T')[0])
    const addingPlant = ref(false)
    const addPlant = async () => {
        if (addingPlant.value) {
            console.log("Adding plant, rejected.")
            return
        }

        addingPlant.value = true
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'garden-api'
                }
            });
            console.log("Token created.")
		    const res = await fetch("http://localhost:3000/api/plants", {
			    method: "POST",
			    headers: {
				    "Content-Type": 'application/json',
				    Authorization: `Bearer ${token}`
		    	},
			    body: JSON.stringify({
				    name: plant_name.value,
				    date_planted: date_planted.value
			    })
		    });
            if (!res.ok) {
                console.log(res.error)
                addingPlant.value = false
                return
            }
            await refreshPlants();
        } catch (err) {
            console.log(err)
        } finally {
            console.log("Finished adding plant.")
            addingPlant.value = false
        }
	}
    
    const plantList = ref([])
    const refreshPlants = async () => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: 'garden-api'
                }
            });
            console.log("Token created.")
            const res = await fetch("http://localhost:3000/api/plants", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!res.ok) {
                throw new Error(res.error)
            }
            const data = await res.json()
            plantList.value = data
            console.log("Plants refreshed:")
            console.log(data)
        } catch (err) {
            console.error(err)
        }
    }

    const routeChatBot = () => {
        router.push('/chat')
    }

    onMounted(async () => {
        await refreshPlants();
    })
</script>

<template>
    <header>
        <RouterLink to='/'>
            <img src="../images/logo-full.svg" alt="gardinspiration logo" id="logo">
        </RouterLink>
        <div id="user">
            <p>Welcome back, {{ user.name }}!</p>
            <img :src="user.picture" alt="user icon" referrerpolicy="no-referrer">
        </div>
    </header>

    <div id="container">
        <section id="menu">
            <h1>Your Garden</h1>


            <!-- toggle class='hidden' between 'btn' and 'addPlant' -->
            <div id="btn" v-if="!plantForm">
                <button @click="togglePlantForm">Add plant</button>
                <button>Edit garden</button>
                <button @click="routeChatBot">Ask our chatbot</button>
            </div>
            
            <div id="addPlant" v-else>
                <h2>Add a new plant</h2>
                <form @submit.prevent="addPlant">
                    <label for="pname">Plant name:</label>
                    <input v-model="plant_name" type="text" id="pname" required>

                    <label>Date Planted:</label>
                    <input v-model="date_planted" value="date_planted" type="date" id="date" required>

                    <button type="submit">Add</button>
                </form>
                <button @click="togglePlantForm">Cancel</button>
            </div>
        </section>

        <section id="list">
            <div v-for="plant in plantList">
                <img src="../images/carrot.jpg" alt="carrot" :key="plant.id">
                <p>{{ plant.name }}</p>
                <p>{{ plant.date_planted }}</p>
            </div>
            <!--
            <div class="plant">
                <img src="../images/flower1.jpg" alt="flower 1">
                <p>Plant 1</p>
            </div>

            <div class="plant">
                <img src="../images/tree1.jpg" alt="tree 1">
                <p>Plant 2</p>
            </div>

            <div class="plant">
                <img src="../images/bush1.jpg" alt="bush 1">
                <p>Plant 3</p>
            </div>

            <div class="plant">
                <img src="../images/tree2.jpg" alt="tree 2">
                <p>Plant 4</p>
            </div>

            <div class="plant">
                <img src="../images/bush3.jpg" alt="bush 3">
                <p>Plant 5</p>
            </div>

            <div class="plant">
                <img src="../images/tree3.jpg" alt="tree 3">
                <p>Plant 6</p>
            </div>

            <div class="plant">
                <img src="../images/bush4.jpg" alt="bush 4">
                <p>Plant 7</p>
            </div>

            <div class="plant">
                <img src="../images/tree4.jpg" alt="tree 4">
                <p>Plant 8</p>
            </div>
            -->
        </section>
    </div>
</template>

<style scoped>
    .hidden {
        display: none;
    }

    #container {
        display: flex;
        gap: 30px;
        box-sizing: border-box;
        padding: 20px 40px;
        align-items: stretch;

    }

    #menu {
        flex: 1;
        background-color: #8BBF56;
        text-align: center;
        color: #403520;
        font-size: 24px;
    }

    #menu button {
        display: block;
        background-color: #FFFAC7;
        color: #403520;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 20px;
        padding: 15px;
        margin: 20px auto;
    }

    #btn {
        margin-top: 30px;
    }

    #addPlant {
        background-color: #FFFAC7;
        border-radius: 20px;
        margin: 10px;
        color: #403520;
        padding: 5px;
    }

    #addPlant h2 {
        color: #403520;
        font-size: 24px;
    }

    #addPlant button {
        background-color: #8BBF56;
    }
    #addPlant form {
        background-color: #FFFAC7;
        border: none;
        width: 95%;
        height: 80%;
    }

    #list {
        flex: 3;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }

    .plant {
        position: relative;
    }

    #list div img {
        width: 100%;
        height: auto;
    }

    #list div p {
        font-size: 15pt;
    }

</style>
