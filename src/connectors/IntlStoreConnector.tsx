import React, { ComponentType, PureComponent } from 'react';
import { IntlProvider } from 'react-intl';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { LocaleContext } from '../contexts';
import { IntlConnector } from './IntlConnector';

/**
 * its an higher order component to provide selected local language messages
 * it will get messages from translator.js to widget or component 
 * (comp with check then from props.intl.messages).
 * const FooterContainer = LocalizeConnector(FooterWidget, Translator);
 * after this statement, messages can be directly provided by just passing ID
 * <FormattedMessage id="LOGIN_TITLE" />
 * @param {*} Component 
 * @param {*} messagesObj
 * @param {} mapStateToProps 
 * @param {} mapDispatchToProps 
 * @param {} preloadData 
 */

export const IntlStoreConnector = (Component: ComponentType<any>, messagesObj: object, appStore: any = null, mapStateToProps: any = null, mapDispatchToProps: any = null, preloadData: any = {}) => (
	class extends PureComponent<any, any>{
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
				const translator = _get(getState(), 'translator', {});
				const isEmptyTranslator = _isEmpty(translator) || translator.error;
				return isEmptyTranslator ? messagesObj : translator[sliceName];
			}
			return messagesObj;
		}

		render() {
			const InjectedComponent = IntlConnector(Component, mapStateToProps, mapDispatchToProps, preloadData);
			return (
				<LocaleContext.Consumer>
					{({ locale }) => (
						<IntlProvider
							key={locale}
							locale={locale}
							messages={this.getDefaultMessages()[locale]}
							defaultLocale={locale || 'en-US'}
						>
							<InjectedComponent
								{...this.props}
								preloadData={preloadData}
							/>
						</IntlProvider>
					)}
				</LocaleContext.Consumer>
			);
		}
	}
);
