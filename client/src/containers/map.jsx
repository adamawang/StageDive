import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { GoogleApiWrapper } from 'google-maps-react';
import ReactDOM from 'react-dom';
import { getLocalEvents, getLocation, showLocalEvents } from '../actions/index';
import { Card, CardHeader } from 'material-ui/Card';
import moment from 'moment'
import GMAPS from '../containers/gmaps'

//Map component
class Map extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.loadMap();
    }, 150);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  loadMap() {
    const { google } = this.props;
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);
      let crd;
      //Geolocation and Local Events marker renderers.
      const position = navigator.geolocation.getCurrentPosition((pos) => {
        const zoom = 13;
        crd = pos.coords;
        getLocation(crd)
            .then((val) => {
              const localEvents = val.type;
              return localEvents;
            })
            .then((location) => {
              return this.props.getLocalEvents(location);
            })
            .then((value) => {
              return this.props.localEvents.payload.resultsPage;
            })
            .then((events) => {
              return events.filter((value) => {
                return value.status === 'ok';
              }).map((value, i) => {
                return {
                  id: i,
                  displayName: value.displayName,
                  venue: value.venue.displayName,
                  longitude: value.venue.lng,
                  latitude: value.venue.lat,
                  uri: value.uri,
                  date: value.start.date,
                  time: value.start.time,
                }
              }).filter((startTime) => {
                return startTime.time !== null;
              })
            })
            .then((concert) => {
              this.props.showLocalEvents(concert);

              let val;
              return concert.map((value, i) => {
                return {
                  value: i,
                  infowindow: new google.maps.InfoWindow({
                    content: '<div>' + '<p><strong>' + value.displayName + '</strong></p>' + '<p>' + value.venue + '</p>' + '<p>' + value.date + '</p>' + '<p>' + value.time + '</p>' + '</div>'
                  }),
                  markers: new google.maps.Marker({
                    position: new google.maps.LatLng(value.latitude, value.longitude),
                    map: mapRef,
                  }),
                }
              })
            })
            .then((mark) => {
              return mark.forEach((marking) => {
                  marking.markers.setMap(this.map);
                  marking.markers.addListener('mouseover', function() {
                    marking.infowindow.open(marking.markers.map, marking.markers);
                  });
                  marking.markers.addListener('mouseout', function() {
                    marking.infowindow.close(marking.markers.map, marking.markers);
                  })
              });
            })

        const center = new maps.LatLng(crd.latitude, crd.longitude)

        const mapConfig = Object.assign({}, {
          center: center,
          zoom: zoom,
        })

        this.map = new maps.Map(node, mapConfig);

        var currentLocation = {
          infowindow: new google.maps.InfoWindow({
            content: '<div><p><strong>You are here</strong></p></div>'
          }),
          marker: new maps.Marker({
            position: center,
            map: mapRef,
            icon: `http://i.imgur.com/hbWVo7x.png`,
          }),
        }

        currentLocation.marker.setMap(this.map);
        currentLocation.marker.addListener('mouseover', function() {
          currentLocation.infowindow.open(currentLocation.marker.map, currentLocation.marker);
        });
        currentLocation.marker.addListener('mouseout', function() {
          currentLocation.infowindow.close(currentLocation.marker.map, currentLocation.marker);
        })
        return this.map
      })
    }
  }

  render() {
    const style = {
      width: '100%',
      height: '100%',
    };

    return (
      <div ref='map' style={style}>
        Loading..
      </div>
    );
  }
}

//Events component
export class MapComponent extends React.Component {
  renderEvents() {
    if(!this.props.showEvents.payload) {
      return (
        <div>Loading Events</div>
      );
    }
    return this.props.showEvents.payload.map((value, i) => {
      const momentDate = moment(value.date).format('LL');
      const est = moment(value.date)._d;
      const date = momentDate.toString() + ' ' + est.toString().slice(39);
      const time = moment(value.time, 'HH:mm:ss').format('h:mm A')

      return (
        <Card key={i} >
          <CardHeader
            title={value.displayName}
            subtitle={<div><div>{value.venue}</div><div>{date}</div><div>{time}</div></div>}
          />
        </Card>
      );
    });
  }
  render() {

    const style = {
      width: '33vw',
      height: '33vh',
      minWidth: '300px',
      float: 'left',
    }
    const eventStyle = {
      float: 'left',
      width: '50%',
      minWidth: '300px',
    }
    const over = {
      overflow:'scroll',
      height: '1100px',
    }
    const mapStyle = {
      width: '100%',
    }
    return (
      <div>
        <div ref="map" style={style}>
          <h1>Explore</h1>
          <Map style={mapStyle} {...this.props} object={[]} />
        </div>
        <div style={eventStyle}>
          <h1>Local Events</h1>
          <div style={over}>{this.renderEvents()}</div>
        </div>
      </div>
    );
  }
}

//API Key needed for GoogleMaps
const googleWrapped = GoogleApiWrapper({ apiKey: GMAPS })(MapComponent);

function mapStateToProps(state) {
  return {
    localEvents: state.getLocalEvents,
    showEvents: state.showLocalEvents,
  };
}

export default connect(mapStateToProps, { getLocation, getLocalEvents, showLocalEvents })(googleWrapped);
