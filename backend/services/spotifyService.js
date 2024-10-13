// services/spotifyService.js
const axios = require('axios');
const clientId = 'a64f4b97d5c744f7a4c6ab788b96a6c0';
const clientSecret = '60ddee3b502348ca8ce43636c8abdd56';

// Function to get Spotify access token
const getSpotifyAccessToken = async () => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const response = await axios.post(tokenUrl, null, {
        params: { grant_type: 'client_credentials' },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        },
    });
    return response.data.access_token;
};

// Function to search for songs in happy or sad playlists
const getSongsBasedOnMood = async (mood) => {
    const accessToken = await getSpotifyAccessToken();
    let query = '';

    // Determine the query based on mood
    if (mood > 0) {
        // Search for happy playlists
        query = 'happy';
    } else if (mood < 0) {
        // Search for sad playlists
        query = 'sad';
    } else {
        return []; // Return an empty array for neutral mood
    }

    // Search for playlists containing the query
    const searchUrl = `https://api.spotify.com/v1/search?type=playlist&q=${encodeURIComponent(query)}`;
    const searchResponse = await axios.get(searchUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    // Check if any playlists were found
    if (searchResponse.data.playlists.items.length === 0) {
        return [];
    }

    // Get the first playlist's ID
    const playlistId = searchResponse.data.playlists.items[0].id;

    // Fetch the tracks from the playlist
    const tracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const tracksResponse = await axios.get(tracksUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    // Return only the tracks from the playlist
    return tracksResponse.data.items.map(item => item.track);
};

module.exports = { getSongsBasedOnMood };
