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


	async function token() {
		return await getAccessTokenSilently({
			authorizationParams: {
				audience: 'garden-api'
			}
		})
	}

	// returns {zipcode, zone_code, city, state}
	async function getMyProfile() {
        try {
		    const res = await fetch("http://localhost:3000/api/me", {
			    headers: {
				    "Content-Type": 'application/json',
				    Authorization: `Bearer ${await token()}`
			    }
		    })
		    return await res.json()
        } catch (err) {
            console.log(err)
        }
	}

	// zipcode: string. leftpads zipcodes with 0s
	async function updateMyZipcode(zipcode) {
		const res = await fetch("http://localhost:3000/api/users", {
			method: "PUT",
			headers: {
				"Content-Type": 'application/json',
				Authorization: `Bearer ${await token()}`
			},
			body: JSON.stringify({
				zipcode: zipcode.toString().padStart(5, '0')
			})
		})
		const response = await res.json()
	}

	// returns string in format YYYY-MM-DD for sqlite

	async function createPlantInGarden(plant_name) {
		const res = await fetch("http://localhost:3000/api/plants", {
			method: "POST",
			headers: {
				"Content-Type": 'application/json',
				Authorization: `Bearer ${await token()}`
			},
			body: JSON.stringify({
				name: plant_name,
				date_planted: today()
			})
		})
		const response = await res.json()
	}

	function today() {
		return new Date().toISOString().split('T')[0];
	}

	async function getMyPlantsInGarden(plant_name) {
		const res = await fetch("http://localhost:3000/api/plants", {
			headers: {
				"Content-Type": 'application/json',
				Authorization: `Bearer ${await token()}`
			}
		})
		const response = await res.json()
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
        <button @click="createPlantInGarden('carrot')">Create Plant</button>
        <button @click="getPlant">Get Plants</button>
        <button @click="">chatbot (click create user first)</button>
        <button @click="promptExa">Prompt</button>
    </div>

</template>

<style scoped></style>
