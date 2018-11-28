import axios from 'axios';

export const FETCH_TREES_REQUESTED = 'FETCH_TREES_REQUESTED';
export const FETCH_TREES_COMPLETED = 'FETCH_TREES_COMPLETED';
export const FETCH_TREES_ERROR = 'FETCH_TREES_ERROR';

export const TREES_SET_CURRENT = 'TREES_SET_CURRENT';

function fetchTreesRequested() {
  return {
    type: FETCH_TREES_REQUESTED
  };
}

function fetchTreesCompleted(trees) {
  return {
    type: FETCH_TREES_COMPLETED,
    sites
  };
}

function fetchTreesError(error) {
  return {
    type: FETCH_TREES_ERROR,
    error
  };
}

export function fetchTrees() {
  return dispatch => {
    dispatch(fetchTreesRequested());

    axios
    .get('/api/trees')
    .then((response) => {
      dispatch(fetchTreesCompleted(response.data));
    })
    .catch(error => {
      dispatch(fetchTreesError(error));
    });
  }
}

export function treesSetCurrent(id) {
  return {
    type: TREES_SET_CURRENT,
    id
  };
}

const initial = {
  status: null,
  error: null,
  selected: null,
  byId: {},
  ids: []
};

const reducer = {
  [FETCH_TREES_REQUESTED](state, action) {
    return {
      ...state,
      status: FETCH_TREES_REQUESTED
    };
  },
  [FETCH_TREES_COMPLETED](state, action) {
    return {
      ...state,
      status: FETCH_TREES_COMPLETED,
      error: null,
      selected: action.trees.ids.length > 0 ? action.trees.ids[0] : null,
      ...action.trees
    };
  },
  [FETCH_TREES_ERROR](state, action) {
    return {
      ...state,
      status: FETCH_TREES_ERROR,
      error: action.error
    };
  },
  [TREES_SET_CURRENT](state, action) {
    return {
      ...state,
      selected: action.id
    };
  }
};

export default (state = initial, action) => reducer.hasOwnProperty(action.type) ? reducer[action.type](state, action) : state;
