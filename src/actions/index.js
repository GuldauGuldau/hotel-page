export function findByName(name) {
  return {
    type: 'FIND_BY_NAME',
    name,
  };
}

export function sortByRaitingASK() {
  return {
    type: 'SORT_BY_RAITING_ASK',
  };
}

export function sortByRaitingDESC() {
  return {
    type: 'SORT_BY_RAITING_DESC',
  };
}
