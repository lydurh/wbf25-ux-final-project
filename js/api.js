export const header = new Headers({
  'X-Session-Token': sessionStorage.getItem('user_token')
});