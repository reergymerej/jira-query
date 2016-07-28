// @init
/**
* init loads config from rc files, prompts user for missing info,
* and sets variables for url and credentials
*/
import prompt from 'prompt';
import { setCredentials } from './auth';
import { setUrl } from './jira';
import { getConfig } from './config';

// resolves once we have all the required info,
// either from config file or user
export default function init() {
  return new Promise((resolve, reject) => {
    const config = getConfig();
    const properties = {
      ['jira-url']: {
        description: 'Jira url',
        required: true,
      },
      username: {
        description: 'Jira username',
        required: true,
      },
      password: {
        description: 'Jira password',
        required: true,
        hidden: true,
      },
    };

    // Delete those we got from the config.
    if (config) {
      Object.keys(config).map(key => {
        delete properties[key];
      });
    }

    // Prompt for remaining properties.
    if (Object.keys(properties).length) {
      prompt.message = '';
      const schema = { properties };

      prompt.start();
      prompt.get(schema, (err, result) => {
        return err
        ? reject(err)
        : resolve((() => {
          const username = (config && config.username) || result.username;
          const password = (config && config.password) || result.password;
          const jiraUrl = (config && config['jira-url']) || result['jira-url'];
          setCredentials(username, password);
          setUrl(jiraUrl);
        })());
      });
    } else {
      setCredentials(config.username, config.password)
      setUrl(config['jira-url']);
      resolve();
    }
  });
}
