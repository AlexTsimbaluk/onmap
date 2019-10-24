import React, { Component } from 'react';

import GoogleMapReact from 'google-map-react';
// import GoogleMapMarkers from 'google-map-react';
 
import _places from './data/PLACES.json';

import Search from './Search';



const Marker = ({ text, type, searchType, place, selected, userEmail, position, openNoteForm, editing, addNote, handleEditNote }) => {
  let searchClass = '';

  if(searchType === 'search-total') {
    searchClass = 'search-total';
  } else if(searchType === 'search-email') {
    searchClass = 'search-email';
  } else if(searchType === 'search-notes') {
    searchClass = 'search-notes';
  }

  let classNameString = 'custom-marker ' + searchClass;
  if(type === 0) {
    classNameString += ' my-marker';
  } else {
    classNameString += ' place-marker';
  }

  return (
    <div>
      {
        type === 0
        ?
        <div className={classNameString}>{text}</div>
        :
        <div className={classNameString}>{text}</div>
      }

      {
        selected && !userEmail && <InfoWindow place={place} />
      }

      {
        selected && userEmail && <InfoWindow openNoteForm={openNoteForm} handleEditNote={handleEditNote} addNote={addNote} userEmail={userEmail} place={place} editing={editing} />
        // userEmail && <AddNoteForm position={position} userEmail={userEmail} />
      }
    </div>
  );
}

const AddNoteForm = ({position, userEmail}) => {
  let place = {
    lat: position.lat,
    long: position.lng,
    notes: '',
    email: userEmail
  };

  console.log(position);
  console.log(userEmail);

  return (
    <div>
      {
        <InfoWindow place={place} />
      }
    </div>
  );
}

// InfoWindow component
const InfoWindow = ({place, userEmail, openNoteForm, editing, addNote, handleEditNote}) => {
  const infoWindowStyle = {
    cursor: 'default',
    position: 'relative',
    bottom: 120,
    left: '-110px',
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    zIndex: 100,
  };


  /*if(!place) {
    return (
      <div style={infoWindowStyle}>
        <div style={{ fontSize: 12 }}>
          {userEmail}
        </div>
        
        <div style={{ fontSize: 12, color: 'grey' }}>
          {place.lat}, {place.long}
        </div>

        <div style={{ fontSize: 14, color: 'green' }}>
          {place.notes}
        </div>
      </div>
    );
  }*/

  return (
    <div className="d-flex justify-content-between" style={infoWindowStyle}>
      <div>
        <div style={{ fontSize: 12 }}>
          {place.email}
        </div>
        
        <div style={{ fontSize: 12, color: 'grey' }}>
          {place.lat}, {place.long}
        </div>

        <div style={{ fontSize: 14, color: 'green' }}>
          {place.notes}
        </div>
      </div>

      <div>
        {
          !!(!editing) &&
          <div
            onClick={openNoteForm}
            className="add-note-button"
          >+</div>
        }

        {
          !!(editing) &&
          <div
            onClick={addNote}
            className="add-note-button"
          >OK</div>
        }
      </div>

      {
        !!editing &&
        <form className="form-add-note">
          <div className="form-group">
            <textarea onClick={(e) => e.stopPropagation()} onChange={handleEditNote} type="text" name="add-note" className="form-control"></textarea>
          </div>
        </form>
      }
    </div>
  );
};

const handleApiLoaded = (map, maps) => {
  // console.log(map);
  // console.log(maps);
};




let places;
 
class Map extends Component {
  constructor() {
    super();

    this.state = ({
      userPosition: null,
      zoom: 5,
      selectedPlace: null,
      searchType: 'notes',
      searchString: '',
      searchResults: [],
      searchEmailResults: [],
      searchNotesResults: [],
      editing: false,
      noteText: ''
    });

    this.handlePosition = this.handlePosition.bind(this);
    this.openNoteForm = this.openNoteForm.bind(this);
    this.addNote = this.addNote.bind(this);
    this.handleEditNote = this.handleEditNote.bind(this);

    this.handleSearch = this.handleSearch.bind(this);

    this.filter = this.filter.bind(this);
    this.filterEmail = this.filterEmail.bind(this);
    this.filterNotes = this.filterNotes.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 55.633837,
      lng: 37.588993
    },
  };

  componentDidMount() {
    // console.log(JSON.parse(JSON.stringify(_places)));
    this.handlePosition();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.places) {
      places = this.props.places;
    }

    /*console.log(this.state.searchString.length > 2);
    console.log(this.state.searchString !== prevState.searchString);
    console.log(this.state.searchString);
    console.log(prevState.searchString);
    console.log(this.state.searchString.length > 2 && this.state.searchString !== prevState.searchString);*/

    if(this.state.searchString.length > 2 && this.state.searchString !== prevState.searchString) {
      let total = this.props.places.filter(this.filter);
      if(total.length) this.setState({searchResults: total});
      // console.log(total);
      // console.log(this.state.searchResults);

      let totalEmail = this.props.places.filter(this.filterEmail);
      if(totalEmail.length) this.setState({searchEmailResults: totalEmail});
      // console.log(totalEmail);
      // console.log(this.state.searchEmailResults);
      
      let totalNotes = this.props.places.filter(this.filterNotes);
      if(totalNotes.length) this.setState({searchNotesResults: totalNotes});
      // console.log(totalNotes);
      // console.log(this.state.searchNotesResults);
    } else if(this.state.searchString.length < 3 && this.state.searchString !== prevState.searchString) {
      this.setState({searchResults: []});        
      this.setState({searchEmailResults: []});        
      this.setState({searchNotesResults: []});        
    }
  }

  handlePosition() {
    let _this = this;

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        _this.setState({ userPosition: userPosition });
        // console.log(userPosition);
        // return userPosition;


        /*infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);*/
      }, function() {
        // handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      // handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  filter(place) {
    if(this.state.searchString.length < 3) return true;

    // console.log(this.filterEmail(place) && this.filterNotes(place));

    return this.filterEmail(place) && this.filterNotes(place);
  }

  filterEmail(place) {
    if(this.state.searchString.length < 3) return true;

    for(let key in place) {
      if(key === 'email') {
        return place[key].toLowerCase().search(this.state.searchString) !== -1;
      }
    }
  }

  filterNotes(place) {
    if(this.state.searchString.length < 3) return true;

    for(let key in place) {
      if(key === 'notes') {
        return place[key].toLowerCase().search(this.state.searchString) !== -1;
      }
    }
  }

  openNoteForm(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('openNoteForm');

    this.setState({editing: true});
  }

  addNote(e) {
    console.log(this.state.noteText);
    let center = this.state.userPosition ? this.state.userPosition : this.props.center;
    let place = {
      id: '',
      lat: center.lat,
      long: center.lng,
      notes: this.state.noteText,
      email: this.props.user.email
    };

    localStorage.setItem('userPlace', JSON.stringify(place));
    this.setState({editing: false});
  }

  handleEditNote(e) {
    console.log(e.target.value);
    this.setState({noteText: e.target.value});
  }

  getPlace(id) {
    let i = _places.findIndex((p) => p.id === id);
    // console.log(i);
    // console.log(_places[i]);

    _places[i] && this.setState({ selectedPlace: _places[i] });

    if(i === -1) {
      // наш маркер

      let center = this.state.userPosition ? this.state.userPosition : this.props.center;

      console.log(JSON.parse(localStorage.getItem('userPlace')));

      let place = {
        id: '',
        lat: center.lat,
        long: center.lng,
        notes: '',
        email: this.props.user.email
      };

      if(!localStorage.getItem('userPlace')) {
        localStorage.setItem('userPlace', JSON.stringify(place));
      } else {
        let p = JSON.parse(localStorage.getItem('userPlace'));
        console.log(p.notes);

        if(p.notes.length) {
          place.notes = p.notes;
        }

        this.setState({ selectedPlace: place });
      }


      // console.log(place);

    }
  }

  handleSearch(e) {
    this.setState({ searchString: e.target.value });
  }




 
  render() {
    // let places = JSON.parse(JSON.stringify(_places));
    // let places = this.props.places;
    // places = this.props.places;
    // console.log(places);
    // console.log(this.state.selectedPlace);

    // console.log(this.state.searchResults);
    // console.log(this.state.searchEmailResults);
    // console.log(this.state.searchNotesResults);

    let center = this.state.userPosition ? this.state.userPosition : this.props.center;

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <div style={{ height: '100%', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyCalL3qcZmf7yCDDV9iYeAck0nKgJUKFm0' }}
            defaultCenter={this.props.center}
            center={center}
            defaultZoom={this.state.zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            onClick={({x, y, lat, lng, event}) => {
              this.setState({ selectedPlace: null });
            }}
            onChildClick={(e) => {
              // console.log(e);
              this.getPlace(e);
            }}
          >
            {
              places &&
              places.filter(this.filter).map((place) => (
                <Marker
                  center={{lat: place.lat, lng: place.long}}
                  defaultCenter={[place.lat, place.long]}
                  key={place.id}
                  lat={place.lat}
                  lng={place.long}
                  place={place}
                  selected={this.state.selectedPlace && this.state.selectedPlace.id === place.id}
                  text={''}
                  searchType={'search-total'}
                />
              ))
            }

            {
              places &&
              places.filter(this.filterEmail).map((place) => (
                <Marker
                  center={{lat: place.lat, lng: place.long}}
                  defaultCenter={[place.lat, place.long]}
                  key={place.id}
                  lat={place.lat}
                  lng={place.long}
                  place={place}
                  selected={this.state.selectedPlace && this.state.selectedPlace.id === place.id}
                  text={''}
                  searchType={'search-email'}
                />
              ))
            }

            {
              places &&
              places.filter(this.filterNotes).map((place) => (
                <Marker
                  center={{lat: place.lat, lng: place.long}}
                  defaultCenter={[place.lat, place.long]}
                  key={place.id}
                  lat={place.lat}
                  lng={place.long}
                  place={place}
                  selected={this.state.selectedPlace && this.state.selectedPlace.id === place.id}
                  text={''}
                  searchType={'search-notes'}
                />
              ))
            }

            <Marker
              center={this.state.userPosition ? this.state.userPosition : this.props.center}
              defaultCenter={this.props.center}
              lat={center.lat}
              lng={center.lng}
              text={''}
              type={0}
              selected={this.state.selectedPlace && this.state.selectedPlace.id === ''}
              place={this.state.selectedPlace}
              position={{lat: center.lat, lng: center.lng}}
              userEmail={this.props.user.email}
              openNoteForm={this.openNoteForm}
              addNote={this.addNote}
              handleEditNote={this.handleEditNote}
              editing={this.state.editing}
            />
          </GoogleMapReact>
        </div>

        <div className="position-fixed user-signed">
          <div className="badge badge-success">
            {this.props.user.email}
          </div>

          <div className="text-left mt-1">
            <button
              className="btn btn-sm btn-secondary"
              onClick={this.logout}
            >
              Logout
            </button>
          </div>

          {/*<Search places={places} user={this.props.user} />*/}

          <div className="pt-2">
            <form className="form-search-email">
              <div className="form-group">
                <input value={this.state.searchString} onChange={this.handleSearch} type="text" name="searchString" className="form-control" id="search-input-email" placeholder="Search" />
              </div>
            </form>

            {
              !!(this.state.searchEmailResults.length) &&
              <div className="search-results">
              {
                this.state.searchEmailResults.map((place) => (
                  <div
                    key={place.id}
                  >
                    <div>{place.email}</div>
                  </div>
                ))
              }
              </div>
            }

            {
              !!(this.state.searchNotesResults.length) &&
              <div className="search-results">
              {
                this.state.searchNotesResults.map((place) => (
                  <div
                    key={place.id}
                  >
                    <div>{place.notes}</div>
                  </div>
                ))
              }
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}


export default Map;
