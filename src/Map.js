import React, { Component } from 'react';

import GoogleMapReact from 'google-map-react';
// import GoogleMapMarkers from 'google-map-react';
 
import _places from './data/PLACES.json';

const Marker = ({ text, type, place, selected, userEmail, position }) => {
  return (
    <div>
      {
        type === 0
        ?
        <div className="custom-marker my-marker">{text}</div>
        :
        <div className="custom-marker place-marker">{text}</div>
      }

      {
        selected && !userEmail && <InfoWindow place={place} />
      }

      {
        selected && userEmail && <InfoWindow userEmail={userEmail} place={place} />
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
const InfoWindow = ({place, userEmail}) => {
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
    <div style={infoWindowStyle}>
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
  );
};

const handleApiLoaded = (map, maps) => {
  // console.log(map);
  // console.log(maps);
};
 
class Map extends Component {
  constructor() {
    super();

    this.state = ({
      userPosition: null,
      zoom: 5,
      selectedPlace: null
    });

    this.handlePosition = this.handlePosition.bind(this);
    this.addNote = this.addNote.bind(this);
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

  componentDidUpdate() {
    console.log('componentDidUpdate');
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

  addNote() {
    // console.log('addNote');
  }

  getPlace(id) {
    let i = _places.findIndex((p) => p.id === id);
    // console.log(i);
    // console.log(_places[i]);

    _places[i] && this.setState({ selectedPlace: _places[i] });

    if(i === -1) {
      // наш маркер

      let center = this.state.userPosition ? this.state.userPosition : this.props.center;

      let place = {
        id: '',
        lat: center.lat,
        long: center.lng,
        notes: '',
        email: this.props.user.email
      };

      console.log(place);

      this.setState({ selectedPlace: place });
    }
  }

  getUserPlace() {

  }


 
  render() {
    let places = JSON.parse(JSON.stringify(_places));
    // console.log(places);
    console.log(this.state.selectedPlace);

    let center = this.state.userPosition ? this.state.userPosition : this.props.center;

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
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
            console.log(e);
            this.getPlace(e);
          }}
        >
          {
            places.map((place) => (
              <Marker
                center={{lat: place.lat, lng: place.long}}
                defaultCenter={[place.lat, place.long]}
                key={place.id}
                lat={place.lat}
                lng={place.long}
                place={place}
                selected={this.state.selectedPlace && this.state.selectedPlace.id === place.id}
                text={''}
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
          />
        </GoogleMapReact>
      </div>
    );
  }
}


export default Map;
