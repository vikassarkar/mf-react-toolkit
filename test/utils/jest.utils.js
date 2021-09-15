import React from 'react';
import _get from 'lodash/get';
import { create, act } from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { LocaleProvider } from '../../src/contexts';

const allBaseConfigs = {
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

export const baseConfiguration = { ...allBaseConfigs };

/**
 * redux logic process required arguments mock
 */
export const getReduxLogicProcessArg = () => (
    {
        dispatch: jest.fn(),
        done: jest.fn(),
        getStateAndAction: {
            getState: jest.fn(() => ({})),
            action: jest.mock()
        }
    }
);

/**
 * mocked store
 */
export const getMockHistory = () => (
    {
        length: 1,
        action: jest.mock(),
        location: {
            key: 'ac3df4',
            pathname: '/styleguide',
            search: '?some=search-string',
            state: jest.mock(),
            hash: '#/styleguide'
        },
        push: jest.fn(),
        replace: jest.fn(),
        go: jest.fn(),
        goBack: jest.fn(),
        goForward: jest.fn(),
        block: jest.fn()
    }
);


/**
 * mocked history
 */
export const getMockStore = () => (
    {
        default: () => { },
        subscribe: jest.fn(),
        dispatch: jest.fn(),
        getState: jest.fn(() => ({}))
    }
);

/**
 * Initializing all store states
 * @param {*} storeServices 
 * @param {*} store 
 */
export const setInitialReduxState = (storeServices, store, history = false) => {
    const historyObj = history ? { ...history } : getMockHistory();
    const baseActions = _get(storeServices, 'base.baseActions', {});
    const translationActions = _get(storeServices, 'translation.translationActions', {});
    const { dispatch } = store;
    act(() => {
        dispatch(baseActions.setConfigsAction({ ...baseConfiguration }));
        dispatch(translationActions.fetchTranslationSuccessAction({ en: { slice_name: { id: 'router', defaultMessage: '' } } }));
        dispatch(baseActions.setHistoryAction({ ...historyObj }));
    });
};

/**
 * initialize store and apllication config and translator requirements for render.create
 * @param {*} storeServices 
 * @param {*} appStore 
 */
export const initializeStore = (storeServices, appStore) => {
    const appStoreData = appStore(baseConfiguration);
    const { store } = appStoreData;
    setInitialReduxState(storeServices, store);
    return appStoreData;
};

/**
 * render.create rendering standalone elements
 * @param {*} Component 
 * @param {*} props 
 */
export const renderCommonComponent = (Component, props) => (
    create(<Component {...props} />)
);

/**
 * render.create rendering widget elements with intl
 * @param {*} Component 
 * @param {*} translator 
 * @param {*} props only pass proptypes, No need of passing mapState and mapDispatch in it
 */
export const renderWidgetComponent = (Component, translator, props = {}) => {
    const { localConfigs } = baseConfiguration;
    return create(
        <IntlProvider
            key={localConfigs.defaultLanguage}
            locale={localConfigs.defaultLanguage}
            messages={translator[localConfigs.defaultLanguage]}
            defaultLocale={localConfigs.defaultLanguage || 'en-US'}
        >
            <Component {...props} />
        </IntlProvider>
    );
};

/**
 * render.create rendering Main elements
 * @param {*} Component 
 * @param {*} storeServices 
 * @param {*} appStore 
 * @param {*} properties  only pass proptypes, No need of passing mapState and mapDispatch in it
 */
export const renderMain = (Component, storeServices, appStore, properties = {}) => {
    let appStoreData;
    if (appStore.store) {
        appStoreData = appStore;
    } else {
        appStoreData = initializeStore(storeServices, appStore);
    }
    const { store, baseConfigs } = appStoreData;
    const { localConfigs } = baseConfigs;
    const props = properties.appStoreData ? { ...properties, appStoreData } : { ...properties };
    return create(
        <Provider store={store}>
            <LocaleProvider defaultLanguage={localConfigs.defaultLanguage || 'en-US'}>
                <Component {...props} />
            </LocaleProvider>
        </Provider>, { context: store }
    );
};

/**
 * render.create rendering router switch  elements
 * @param {*} Component 
 * @param {*} storeServices 
 * @param {*} appStore 
 * @param {*} properties only pass proptypes, No need of passing mapState and mapDispatch in it
 */
export const renderRouter = (Component, storeServices, appStore, properties = {}) => {
    const appStoreData = initializeStore(storeServices, appStore);
    const { store, baseConfigs } = appStoreData;
    const { localConfigs } = baseConfigs;
    const props = properties.appStoreData ? { ...properties, appStoreData } : { ...properties };
    return create(
        <Provider store={store}>
            <LocaleProvider defaultLanguage={localConfigs.defaultLanguage || 'en-US'}>
                <MemoryRouter>
                    <Component {...props} />
                </MemoryRouter>
            </LocaleProvider>
        </Provider>, { context: store }
    );
};

