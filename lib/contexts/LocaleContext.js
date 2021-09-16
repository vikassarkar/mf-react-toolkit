"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocale = exports.LocaleProvider = exports.LocaleContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const Context = react_1.default.createContext({ locale: 'en-US', setLocale: null });
exports.LocaleContext = Context;
const LocaleProvider = (props) => {
    const [locale, setLocale] = (0, react_1.useState)('en-US');
    const { children, defaultLanguage } = props;
    const value = { locale, setLocale };
    return ((0, jsx_runtime_1.jsx)(Context.Provider, Object.assign({ value: value }, { children: children }), void 0));
};
exports.LocaleProvider = LocaleProvider;
const useLocale = () => {
    const context = (0, react_1.useContext)(Context);
    if (context) {
        return context;
    }
    throw new Error('useLocale must be used within a LocaleProvider');
};
exports.useLocale = useLocale;
//# sourceMappingURL=LocaleContext.js.map