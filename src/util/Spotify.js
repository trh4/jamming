const clientId = "8fdc4265d6b740c3bc147e9729fbadaa";
const redirectUri = "http://localhost:3000/";
let accessToken;

const Spotify = {
  getAccesToken() {
    if (accessToken) {
      return accessToken;
    }

    //check if access token match: //window.location.href return the window url
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1]; // idk why the [1]
      const expiresIn = Number(expiresInMatch[1]);
      // this clears the paramaeters, allowing us to grab new access token when it expires
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000); // suppuse to wipe access token and url paramaeters
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },
  search(term) {
    const accessToken = Spotify.getAccesToken();
    return (fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`),
    {
      Headers: {
        Authhorization: `Bearer ${accessToken}`,
      }, //86
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) return [];
        return jsonResponse.track.items.map((track) => ({
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
      return;
    }
    const accessToken = Spotify.getAccesToken;
    const headers = { Authhorization: `Bearer ${accessToken}` };
    let userId;

    return fetch("https://api.spotify.com/v1/me", { headers: Headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return (fetch(`https://api.spotify.com/v1/users/${userId}/playlists`),
        {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return (
              fetch(
                `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`
              ),
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
