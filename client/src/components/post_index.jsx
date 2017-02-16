import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import EventList from '../containers/event-list';
import Friends from '../containers/friends';
import Artists from '../containers/artists';
import Auth from '../modules/auth';
import UpcomingEvent from '../containers/upcoming-event';

class PostIndex extends Component {
  componentWillMount() {
    if (!Auth.isUserAuthenticated()) {
      hashHistory.push('/login');
    }
  }
  render() {
    const containerStyle = {
      margin: '0px -20px 0px -20px'
    }
    const leftStyle = {
      width: '33%',
      float: 'left',
      marginTop: '10px',
    };
    const rightStyle = {
      width: '65%',
      float: 'left',
      overflow: 'scroll',
      position: 'relative',
      marginTop: '10px',
      marginLeft: '10px',
    };
    return (
      <div style={containerStyle}>
        <div style={leftStyle}>
          <UpcomingEvent style={{position: 'fixed'}} />
          <br />
          <Friends style={{position: 'fixed'}} />
          <br />
          <Artists style={{position: 'fixed'}} />
        </div>
        <div style={rightStyle}>
          <EventList />
        </div>
      </div>
    );
  }
}

export default PostIndex;
