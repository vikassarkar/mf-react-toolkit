import React, { ComponentType, PureComponent } from 'react';
import { connect } from 'react-redux';

/**
 * its an higher order component to provide store states and dispatchers
 * it will get all states from store and will provide dispatch method from 
 * store to trigger any action
 * mapStateToProps provide with arg of state, we can select specifiic store reducers to be passed 
 * in components props, and as its 2 way binding any thing changes in store, 
 * component will re render ro replicate it on screen
 * const mapStateToProps = (state) => ({ rbp: state.rbp });
 * mapDispatchToProps provide with dispatch method from store you can get any action 
 * and dispatch it here to update or add store 
 * const mapDispatchToProps = (dispatch) => (dispatch(actionName(data))); 
 * @param {*} Component 
 * @param {} mapStateToProps 
 * @param {} mapDispatchToProps 
 * @param {} preloadData 
 */
export const StoreConnector = (Component: ComponentType<any>, mapStateToProps: any = null, mapDispatchToProps: any = null, preloadData: any = {}) => {
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
	const wrappedComponent = connect(mapStateToProps, mapDispatchToProps)(unwrappedComponent);
	return wrappedComponent;
};
