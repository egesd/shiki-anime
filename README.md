Anime Viewer
Anime Viewer is a minimalist web application for exploring top-rated anime by season and year. Built with a focus on simplicity and elegance, this app allows users to filter anime based on type (series or movie), search within results, and view ratings.

Tech Stack
Frontend: Svelte, TailwindCSS
Backend: Node.js, Express
APIs: MyAnimeList API
Icons: Font Awesome
Features
Filter by Type: Toggle between viewing anime series and movies.
Season and Year Filters: Select a specific season and year to browse anime released in that timeframe.
Search Functionality: Search anime titles within the current results.
Infinite Scroll: Automatically loads more anime as you scroll.
Anime Rating Display: View scores from MyAnimeList for each anime.
Installation
Clone the repository:

git clone https://github.com/your-username/anime-viewer.git
cd anime-viewer
Install dependencies:

npm install
Set up environment variables:

Create a .env file in the root directory with your MyAnimeList API key:

VITE_MYANIMELIST_API_KEY=your_api_key_here
Run the development server:

npm run dev
This will start the Vite development server. You can access the app in your browser at http://localhost:5173.

Run the proxy server:

Open a new terminal, navigate to the project directory, and run:

node server.js
This will start the Node.js proxy server at http://localhost:5000, required for interacting with the MyAnimeList API.

Usage
Open the app in your browser.
Use the season and year dropdown filters to browse anime by specific seasons.
Toggle between Series and Movies to view anime of your preferred type.
Use the search bar to find specific anime titles within the current results.
Scroll down to automatically load more anime.
Project Structure
src: Contains all Svelte components, styles, and assets.
components: Reusable UI components.
stores: Svelte stores for managing state.
assets: Icons, images, and other static files.
server.js: Node.js/Express proxy server for the MyAnimeList API.
Deployment
To deploy the app, you can use any static hosting provider (e.g., Netlify, Vercel, GitHub Pages). Here’s a quick guide:

Build the project:

npm run build
Deploy: Deploy the contents of the dist folder using your chosen platform.

License
This project is licensed under the MIT License.

