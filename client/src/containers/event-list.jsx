import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Snackbar from 'material-ui/Snackbar';
import Delete from 'material-ui/svg-icons/action/delete';
import Description from 'material-ui/svg-icons/action/description';
import LinearProgress from 'material-ui/LinearProgress';
import { Link } from 'react-router';
import moment from 'moment';
import FriendsEvents from './friends-events';
import { getUserEvents, getUserInfo, removeEvent, getEvents, getFriendsEvents } from '../actions/index';
import Divider from 'material-ui/Divider';


class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: 'myEvents',
    };
  }
  componentDidMount() {
    const id = localStorage.getItem('id');
    const user = { id };
    this.props.getUserInfo();
    this.props.getUserEvents(user);
  }
  handleTouchTap() {
    this.setState({
      open: true,
    });
  }
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }
  handleChangeTab(value) {
    this.setState({
      value,
    });
  }
  renderList() {
    const id = localStorage.getItem('id');
    const cardStyle = {
      marginBottom: '10px',
    };
    const imageStyle = {
      width: '100%',
    };
    const menuStyle = {
      float: 'right',
      height: '0%',
    };

    const largestPic = (imageArray) => {
      let largest = 0;
      let index;
      imageArray.forEach((image, i) => {
        if (image.width > largest) {
          largest = image.width;
          index = i;
        }
      });
      return imageArray[index].url;
    };

    if (!this.props.events.futureEvents) {
      return (
        <div>
          <LinearProgress mode="indeterminate" />
        </div>
      );
    }

    return this.props.events.futureEvents.slice(1).map((event, i) => {
      const momentDate = moment(event.date).format('LLLL');
      const momentFromNow = moment(event.date).fromNow();
      const est = moment(event.date)._d;
      const artist = JSON.parse(event.artist_name).map((performer) => performer.name);
      const date = momentDate.toString() + ' ' + est.toString().slice(34);
      let image = null;
      if (event.image) {
        image = largestPic(JSON.parse(event.image)) || null;
      }
      const venue = JSON.parse(event.venue)[0];
      let venueName = null;
      let venueStateOrCountry = null;
      if (venue.state) {
        venueName = venue.state.name;
        venueStateOrCountry = venue.state.stateCode;
      } else if (venue.country) {
        venueName = venue.country.name;
        venueStateOrCountry = venue.country.countryCode;
      }
      return (
        <Card key={event.id} className="list-group-item event-list-card-style" zDepth={1}>
          <CardMedia
            overlay={
              <CardTitle
                title={event.name}
                subtitle={venue.city.name + ', ' + momentFromNow.toString()}
              />
            }
          >
            <img src={image} className="event-list-image-style" />
          </CardMedia>
          <IconMenu
            className="event-list-menu-style"
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <Link to={`/event/${id}/${event.id}`}>
              <MenuItem primaryText="Details" rightIcon={<Description />} secondary />
            </Link>
            <Divider />
            <MenuItem
              primaryText="Remove"
              secondary
              onTouchTap={this.handleTouchTap}
              rightIcon={<Delete />}
              onClick={() => this.props.removeEvent(event.tm_id, i + 1)}
            />
            <Snackbar
              open={this.state.open}
              message="Event Removed"
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
            />
          </IconMenu>
          <CardText>
            <span><strong>Listed acts: </strong>{artist.join(', ')}</span>
            <br />
            <span><strong>Venue: </strong>{venue.name}</span>
            <br />
            <span><strong>Event Start: </strong>{date}</span>
          </CardText>
          <CardActions>
            <Link to={`/event/${id}/${event.id}`}>
              <FlatButton label="Event Details" secondary />
            </Link>
            <a href={event.event_url}><FlatButton label="Buy Tickets" secondary /></a>
          </CardActions>
        </Card>
      );
    });
  }
  render() {
    const tabStyle = {
      backgroundColor: 'white',
      color: 'black',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      borderRadius: '2px',
    };
    return (
      <Tabs className="event-list-tabs-style">
        <Tab style={tabStyle} label="My Events" value="myEvents" >
          {this.renderList()}
        </Tab>
        <Tab style={tabStyle} label="Friends Events" value="friendsEvents">
          <FriendsEvents {...this.props} />
        </Tab>
      </Tabs>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.userEvents,
    friendsEvents: state.getFriendsEvents,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUserEvents, getUserInfo, removeEvent, getEvents, getFriendsEvents }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
