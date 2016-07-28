import _init from './init';
import {setConfig} from './config';
import {
  getMyIssues,
  getMyOpenIssues,
  getIssue,
  searchForIssues,
} from './jira';

const api = {
  config: setConfig,
};

let initPromise;

function init() {
  initPromise = initPromise || _init();
  return initPromise;
}

Object.assign(api, {
  getMyIssues(...args) {
    return init().then(() => getMyIssues(...args))
  },
  getMyOpenIssues(...args) {
    return init().then(() => getMyOpenIssues(...args))
  },
  getIssue(...args) {
    return init().then(() => getIssue(...args))
  },
  jql(...args) {
    return init().then(() => searchForIssues(...args))
  }
});

export default api;
