import axios from 'axios';

export const FETCH_TREES_REQUESTED = 'FETCH_TREES_REQUESTED';
export const FETCH_TREES_COMPLETED = 'FETCH_TREES_COMPLETED';
export const FETCH_TREES_ERROR = 'FETCH_TREES_ERROR';

//these are actions
function fetchTreesRequested() {
  return {
    type: FETCH_TREES_REQUESTED
  };
}

function fetchTreesCompleted(trees) {
  return {
    type: FETCH_TREES_COMPLETED,
    trees
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

const initial = {
  status: null,
  error: null,
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
};

export default (state = initial, action) => reducer.hasOwnProperty(action.type) ? reducer[action.type](state, action) : state;
