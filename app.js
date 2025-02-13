require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
    res.render("index")
})

app.get("/artist-search", (req, res) => {

    const { artist } = req.query

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            res.render("artist-search-results", { artists: data.body.artists.items })
        })
        .catch(err => console.log(err));

})
app.get('/albums/:artistId', (req, res, next) => {

    const artistId = req.params.artistId

    spotifyApi.
        getArtistAlbums(artistId)
        .then(data => {

            res.render("albums", { albums: data.body.items })
        })
});
app.get('/tracks/:albumId', (req, res, next) => {

    const albumId = req.params.albumId

    spotifyApi.
        getAlbumTracks(albumId)
        .then(data => {
            console.log(data.body.items)
            res.render("tracks", { tracks: data.body.items })
        })
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
