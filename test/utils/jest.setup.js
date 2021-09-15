/* eslint-disable no-var */
var Enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');
var jsdom = require('jest-environment-jsdom');
var { JSDOM } = require('jsdom');

var dom = new JSDOM();

var allBaseConfigs = {
  localConfigs: {
    persistStore: true,
    languagesList: {
      'en-US': 'English'
    },
    defaultLanguage: 'en-US',
    loaderTimeout: 2000,
    isMock: true,
    mockURL: '/mocks',
    devTool: 'true'
  },
  headerConfigs: {
    Authorization: '',
    cache: false,
    'Tracking-Id': '',
    'Content-Type': 'application/json;charset=utf-8'
  },
  envConfigs: {
    baseUrl: '/',
    authUrl: 'getAuth',
    authPayload: 'token=Bearer qwetryu',
    hostname: 'localhost',
    hostProtocol: 'http://'
  }
};

var envBaseConfigs = JSON.parse(JSON.stringify(allBaseConfigs));

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// global.window = dom.window
global.window = dom.window;
global.document = dom.window.document;
global.process = Object.create(process);
global.jsdom = jsdom;

envBaseConfigs.envConfigs = { DEV: allBaseConfigs.envConfigs };
process.env.ENV_VAR = JSON.stringify(envBaseConfigs);
