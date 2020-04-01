
// configuration parameters for all application
import config from './app-config';

// ON debug mode for production using url params
config.DEBUG = config.DEBUG ? true : /show_DEBUG/.test(window.location.href);

config.DEBUG
&&console.info('%c CONFIG ', 'background: #EC1B24; color: #000; font-weight: bolder; font-size: 30px;'
  , '\n full ENV:', process.env
  , '\n NODE_ENV:', process.env.NODE_ENV
  , '\n REACT_APP_ENV:', process.env.REACT_APP_ENV
  , '\n config:', config
);

export default config;
export { config };
