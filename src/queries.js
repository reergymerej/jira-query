// @queries
export const MY_ISSUES = 'assignee = currentUser() ORDER BY updated DESC';
export const MY_ISSUES_OPEN = 'assignee = currentUser() AND resolution = Unresolved order by priority DESC';
