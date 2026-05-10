async function aiRecommendPlants(exa, zipcode, zone) {
	const date = new Date().toISOString().split('T')[0];
	let context = `CONTEXT: User in the US lives in a zone with a hardinesslevel=${zone} and zipcode=${zipcode}. Today is ${date} You are a helpful AI model who's job is only to advise users about home gardening like helping them pick what plants/vegatables to grow in their garden. plants should be feasible for the average person to grow unless specified otherwise. be conscious of environment and budget in your decisions. Only reccomend plants that the average person would have heard of, like basic vegetables or flowers. The plant must be native to the area in your response. You should aim to provide one vegetable and one flower in your response. ENDCONTEXT `


    const response = await exa.search(`Give me two plants i can grow in my garden right now. Plants should have name, description, imagetype. Description is no longer than a sentence. Image type should be \'flower\' or \'vegetable\'.`, {
		numResults: 2,
		systemPrompt: context, 
		outputSchema: {
		  "properties": {
			"plants": {
			  "description": "A list of 2 recommended garden plants.",
			  "items": {
				"properties": {
				  "description": {
					"description": "A brief description of the plant, strictly limited to a single sentence.",
					"type": "string"
				  },
				  "imagetype": {
					"description": "Either a flower or a vegetable.",
					"type": "string"
				  },
				  "name": {
					"description": "The common name of the plant.",
					"type": "string"
				  }
				},
				"required": [
				  "name",
				  "description",
				],
				"type": "object"
			  },
			  "type": "array",
			}
		  },
		  "required": [
			"plants"
		  ],
		  "type": "object"
		}
	})

	return response.output.content.plants
}

module.exports = aiRecommendPlants
