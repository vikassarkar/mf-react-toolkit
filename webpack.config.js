/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
const { WebpackBuild } = require('mf-transpiler-configurations');

const getPassedParms = function () {
    const paramsObj = {};
    const rootpath = process.cwd();
    const paramsArr = process.argv.slice(2);
    for (const param of paramsArr) {
        if (param) {
            const splitParams = param.split('=');
            paramsObj[splitParams[0].replace(new RegExp('--|-', 'g'), '')] = splitParams[1];
        }
    }
    return {
        rootpath,
        htmlTemplate: '',
        devLauncherFile: '',
        styleRootpath: '',
        bundleName: paramsObj.bundleName || null,
        appType: paramsObj.appType || 'NA',
        env: paramsObj.env || 'NA',
        port: paramsObj.port || 4500,
        isTs: true
    };
};
const passedParams = getPassedParms();
const WebpackBuildInst = new WebpackBuild(passedParams);
WebpackBuildInst.runBuildProcess();
