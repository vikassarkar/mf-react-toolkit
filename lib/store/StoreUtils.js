"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogic = exports.actionsPayload = exports.createActionTypes = exports.actionsToComputedPropertyName = void 0;
const redux_logic_1 = require("redux-logic");
const actionsToComputedPropertyName = (actions) => (Object.keys(actions).reduce((symbols, key) => (Object.assign(Object.assign({}, symbols), { [key]: (actions[key]) && (actions[key]).toString() })), {}));
exports.actionsToComputedPropertyName = actionsToComputedPropertyName;
const createActionTypes = (types) => (types.reduce((previousValue, currentValue) => {
    const updatedPrevValue = Object.assign({}, previousValue);
    updatedPrevValue[currentValue] = currentValue;
    return updatedPrevValue;
}, {}));
exports.createActionTypes = createActionTypes;
const actionsPayload = (payload, slice) => {
    const storePayload = typeof payload === 'object' && !Array.isArray(payload)
        ? Object.assign(Object.assign({}, payload), { slice }) : { payload, slice };
    return storePayload;
};
exports.actionsPayload = actionsPayload;
const httpLogic = (props) => {
    const reduxApiLogic = {};
    reduxApiLogic.type = props.type;
    reduxApiLogic.latest = props.latest || true;
    reduxApiLogic.cancelType = props.cancelType || `${props.type}_CANCEL`;
    if (props.processOptions) {
        reduxApiLogic.processOptions = {};
        reduxApiLogic.processOptions.dispatchReturn = props.processOptions.dispatchReturn || false;
        reduxApiLogic.processOptions.dispatchMultiple = props.processOptions.multipleDispatch || false;
        if (reduxApiLogic.processOptions.dispatchReturn) {
            reduxApiLogic.processOptions.successType = (payload) => ({
                type: `${props.type}_SUCCESS`,
                payload: (0, exports.actionsPayload)(payload, props.slice || null)
            });
        }
    }
    else {
        reduxApiLogic.processOptions = {};
    }
    reduxApiLogic.processOptions.failType = (error) => ({
        type: `${props.type}_FAILURE`,
        payload: (0, exports.actionsPayload)(error.response || error, props.slice),
        error: true
    });
    if (props.payloadSchema) {
        reduxApiLogic.validate = ({ action }, allow, reject) => {
            if (action.payload) {
                allow(action);
            }
            else {
                reject();
            }
        };
    }
    reduxApiLogic.process = props.process;
    reduxApiLogic.warnTimeout = props.warnTimeout || 0;
    return (0, redux_logic_1.createLogic)(reduxApiLogic);
};
exports.httpLogic = httpLogic;
//# sourceMappingURL=StoreUtils.js.map