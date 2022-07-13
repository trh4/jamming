const clientId = "8fdc4265d6b740c3bc147e9729fbadaa";
const redirectUri = "http://localhost:3000/";
let mainAccessToken;

const Spotify = {
    getAccesToken() {
        if (mainAccessToken) {
            return mainAccessToken;
        }

        //check if access token match: //window.location.href return the window url
        const accessTokenMatch =
            window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            mainAccessToken = accessTokenMatch[1]; // idk why the [1]
            const expiresIn = Number(expiresInMatch[1]);
            // this clears the paramaeters, allowing us to grab new access token when it expires
            window.setTimeout(() => (mainAccessToken = ""), expiresIn * 1000); // suppuse to wipe access token and url paramaeters
            window.history.pushState("Access Token", null, "/");
            return mainAccessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
            return this.getAccesToken();
        }
    },
    search(term) {
        const accessToken = Spotify.getAccesToken();
        // alert(`accessToken: ${accessToken}`);
        // console.log(accessToken);
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then((response) => {
                // alert(response);
                return response.json();
            })
            .then((jsonResponse) => {
                if (!jsonResponse.tracks) return [];
                return jsonResponse.tracks.items.map((track) => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                }));
            });
    },
    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return Promise.reject("Fail");
        }
        const accessToken = Spotify.getAccesToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;
        let playlistId;

        return fetch("https://api.spotify.com/v1/me", { headers: headers })
            .then((response) => response.json())
            .then((jsonResponse) => {
                userId = jsonResponse.id;
                return fetch(
                    `https://api.spotify.com/v1/users/${userId}/playlists`,
                    {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({ name: name }),
                    }
                )
                    .then((response) => response.json())
                    .then((jsonResponse) => {
                        playlistId = jsonResponse.id;
                        return fetch(
                            `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                            {
                                headers: headers,
                                method: "POST",
                                body: JSON.stringify({ uris: trackUris }),
                            }
                        );
                    });
            });
    },
};

export default Spotify;
