"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntlConnector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const react_intl_1 = require("react-intl");
const IntlConnector = (Component, mapStateToProps, mapDispatchToProps, preloadData = {}) => {
    const unwrappedComponent = class extends react_1.PureComponent {
        render() {
            return ((0, jsx_runtime_1.jsx)(Component, Object.assign({}, this.props, { preloadData: preloadData }), void 0));
        }
    };
    const connectedComponent = mapStateToProps || mapDispatchToProps
        ? (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(unwrappedComponent)
        : unwrappedComponent;
    const wrappedComponent = (0, react_intl_1.injectIntl)(connectedComponent);
    return wrappedComponent;
};
exports.IntlConnector = IntlConnector;
//# sourceMappingURL=IntlConnector.js.map