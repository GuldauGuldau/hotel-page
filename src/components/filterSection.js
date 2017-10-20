// IMPORTS

/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
// HOC/decorator to listen to Redux store state
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

// Actions to add/remove event
import { findByName, sortByRaitingASK, sortByRaitingDESC } from 'src/actions';

// Styles
import css from './hotel.scss';
import faStyles from 'font-awesome/css/font-awesome.css';

@connect(state => ({ hotels: state.hotels }))
export default class HotelList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clearBtn: false,
      sortByRaiting: 'ASK'
    };
  }
  setRef = ref => {
    this.ref = ref;
  }

  handleFindHotel = () => {
    this.props.dispatch(findByName(this.ref.value));
    if(this.ref.value) this.setState({ clearBtn: true })
    else this.setState({ clearBtn: false })
  }

  handleClearSearch = () => {
    this.ref.value = '';
    this.props.dispatch(findByName(this.ref.value));
    this.setState({ clearBtn: false })
  }

  handleSortByRaitingASK = () => {
    this.props.dispatch(sortByRaitingASK());
    this.setState({ sortByRaiting: 'DESK' })
  }

  handleSortByRaitingDESC = () => {
    this.props.dispatch(sortByRaitingDESC());
    this.setState({ sortByRaiting: 'ASK' })
  }

  render() {
    const hotels = this.props.hotels;

    return (
      <div className={css.filterSection}>
        <div className={css.searchSection}>
          <input ref={this.setRef} type="text"  onChange={() => this.handleFindHotel()} placeholder="Search..."/>
          {this.state.clearBtn && (<div className={css.searchBtn} onClick={this.handleClearSearch}>Clear</div>)}
        </div>
        <div className={css.sortSection}>
          <div className={css.btn} onClick={() =>
            { (this.state.sortByRaiting == 'ASK') ? this.handleSortByRaitingASK() : this.handleSortByRaitingDESC() }}>
            Sort by <b>rating</b>
            <FontAwesome
              name='sort'
              cssModule={faStyles}
              className={css.sortIcon}
            />
          </div>
        </div>
      </div>
    );
  }
}
