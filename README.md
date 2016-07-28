# jira-query

provides a way to connect to and query Jira

## Usage

```js
import jiraQuery from 'jira-query';

jiraQuery.getMyIssues().then(issues => issues.map(issue => {
  console.log(issue);
}));
```

The first time a request is made, required information will be loaded from
runtime config files (cwd/.jira-queryrc or ~/.jira-queryrc).  If any info is
missing, the user will be prompted to provide it.

### Runtime Config

```json
{
  "jira-url": "https://jira.whatever.com",
  "username": "mister.potato",
  "password": "correcthorsebatterystaple"
}
```

### Manual Config

To provide the configurations directly...

```js
jiraQuery.config({
  'jira-url': 'https://jira.whatever.com',
  username: 'mister.potato',
  password: 'correcthorsebatterystaple',
});
```

### Queries

**getMyIssues**  
Get issues for the current user.
```js
jiraQuery.getMyIssues().then(issues => {
  issues.map(issue => console.log(issue.key))
});
```


**getMyOpenIssues**  
Get open issues for the current user.
```js
jiraQuery.getMyOpenIssues().then(issues => {
  issues.map(issue => console.log(issue.key))
});
```


**getIssue**  
Get an issue by key.

```js
jiraQuery.getIssue('CF-25330').then(issue => {
  console.log(issue);
});
```


**jql**  
Execute a query with arbitrary jql.

```js
api.jql('reporter = currentUser()').then(issues => {
  console.log(issues.map(issue => issue.key));
});
```


---
kickstarted by [npm-boom][npm-boom]

[npm-boom]: https://github.com/reergymerej/npm-boom
