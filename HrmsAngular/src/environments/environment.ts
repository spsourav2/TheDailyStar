// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl:'http://localhost:9113/api/v1',
  // apiUrl: 'http://103.108.140.183:1021/api/v1',
//  reportApiUrl : 'http://localhost:5200/api/v1/report',
  // apiUrl:'http://103.108.140.183:1021/api/v1',
  //  apiUrl:'http://103.108.140.183:1002/api/v1',
  reportApiUrl : 'http://103.108.140.183:1031/api/v1/report'
};
