import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectEvent } from '../actions/index';
import { Link } from 'react-router'
import EventList from '../containers/event-list';
import EventDetail from '../containers/event-detail';
import SearchBar from '../containers/searchbar.jsx';
import SearchResults from '../containers/search-results';

class PostIndex extends Component {
  render() {
    return (
      <div>
        <div>
          <Link to={"results"}>Results</Link>
          <Link to={"signup"}>SignUp</Link>
          <SearchBar />
          <EventList />
          <EventDetail />
        </div>
        <div>
          <h1>Search Results Below:</h1>
          <SearchResults />
        </div>
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectEvent }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PostIndex);
