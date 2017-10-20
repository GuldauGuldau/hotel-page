import initialState from '../data/data.js';
import Immutable from 'seamless-immutable';

export default function reducer(state, action) {
  switch (action.type) {
      case 'FIND_BY_NAME':
        if(action.name.length) {
          return state.filter(hotel =>  {
            let reg = new RegExp(action.name, "i");
            return hotel.name.match(reg);
          });
        } else {
          return initialState;
        }
      case 'SORT_BY_RAITING_ASK':
        return [].concat(Immutable(state)).sort((a,b) => a.rating - b.rating);
      case 'SORT_BY_RAITING_DESC':
        return [].concat(Immutable(state)).sort((a,b) => b.rating - a.rating);
    }
  return state;
}
