// IMPORTS

/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
// HOC/decorator to listen to Redux store state
import { connect } from 'react-redux';

import FontAwesome from 'react-fontawesome';

// Styles
import css from './hotel.scss';
import faStyles from 'font-awesome/css/font-awesome.css';

@connect(state => ({ hotels: state.hotels }))
export default class HotelList extends React.PureComponent {

  getRange = (rating) => {
    let starCount = [];
    for(let i=0; i<5; i++) {
      if (i<rating) starCount.push('star')
      else starCount.push('star-o')
    }
    return (
      <div className={css.rating}>
        {starCount.map((star, index) => (
          <FontAwesome
            key={index}
            name={star}
            cssModule={faStyles}
            style={{ color: 'yellow' }}
          />
        ))}
      </div>
    )
  }

  render() {
    const hotels = this.props.hotels;
    let content = "Not found";

    if(hotels.length) {
      content = (
        <div>
          {hotels.map(hotel => (
            <div key={hotel.uuid} className={css.hotelItem} >
              <div className={css.hotelCover} style={{background: "url("+require(`static/img/${hotel.cover}`)+") center center"}}>
                <div className={css.hotelInfo}>
                  {hotel.name}
                  {this.getRange(hotel.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div>{content}</div>
    );
  }
}
