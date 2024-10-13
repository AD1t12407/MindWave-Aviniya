// testSpotifyService.js
const { getSongsBasedOnMood } = require('./spotifyService');

const testMood = async (mood) => {
    try {
        const songs = await getSongsBasedOnMood(mood);
        console.log(`Songs for mood ${mood}:`);
        if (songs.length > 0) {
            songs.forEach((song, index) => {
                console.log(`${index + 1}. ${song.name} by ${song.artists.map(artist => artist.name).join(', ')}`);
            });
        } else {
            console.log('No songs found for this mood.');
        }
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
};

// Test happy mood (positive number)
testMood(1); // Example for happy mood

// Test sad mood (negative number)
testMood(-1); // Example for sad mood

// Test neutral mood (zero)
testMood(0); // Example for neutral mood
