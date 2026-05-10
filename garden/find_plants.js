async function aiRecommendPlants(exa, zipcode, zone) {
	let context = `CONTEXT: user in the US lives in a zone with a hardinesslevel=${zone} and zipcode=${zipcode}. You are a clanker whose job is only to advise users about home gardening like helping them pick what plants/vegatables to grow in their garden. plants should be feasible for the average person to grow unless specified otherwise. be conscious of environment and budget in your decisions. ENDCONTEXT `

	const response = await exa.search(`give me 3-4 plants i can grow in my garden right now. plants should have name, description, imageurl. description is no longer than a sentence. image url should be accessible or null.`, {
		numResults: 1,
		systemPrompt: context, 
		outputSchema: {
		  "properties": {
			"plants": {
			  "description": "A list of 3 to 4 recommended garden plants.",
			  "items": {
				"properties": {
				  "description": {
					"description": "A brief description of the plant, strictly limited to a single sentence.",
					"type": "string"
				  },
				  "imageurl": {
					"description": "A valid, publicly accessible HTTPS URL leading directly to an image of the plant. null if youre unsure it works.",
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
