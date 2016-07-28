let encodedCredentials = null;

export function getAuthHeader() {
  return encodedCredentials
    ? `Basic ${encodedCredentials}`
    : null;
}

export function setCredentials(username, password) {
  return encodedCredentials = (username && password)
    ? new Buffer(`${username}:${password}`).toString('base64')
    : null;
}
