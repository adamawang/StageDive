import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchEvents } from '../actions/index';
import { browserHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {term: ''};

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({term: event.target.value});

  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.searchEvents(this.state.term);
    this.setState({ term: '' });
    browserHistory.push('/results');
  }

  render() {
    return (
    <span>
    <MuiThemeProvider>
      <form onSubmit={this.onFormSubmit} className="input-group">
        <TextField
        style={{ color: 'white' }}
        placeholder="Search for events"
        value={this.state.term}
        onChange={this.onInputChange}
        />
      <span className="button-line">
      <FlatButton type="submit" label="Search" backgroundColor="#616161" style={{ color: 'white' }} />
      </span>
      </form>
    </MuiThemeProvider>
  </span>
    )
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ searchEvents }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchBar);
