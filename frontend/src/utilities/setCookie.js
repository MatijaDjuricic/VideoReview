import Cookie from 'js-cookie';
const setCookie = (cookiename, usrin) => {
  Cookie.set(cookiename, usrin, {
    expires: 3,
    secure: true,
    sameSite: 'strict'
  });
}
export default setCookie;