<script setup>
    import { ref, onMounted } from 'vue'

	const loading = ref(false)

	function randomFlower() {
		const flowers = '🌸 🌺 🌼 🌻 🌷 🌹'.split(' ')
		return flowers[Math.floor(Math.random() * flowers.length)];
	}

    onMounted(async () => {
		const topm = 45
		const leftm = 125
		const us_width = 125-72
		const us_height = 45-25

		loading.value = true

		function makeFlowersOnMap(cityData) {
			const map = document.getElementById('map-container')
			cityData.forEach(c => {
				for (let i=0; i<Math.min(c.count,10); i++) {
					const flower = document.createElement("span");
					flower.textContent = randomFlower()
					flower.style.left = `${(Number(c.longitude)+leftm)/us_width*80+Math.random()*7}%`
					flower.style.top = `${(topm-Number(c.latitude))/us_height*90+8+Math.random()*7}%`
					flower.style.fontSize = `${Math.max(40, 10*c.count/2)}px`
					console.log(flower.style.top)
					flower.className = 'overlay-image'
					map.appendChild(flower)
				}
			})
		}



		const res = await fetch("http://localhost:3000/api/plantmap")
		const response = await res.json()
		loading.value = true

		makeFlowersOnMap(response)
		/*
		makeFlowersOnMap([
		{
			"count": 10,
			"latitude": "38.48",
			"longitude": "-121.64"
		},
		{
			"count": 1,
			"latitude": "33.78",
			"longitude": "-117.93"
		},
		{
			"latitude": "40.71",
			"longitude": "-73.99"
		}
		])
		*/
    })
</script>

<template>
	<div id="wind">
		<div id="map-container">
		  <img src="../images/america.png" class="base-image" alt="Base" />
		</div>
	</div>
</template>

<style scoped>
#map-container {
  position: relative;
  display: inline-block; /* shrink-wraps to the base image size */
}

.base-image {
  display: block;
  width: 70vw;
}

p {
position: absolute;
left: 0;
bottom:0;
}
</style>
<style>
.overlay-image {
  position: absolute;
transform: translate(-50%, -50%);
}

#wind {
	position: absolute;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	overflow-y: hidden;
	align-items: center;
	justify-content: center;
}
</style>
