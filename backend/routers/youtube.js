import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

// GET /youtube/search
router.get('/search', async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Search query is required.' });
    }

    try {
        const response = await youtube.search.list({
            part: 'snippet',
            q: q,
            type: 'video',
            maxResults: 10, 
        });

        const searchResults = response.data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url,
        }));

        res.json(searchResults);
    } catch (error) {
        console.error('Error searching YouTube:', error);
        if (error.response && error.response.status === 403) {
            return res.status(403).json({ message: 'YouTube API quota exceeded. Please try again later.' });
        }
        res.status(500).json({ message: 'Failed to search YouTube videos.' });
    }
});

export default router;