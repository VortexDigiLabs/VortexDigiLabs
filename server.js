require('dotenv').config();
const express = require('express');
const cors = require('cors');
const FirecrawlApp = require('@mendable/firecrawl-js').default;
const { initializeApp } = require('firebase/app');

// Initialize Firebase (Replace with your Firebase config when ready)
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };
// const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firecrawl
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());
// Serve static files from the current directory
app.use(express.static('./'));

app.post('/api/scrape', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        const result = await firecrawl.scrapeUrl(url, {
            formats: ['markdown', 'html']
        });

        res.json(result);
    } catch (error) {
        console.error('Error scraping:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
});
