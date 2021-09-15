import React, { ComponentType, PureComponent } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

/**
 * its an higher order component to provide selected local language messages 
 * and store states and dispatchers
 *               **
 * it will get messages from translator.js to widget or component 
 * (comp with check then from props.intl.messages).
 * const FooterContainer = IntlMessagesConnector(FooterWidget, Translator);
 * after this statement, messages can be directly provided by just passing ID
 * <FormattedMessage id="LOGIN_TITLE" />
 *               **
 * it will get all states from store and will provide dispatch method from 
 * store to trigger any action
 * mapStateToProps provide with arg of state, we can select specifiic store reducers to be passed
 * in components props, and as its 2 way binding any thing changes in store, component will rerender
 * const mapStateToProps = (state) => ({ rbp: state.rbp });
 * mapDispatchToProps provide with dispatch method from store you can get any action 
 * and dispatch it here to update or add store 
 * const mapStateToProps = (dispatch) => (dispatch(actionName(data)));
 * @param {*} Component 
 * @param {*} mapStateToProps 
 * @param {*} mapDispatchToProps 
 * @param {*} preloadData
 */
export const IntlConnector = (Component: ComponentType<any>, mapStateToProps: any, mapDispatchToProps: any, preloadData: any = {}) => {
	const unwrappedComponent = class extends PureComponent<any, any> {
		render() {
			return (
				<Component
					{...this.props}
					preloadData={preloadData}
				/>
			);
		}
	};
	const connectedComponent = mapStateToProps || mapDispatchToProps
		? connect(mapStateToProps, mapDispatchToProps)(unwrappedComponent)
		: unwrappedComponent;
	const wrappedComponent = injectIntl(connectedComponent);
	return wrappedComponent;
};
