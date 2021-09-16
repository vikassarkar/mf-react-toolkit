"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntlStoreConnector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_intl_1 = require("react-intl");
const get_1 = __importDefault(require("lodash/get"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const contexts_1 = require("../contexts");
const IntlConnector_1 = require("./IntlConnector");
const IntlStoreConnector = (Component, messagesObj, appStore = null, mapStateToProps = null, mapDispatchToProps = null, preloadData = {}) => (class extends react_1.PureComponent {
    getSliceName() {
        const availLanguages = Object.keys(messagesObj);
        const firstLanguage = availLanguages[0];
        return messagesObj[firstLanguage].slice_name.id;
    }
    getDefaultMessages() {
        if (appStore && typeof appStore === 'function') {
            const { store } = appStore();
            const { getState } = store;
            const sliceName = this.getSliceName();
            const translator = (0, get_1.default)(getState(), 'translator', {});
            const isEmptyTranslator = (0, isEmpty_1.default)(translator) || translator.error;
            return isEmptyTranslator ? messagesObj : translator[sliceName];
        }
        return messagesObj;
    }
    render() {
        const InjectedComponent = (0, IntlConnector_1.IntlConnector)(Component, mapStateToProps, mapDispatchToProps, preloadData);
        return ((0, jsx_runtime_1.jsx)(contexts_1.LocaleContext.Consumer, { children: ({ locale }) => ((0, jsx_runtime_1.jsx)(react_intl_1.IntlProvider, Object.assign({ locale: locale, messages: this.getDefaultMessages()[locale], defaultLocale: locale || 'en-US' }, { children: (0, jsx_runtime_1.jsx)(InjectedComponent, Object.assign({}, this.props, { preloadData: preloadData }), void 0) }), locale)) }, void 0));
    }
});
exports.IntlStoreConnector = IntlStoreConnector;
//# sourceMappingURL=IntlStoreConnector.js.map