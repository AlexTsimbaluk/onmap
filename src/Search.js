import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

class Search extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.filterEmail = this.filterEmail.bind(this);
    this.filterNotes = this.filterNotes.bind(this);

    this.state = {
      searchString: ''
    };
  }

  componentDidMount() {
    // console.log(JSON.parse(JSON.stringify(_places)));
  }

  componentDidUpdate() {
    // console.log(this.state.searchString);
  }

  handleChange(e) {
    this.setState({ searchString: e.target.value });
  }

  filterEmail(place) {
    if(this.state.searchString.length < 3) return;

    for(let key in place) {
      if(key === 'email') {
        return place[key].search(this.state.searchString) !== -1;
      }
    }
  }

  filterNotes(place) {
    if(this.state.searchString.length < 3) return;

    for(let key in place) {
      if(key === 'notes') {
        return place[key].search(this.state.searchString) !== -1;
      }
    }
  }

  render() {
    return (
      <div className="">
        <div className="">
          <form className="form-search-email">
            <div className="form-group">
              <label htmlFor="search-input-email">Search anything</label>
              <input value={this.state.searchString} onChange={this.handleChange} type="text" name="searchString" className="form-control" id="search-input-email" placeholder="Search" />
            </div>

            {/*<button type="submit" onClick={} className="btn btn-primary">Search</button>*/}
          </form>

          <div className="search-results">
          {
            this.props.places &&
            this.props.places.filter(this.filterEmail).map((place) => (
              <div
                key={place.id}
              >
                <div>{place.email}</div>
              </div>
            ))
          }
          </div>
        </div>

        <div className="">
          <form className="form-search-notes">
            <div className="form-group">
              <label htmlFor="search-input-notes">Search anything</label>
              <input value={this.state.searchString} onChange={this.handleChange} type="text" name="searchString" className="form-control" id="search-input-notes" placeholder="Search" />
            </div>

            {/*<button type="submit" onClick={} className="btn btn-primary">Search</button>*/}
          </form>

          <div className="search-results">
          {
            this.props.places &&
            this.props.places.filter(this.filterNotes).map((place) => (
              <div
                key={place.id}
              >
                <div>{place.notes}</div>
              </div>
            ))
          }
          </div>
        </div>
      </div>
    );
  }
}

export default Search;