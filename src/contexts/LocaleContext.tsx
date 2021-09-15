import React, { useContext, useState } from 'react';

/**
 * its an application level local lang provider with root context language and language 
 * updater method it needs to be added at root level as child of redux <Provider>
 * 
 *  <Provider store={store}>
 *		<LocaleProvider>
 *			IntlConnector should be used in 
 *			Module to load descriptor/translator 
 *			<Module />
 *		</LocaleProvider>
 *	</Provider>
 *
 * and inside <Module> we can add  LanguageSwitch component for available languages selection
 * to rerender module
 **
 * using useLocale to use context and setContext
 * 
 *  function ChangeLanguage() {
 *     const { setLocale, locale: { value } } = useLocale()
 *      return (
 *          <button onClick={() => setLocale({ value: 'fr' })}>
 *              French
 *          </button>
 *      <div>{`The language is ${value}`}</div>
 *      )
 *  }
 * 
 */

const Context = React.createContext({locale : 'en-US', setLocale: null});

const LocaleProvider = (props: any): JSX.Element => {
    const [locale, setLocale] = useState('en-US');
    const { children, defaultLanguage } = props;
    const value = { locale, setLocale };
    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};
    
const useLocale = () => {
    const context = useContext(Context);
    if (context) {
        return context;
    }
    throw new Error('useLocale must be used within a LocaleProvider');
};

export { Context as LocaleContext, LocaleProvider, useLocale };
