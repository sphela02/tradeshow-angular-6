// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiServiceURL: 'http://localhost:4201/tradeshowtravel/api',
  apiPiServiceURL: 'http://localhost:4201/tradeshowtraveldownloads/api',
  imgLibraryURL: 'https://tradeshowtravel-dev.l3harris.com/photos',
  authority: 'https://sso.l3harris.com/ofisid/api/discovery',
  clientId: 'https://tradeshowtravel-local.harris.com:4200/',
  redirectUri: 'http://localhost:4200/auth-callback/',
  postLogoutRedirectUri: 'http://localhost:4200/',
  silentRedirectUri: 'http://localhost:4200/auth-callback?silent=true',
  refererUrlKey: 'referer_url'
};
