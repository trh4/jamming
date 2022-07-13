import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            playlistName: "New Playlist",
            playlistTracks: [],
        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        for (let playlistTrack of this.state.playlistTracks)
            if (playlistTrack.id === track.id) return;
        let newState = this.state.playlistTracks;
        newState.push(track);
        this.setState({ playlistTracks: newState });
    }
    removeTrack(track) {
        let iToRemove = this.state.playlistTracks.indexOf(track);
        if (iToRemove === -1) return;
        let newState = this.state.playlistTracks;
        newState.splice(iToRemove, 1);
        this.setState({ playlistTrack: newState });
    }
    search(term) {
        Spotify.search(term).then((searchResults) => {
            // alert("then?");
            this.setState({ searchResults: searchResults });
            // console.log(searchResults)
        });
    }
    updatePlaylistName(name) {
        this.setState({ playlistName: name });
    }
    savePlaylist() {
        let trackURIs = this.state.playlistTracks.map((track) => track.uri);

        Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
            this.setState({
                playlistName: "New Playlist",
                playlistTracks: [],
            });

        });
    }
    render() {
        return (
            <div>
                <h1>
                    Ja<span className="highlight">mmm</span>ing
                </h1>
                <div className="App">
                    <SearchBar onSearch={this.search} />
                    <div className="App-playlist">
                        <SearchResults
                            searchResults={this.state.searchResults}
                            onAdd={this.addTrack}
                        />
                        <Playlist
                            playlistTracks={this.state.playlistTracks}
                            playlistName={this.state.playlistName}
                            onRemove={this.removeTrack}
                            onNameChange={this.updatePlaylistName}
                            onSave={this.savePlaylist}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
