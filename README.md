# About
GardInspire is a full-stack web application that uses an AI model to dynamically suggest gardening tips, plants to grow, and general green thumb advice. The application can persist information about the user's "garden", keeping track of the plants a user is growing in a database on the server. The user must sign up using their email, and submit their US zip code to let the model know which climate zone they are based in.
# Tech Stack
GardInspire utilizes Vue as a frontend framework, ExpressJS as a backend API, and SQLite for a database. It takes advantage of the ExaAI API for its generative responses. The API is based on a REST API structure, and no state is persistent across the server. Vue allows GardInspire to be a SPA (Single Page Application), and thus the page never reloads, providing a seamless user experience.
# How to install
To run GardInspire, use the provided npm scripts to build and run the project.
1. Install nodejs onto your machine.
2. Create the necessary .env files.
3. In the "frontend" folder, run the command "npm run build". This will automatically install nodes, create build files, and transfer build files to the server folder.
4. In the "garden" folder, run the command "npm start". This will automatically install nodes, and start the server on http://localhost:3000
