import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        { name: "name1", artist: "artist1", album: "album1", id: 1 },
        { name: "name2", artist: "artist2", album: "album2", id: 2 },
        { name: "name3", artist: "artist3", album: "album3", id: 3 },
      ],
      playlistName: "Sample-playlistName",
      playlistTracks: [
        { name: "name1IN", artist: "artist1", album: "album1", id: 4 },
        { name: "name2IN", artist: "artist2", album: "album2", id: 5 },
      ],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }
  // addTrack(track) {
  //   let tracks = this.state.playlistTracks;
  //   if (tracks.find((savedTrack) => savedTrack.id === track.id)) return;
  //   tracks.push(track);
  //   this.setState({ playlistTracks: tracks });
  // }
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
  // removeTrack(track) {
  //   let tracks = this.state.playlistTracks;
  //   tracks=tracks.filter((currentTrack)=> currentTrack.id!==track.id)
  //   this.setState({playlistTracks : tracks})
  // }
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar />
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
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
