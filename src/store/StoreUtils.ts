import { createLogic } from 'redux-logic';

/**
 * Returns actiontype string based on action
 * @param {*} actions 
 */
export const actionsToComputedPropertyName: any = (actions: any) => (
	Object.keys(actions).reduce((symbols, key) =>
		({ ...symbols, [key]: (actions[key]) && (actions[key]).toString() }), {})
);

/**
 * Returns actiontype string
 * @param {*} types 
 */
export const createActionTypes: any = (types: any) => (
	types.reduce((previousValue: any, currentValue: any) => {
		const updatedPrevValue = { ...previousValue };
		updatedPrevValue[currentValue] = currentValue;
		return updatedPrevValue;
	}, {})
);

/**
 * Returns updated payload
 * @param {*} payload 
 * @param {*} slice 
 */
export const actionsPayload: any = (payload: any, slice: any) => {
	const storePayload = typeof payload === 'object' && !Array.isArray(payload)
		? { ...payload, slice } : { payload, slice };
	return storePayload;
};

/**
 * Returns redux logic
 * @param {*} props 
 */
export const httpLogic: any = (props: any) => {
	const reduxApiLogic: any = {};
	reduxApiLogic.type = props.type;
	reduxApiLogic.latest = props.latest || true;
	reduxApiLogic.cancelType = props.cancelType || `${props.type}_CANCEL`;
	if (props.processOptions) {
		reduxApiLogic.processOptions = {};
		reduxApiLogic.processOptions.dispatchReturn = props.processOptions.dispatchReturn || false;
		reduxApiLogic.processOptions.dispatchMultiple = props.processOptions.multipleDispatch || false;
		if (reduxApiLogic.processOptions.dispatchReturn) {
			reduxApiLogic.processOptions.successType = (payload: any) => ({
				type: `${props.type}_SUCCESS`,
				payload: actionsPayload(payload, props.slice || null)
			});
		}
	} else {
		reduxApiLogic.processOptions = {};
	}
	reduxApiLogic.processOptions.failType = (error: any) => ({
		type: `${props.type}_FAILURE`,
		payload: actionsPayload(error.response || error, props.slice),
		error: true
	});
	if (props.payloadSchema) {
		reduxApiLogic.validate = ({ action }, allow: any, reject: any) => {
			if (action.payload) {
				allow(action);
			} else {
				reject();
			}
		};
	}
	reduxApiLogic.process = props.process;
	reduxApiLogic.warnTimeout = props.warnTimeout || 0;
	return createLogic(reduxApiLogic);
};
