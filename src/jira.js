// @jira
import fetch from 'node-fetch';
import { getAuthHeader } from './auth';
import * as QUERY from './queries';

let jiraUrl = '';

function needsCaptcha(resp) {
  return resp.headers.get('x-seraph-loginreason') === 'AUTHENTICATION_DENIED';
}

function getCaptchaUrl(resp) {
  const header = resp.headers.get('x-authentication-denied-reason');
  return header.split('=').pop();
}

function handleBadResponse(resp) {
  if (!resp.ok) {
    switch(resp.status) {
      case 403:
      if (needsCaptcha(resp)) {
        throw new Error(`CAPTCHA needed, ${getCaptchaUrl(resp)}`);
      } else {
        throw new Error('user is not authenticated');
      }

      case 401:
      throw new Error('user is not authenticated');

      case 404:
      throw new Error('appears to be an invalid Jira url');

      default:
      throw new Error(`${resp.status}: ${resp.statusText}`);
    }
  } else {
    return resp;
  }
}

export function setUrl(url) {
  jiraUrl = url;
}

export function getInfoByIssueId(issueId) {
  const auth = getAuthHeader();
  const url = `${jiraUrl}/rest/api/2/issue/${issueId}?fields=status,assignee,description`;
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: auth,
    },
  };

  return new Promise((resolve, reject) => {
    fetch(url, options)
    .then(resp => {
      if (resp.ok) {
        return resolve(resp.json());
      } else {
        reject(new Error('unable to get issue'));
      }
    });
  });
}

export function searchForIssues(jql) {
  const auth = getAuthHeader();
  const url = `${jiraUrl}/rest/api/2/search`;
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: auth,
    },
    method: 'POST',
    body: JSON.stringify({ jql }),
  };

  return fetch(url, options)
  .then(handleBadResponse)
  .then(resp => resp.json())
  .then(resp => resp.issues)
  .catch(err => {
    process.stdout.write(`unable to perform search: ${err.message}\n`);
    throw err;
  });
}

export function getMyIssues() {
  return searchForIssues(QUERY.MY_ISSUES);
}

export function getMyOpenIssues() {
  return searchForIssues(QUERY.MY_ISSUES_OPEN);
}

export function getIssue(key) {
  return getInfoByIssueId(key);
}
