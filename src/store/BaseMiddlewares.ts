import { logger } from '../utility/ConsoleLogger';

/**
 * middleware to log action and store details
 * @param {*} store 
 */
export const loggerMiddleware = (store: any) => (
	(next: any) => (action: any) => {
		let returnValue: any;
		const reduxErrorAction = action.type && action.type.split('/').length > 1;
		if (reduxErrorAction) {
			const baseErrorType = action.type.split('/')[0].split('__')[0];
			const scopeErrorType = action.type.split('/')[1].split('__')[0];
			logger.info('Store will dispatch :');
			logger.log({ type: baseErrorType, payload: action.payload });
			logger.log({ type: scopeErrorType, payload: action.payload });
			returnValue = next(action);
			logger.info('Store state after dispatch :');
			logger.log(store.getState());
		} else {
			logger.info('Store will dispatch :');
			logger.log(action);
			returnValue = next(action);
			logger.info('Store state after dispatch :');
			logger.log(store.getState());
		}
		return returnValue;
	}
);

/**
 * custom reducer logger middleware
 * @param {*} store 
 */
export const reducerLoggerMiddleware = (store: any) => (next: any) => (action: any) => (
	next({ ...action, getState: store.getState })
);
