
// types
export const TYPE = (prefix => ({
  PREFIX: new RegExp(prefix, 'i'),
  // simple action
  META: `${prefix}META`,
  CLEAR: `${prefix}CLEAR`,
  // complex actions
  INITIALIZE: `${prefix}INITIALIZE`,
  TOGGLE_ASIDE: `${prefix}TOGGLE_ASIDE`,
  SUBMIT_SEARCH_FORM: `${prefix}SUBMIT_SEARCH_FORM`,
}))('@layout/');

// actions
export const clearAction = options => ({ ...options, type: TYPE.CLEAR });
export const setMetaAction = options => ({ ...options, type: TYPE.META });
export const initializeAction = options => ({ ...options, type: TYPE.INITIALIZE });
export const toggleAsideAction = options => ({ ...options, type: TYPE.TOGGLE_ASIDE });
export const submitSearchForm = options => ({ ...options, type: TYPE.SUBMIT_SEARCH_FORM });

// selectors
export const selector = state => state.layout;

// configuration
const initialState = {
  // NOTE side navigation menu to provide ability to control menu items we should store it
  menu: [],
  search: '',
  expanded: true,
  lastOpened: null,
  showSearch: false,
  initialized: false,
};

export const reducer = (state = initialState, action) => {
  const { type, ...options } = action;
  switch (type) {
    default: return state;
    case TYPE.CLEAR: return initialState;
    case TYPE.META: return { ...state, ...options };
  }
};

export default reducer;
