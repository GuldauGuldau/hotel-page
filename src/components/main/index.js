// IMPORTS

// React
import React from 'react';

// Routing via React Router
import {
  Link,
  Route,
  Switch,
} from 'react-router-dom';

// <Helmet> component for setting the page title/meta tags
import Helmet from 'react-helmet';

/* ReactQL */

// NotFound 404 handler for unknown routes
import { Redirect } from 'kit/lib/routing';

import HotelList from 'src/components/hotelList.js';
import FilterSection from 'src/components/filterSection.js'

// Styles
import css from '../hotel.scss';

export default () => (
  <div className={css.content}>
    <FilterSection />
    <HotelList />
  </div>
);
