"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreConnector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const StoreConnector = (Component, mapStateToProps = null, mapDispatchToProps = null, preloadData = {}) => {
    const unwrappedComponent = class extends react_1.PureComponent {
        render() {
            return ((0, jsx_runtime_1.jsx)(Component, Object.assign({}, this.props, { preloadData: preloadData }), void 0));
        }
    };
    const wrappedComponent = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(unwrappedComponent);
    return wrappedComponent;
};
exports.StoreConnector = StoreConnector;
//# sourceMappingURL=StoreConnector.js.map