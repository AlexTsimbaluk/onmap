import React, { Component } from 'react';

import GoogleMapReact from 'google-map-react';
// import GoogleMapMarkers from 'google-map-react';
 
import _places from './data/PLACES.json';

import Search from './Search';

import { ReactComponent as UserNotPositionIcon } from './assets/img/user-not-position.svg';
import { ReactComponent as UserPositionIcon } from './assets/img/user-position.svg';

import { ReactComponent as CenterOnUserIcon } from './assets/img/center-on-user.svg';

import { ReactComponent as MapNoteIcon } from './assets/img/map-pin-note.svg';
import { ReactComponent as MapUserIcon } from './assets/img/map-pin-user.svg';
// import { ReactComponent as MapNoteActiveIcon } from './assets/img/map-pin-note-active.svg';
// import { ReactComponent as MapUserActiveIcon } from './assets/img/map-pin-user-active.svg';
import { ReactComponent as MapUserActiveIcon } from './assets/img/map-pin-user-active-1.svg';
import { ReactComponent as MapNoteActiveIcon } from './assets/img/map-pin-note-active-1.svg';

import { ReactComponent as ListIcon } from './assets/img/list.svg';
import { ReactComponent as ListIcon2 } from './assets/img/list-2.svg';
import { ReactComponent as ListHamburgerIcon } from './assets/img/list-hamburger.svg';

import { ReactComponent as EditIcon } from './assets/img/edit.svg';

import { ReactComponent as PlusGreenCircle } from './assets/img/plus-green-circle.svg';
import { ReactComponent as AddNote } from './assets/img/add-note.svg';
import { ReactComponent as AddNote2 } from './assets/img/add-note-2.svg';

import { ReactComponent as SaveNote } from './assets/img/save-note.svg';
import { ReactComponent as EditNote } from './assets/img/edit-note.svg';



const Marker = ({ type, searchType, place, selected, selectedPlace, userEmail, position, openNoteForm, editing, addNote, handleEditNote, active, icon }) => {
  let searchClass = '';

  if(searchType === 'search-total') {
    searchClass = ' search-total';
  } else if(searchType === ' search-email') {
    searchClass = 'search-email';
  } else if(searchType === ' search-notes') {
    searchClass = 'search-notes';
  }

  let classNameString = 'custom-marker' + searchClass;
  if(type === 0) {
    classNameString += ' my-marker';
  } else {
    classNameString += ' place-marker';
  }

  if(selectedPlace && selectedPlace.notes !== place.notes) {
    classNameString += ' muted';
  }

  if(selected) {
    classNameString += ' active';
  }

  return (
    <div>
      {
        type === 0
        ?
        <div className={classNameString}>
          {
            !!selected ? <MapUserActiveIcon width={30} /> : <MapUserIcon width={30} />
          }
        </div>
        :
        <div className={classNameString}>
          {
            !!selected ? <MapNoteActiveIcon width={30} /> : <MapNoteIcon width={30} />
          }
        </div>
      }

      {
        selected &&
        !userEmail
        && <InfoWindow
          place={place}
        />
      }

      {
        selected
        && userEmail
        && <InfoWindow
            openNoteForm={openNoteForm}
            handleEditNote={handleEditNote}
            addNote={addNote}
            userEmail={userEmail}
            place={place}
            editing={editing}
          />
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
    transform: 'translateY(-50%)'
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
        <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.6px' }}>
          {place.email}
        </div>
        
        <div className="pb-1" style={{ fontSize: 12, color: 'grey' }}>
          {place.lat}, {place.long}
        </div>

        {
          !!place.notes.length &&
          <div className="border-top pt-1 text-monospace" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.6px' }}>
            {place.notes}
          </div>
        }
      </div>

      <div>
        {
          !!handleEditNote &&
          !!(!editing) &&
          <div className="form-group">
            <button
              onClick={openNoteForm}
              className="btn btn-link p-0 add-note-button"
            >
              {
                !(!!place.notes.length) && <AddNote width={30} />
              }

              {
                !!place.notes.length && <EditNote width={30} />
              }
            </button>
          </div>
        }

        {
          !!(editing) &&
          <div
            onClick={addNote}
            className="add-note-button"
          >
            <SaveNote width={24} />
          </div>
        }
      </div>

      {
        !!editing &&
        <form className="form-add-note">
          <div className="form-group">
            <textarea onClick={(e) => e.stopPropagation()} onChange={handleEditNote} type="text" name="add-note" className="form-control" defaultValue={place.notes}
            ></textarea>
          </div>
        </form>
      }
    </div>
  );
};



let places;
 
class Map extends Component {
  constructor() {
    super();

    this.state = ({
      map: null,
      maps: null,
      bounds: null,
      userPosition: null,
      zoom: 5,
      selectedPlace: null,
      searchType: 'notes',
      searchString: '',
      searchResults: [],
      searchEmailResults: [],
      searchNotesResults: [],
      editing: false,
      noteText: '',
      activeMarkerCenter: null,
      listVisible: true
    });

    this.handlePosition = this.handlePosition.bind(this);
    this.openNoteForm = this.openNoteForm.bind(this);
    this.addNote = this.addNote.bind(this);
    this.handleEditNote = this.handleEditNote.bind(this);

    this.handleSearch = this.handleSearch.bind(this);

    this.filter = this.filter.bind(this);
    this.filterEmail = this.filterEmail.bind(this);
    this.filterNotes = this.filterNotes.bind(this);
    this.setCenter = this.setCenter.bind(this);
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

    /*if(!prevState.map && this.state.map) {
      console.log(this.state.map);
    }

    if(!prevState.maps && this.state.maps) {
      console.log(this.state.maps);
    }*/

    /*if(!prevState.bounds && places && this.state.map && this.state.maps) {
      let bounds = this.getMapBounds(this.state.map, this.state.maps, places);
      this.setState({bounds: bounds});
    }*/

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



  handleApiLoaded = (map, maps) => {
    // Fit map to its bounds after the api is loaded
    this.setState({map: map});
    this.setState({maps: maps});

    let bounds = this.getMapBounds(this.state.map, this.state.maps, places);
    this.setState({bounds: bounds});

    map.fitBounds(this.state.bounds);

    this.mapResizeListener(this.state.map, this.state.maps, this.state.bounds);
  };

  // Return map bounds based on list of places
  getMapBounds = (map, maps, places) => {
    const bounds = new maps.LatLngBounds();

    places.forEach((place) => {
      bounds.extend(new maps.LatLng(
        place.lat,
        place.long,
      ));
    });

    return bounds;
  };

  // Re-center map when resizing the window
  mapResizeListener = (map, maps, bounds) => {
    maps.event.addDomListenerOnce(map, 'idle', () => {
      maps.event.addDomListener(window, 'resize', () => {
        map.fitBounds(bounds);
      });
    });
  };

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

    for(let key in place) {
      let finded;

      if(key === 'email' || key === 'notes') {
        finded = place[key].toLowerCase().search(this.state.searchString) !== -1;

        if(finded) return finded;
        continue;
      }
    }
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
    // console.log('openNoteForm');

    this.setState({editing: true});
  }

  addNote(e) {
    // console.log(this.state.noteText);
    // console.log(this.state.selectedPlace);


    let _place = this.state.selectedPlace;
    _place.notes = this.state.noteText;

    this.setState({selectedPlace: _place})
    localStorage.setItem('userPlace', JSON.stringify(_place));
    this.setState({editing: false});
  }

  handleEditNote(e) {
    // console.log(e.target.value);
    this.setState({noteText: e.target.value});
  }

  getPlace(id, place, placeProps) {
    // console.log(id);
    // console.log(place);

    if(place && place.id == id) {
      // let i = _places.findIndex((p) => p.id === place.id);

      // console.log(i);
      // console.log(_places[i]);

      // _places[i] && this.setState({ selectedPlace: _places[i] });
      this.setState({ selectedPlace: place });
    } else {
      // наш маркер

      let center = this.state.userPosition ? this.state.userPosition : this.props.center;

      let place = {
        id: id,
        lat: center.lat,
        long: center.lng,
        notes: '',
        email: this.props.user.email
      };

      if(!localStorage.getItem('userPlace')) {
        localStorage.setItem('userPlace', JSON.stringify(place));
      } else {
        let p = JSON.parse(localStorage.getItem('userPlace'));

        if(p.notes.length) {
          place.notes = p.notes;
        }

        if(p.id.length) {
          place.id = p.id;
        }

        this.setState({ selectedPlace: place });
      }
    }
  }

  setCenter(place, id, placeProps) {
    // console.log(id);
    // console.log(place);
    // console.log(placeProps);

    let lat, long, lng;

    if(place && (place.id == id || !id)) {
      ({ lat, long } = place);
      long = +long;
    } else if(placeProps && (placeProps.position || placeProps.center)) {
      ({ lat, lng } = placeProps.position ? placeProps.position : placeProps.center);
      lng = +lng;
    }

    lat = +lat;

    this.state.map && this.state.map.setCenter({lat: lat, lng: long ? long : lng});
    this.setState({activeMarkerCenter: {lat: lat, lng: long ? long : lng}});
  }

  handleSearch(e) {
    this.setState({ searchString: e.target.value });
  }


  // mapRefEl = ref => this.mapRef = ref;


 
  render() {
    /*
      */
      // let places = JSON.parse(JSON.stringify(_places));
      // let places = this.props.places;
      // places = this.props.places;

      // console.log(places);

      // console.log(this.state.selectedPlace);
      // console.log(this.state.activeMarkerCenter);

      // console.log(this.state.searchResults);
      // console.log(this.state.searchEmailResults);
      // console.log(this.state.searchNotesResults);

      // console.log(this.state.map);
      // console.log(this.state.maps);
      // console.log(this.state.bounds);
      // console.log(this.state.selectedPlace);
      // console.log(this.state.activeMarkerCenter);
      

    let center = this.state.userPosition ? this.state.userPosition : this.props.center;

    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <div
          style={{ height: '100%', width: '100%' }}
          className="d-flex"
        >
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyCalL3qcZmf7yCDDV9iYeAck0nKgJUKFm0' }}
            defaultCenter={center}
            center={this.state.activeMarkerCenter}
            defaultZoom={this.state.zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
            onClick={({x, y, lat, lng, event}) => {
              this.setState({ selectedPlace: null });
              this.setState({ activeMarkerCenter: null });
              this.setState({ editing: false });
            }}
            onChildClick={(childId, childProps) => {
              // console.log(childId, childProps.place);
              this.getPlace(childId, childProps.place, childProps);
              this.setCenter(childProps.place, childId, childProps);
            }}
            // ref={this.mapRefEl}
            onChange={({ center, zoom, bounds, marginBounds }) => {
              // console.log(center, zoom, bounds, marginBounds);
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
                  selectedPlace={this.state.selectedPlace}
                />
              ))
            }

            {/*marker for user current position*/}
            <Marker
              center={this.state.userPosition ? this.state.userPosition : this.props.center}
              defaultCenter={this.props.center}
              lat={center.lat}
              lng={center.lng}
              type={0}
              selected={this.state.selectedPlace && (this.state.selectedPlace.id === '' || JSON.parse(localStorage.getItem('userPlace')) && this.state.selectedPlace.id === JSON.parse(localStorage.getItem('userPlace')).id)}
              place={this.state.selectedPlace}
              position={{lat: center.lat, lng: center.lng}}
              userEmail={this.props.user.email}
              openNoteForm={this.openNoteForm}
              addNote={this.addNote}
              handleEditNote={this.handleEditNote}
              editing={this.state.editing}
              selectedPlace={this.state.selectedPlace}
            />
          </GoogleMapReact>
        </div>

        <div className="d-flex flex-column p-0 col-sm-3 position-fixed user-signed" style={this.state.listVisible ? {height: '100%'} : {}}>
          <div className="col-1 mw-100 px-1 pb-2 pt-1 user-controls">
            <div>
              <div className="badge badge-pill badge-success px-2 py-1">
                {this.props.user.email}
                <UserPositionIcon width={16} fill="#fff" />
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between mt-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={this.logout}
                >
                  Logout
                </button>

                <div className="">
                  

                  <ListHamburgerIcon
                    width={30}
                    onClick={() => this.setState({listVisible: !this.state.listVisible})}
                  />

                  <CenterOnUserIcon
                    width={30}
                    fill="#0083ff"
                    onClick={() => this.state.map && this.state.map.setCenter({lat: this.state.userPosition.lat, lng: this.state.userPosition.lng})}
                  />
                </div>
              </div>
            </div>
          </div>


          {/*<Search places={places} user={this.props.user} />*/}

          {
            this.state.listVisible &&
            <div className="d-flex flex-column p-0 pt-2 col-11 mw-100">
              <div className="col-1 p-0 mw-100">
                <form className="form-search-email">
                  <div className="form-group">
                    <input value={this.state.searchString} onChange={this.handleSearch} type="text" name="searchString" className="form-control" id="search-input-email" placeholder="Search" />
                  </div>
                </form>
              </div>

              <div className="col-11 p-0 mw-100">
                <div className="h-100 mw-100 position-absolute list-group list-group-flush px-2 search-results all-notes">
                {
                  places &&
                  places.filter(this.filter).map((place) => (
                    <div
                      className="list-group-item py-1 px-2 note-item"
                      key={place.id}
                      onClick={() => this.setCenter(place, null, null)}
                    >
                      <div className="note-title">{place.email}</div>
                      <div className="note-content">{place.notes}</div>
                    </div>
                  ))
                }
                </div>

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
          }
        </div>
      </div>
    );
  }
}


export default Map;
