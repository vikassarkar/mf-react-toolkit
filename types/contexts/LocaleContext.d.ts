import React from 'react';
declare const Context: React.Context<{
    locale: string;
    setLocale: any;
}>;
declare const LocaleProvider: (props: any) => JSX.Element;
declare const useLocale: () => {
    locale: string;
    setLocale: any;
};
export { Context as LocaleContext, LocaleProvider, useLocale };
