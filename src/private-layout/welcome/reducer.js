
// types
export const TYPE = (prefix => ({
  PREFIX: new RegExp(prefix, 'i'),
  // namespaces within reducer
  META: `${prefix}META`,
  DATA: `${prefix}DATA`,
  // complex actions
  CLEAR: `${prefix}CLEAR`,
  UPDATE: `${prefix}UPDATE`,
  INITIALIZE: `${prefix}INITIALIZE`,
}))('@welcome-screen/');

// actions
export const setMetaAction = options => ({ ...options, type: TYPE.META });
export const setDataAction = options => ({ ...options, type: TYPE.DATA });
export const clearAction = options => ({ ...options, type: TYPE.CLEAR });
export const updateAction = options => ({ ...options, type: TYPE.UPDATE });
export const initializeAction = options => ({ ...options, type: TYPE.INITIALIZE });

// selectors
export const selector = state => state.welcome;

// reducer
export const initialState = {
  initialized: false,
  errorMessage: null,
  expectAnswer: false,
  data: {},
};

export const reducer = (state = initialState, action) => {
  const { type, ...options } = action;
  switch (type) {
    default: return state;
    case TYPE.CLEAR: return initialState;
    case TYPE.DATA: return { ...state, data: { ...options } };
    case TYPE.META: return { ...state, ...options, data: state.data };
  }
};

export default reducer;
