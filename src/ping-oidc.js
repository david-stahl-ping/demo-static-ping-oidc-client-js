!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("pingOidc",[],t):"object"==typeof exports?exports.pingOidc=t():e.pingOidc=t()}(self,(()=>(()=>{"use strict";var e={d:(t,o)=>{for(var i in o)e.o(o,i)&&!e.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:o[i]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{LogLevel:()=>o,OidcClient:()=>m,ResponseType:()=>i,StorageType:()=>r});let o=function(e){return e.Error="error",e.Warning="warning",e.Info="info",e.Debug="debug",e.None="none",e}({}),i=function(e){return e.AuthorizationCode="code",e.Token="token",e}({});const n=i;let r=function(e){return e.Local="local",e.Session="session",e.Worker="worker",e}({});class s{static trimTrailingSlash(e){return e.endsWith("/")?e.substring(0,e.length-1):e}static isValidUrl(e){try{return"https:"===new URL(e).protocol}catch{return!1}}}class a{constructor(e){this.logger=e;const t=window?.location?.hash,o=window?.location?.search;this.hashParams=t?new URLSearchParams("#"===t.charAt(0)?t.substring(1):t):new URLSearchParams,this.searchParams=o?new URLSearchParams(o):new URLSearchParams}get tokenReady(){return this.hashParams?.has("access_token")||this.searchParams?.has("code")}get currentUrl(){return s.trimTrailingSlash(window?.location?.href?.split("?")?.[0]||"")}get rawState(){return this.searchParams.get("state")}checkUrlForState(){const e=this.getAndRemoveSearchParameter("state");if(e)try{return JSON.parse(e)}catch{return this.logger.debug("BrowserUrlManager","Failed to parse state into a JSON object, must be a plain old string",e),e}return e}checkUrlForCode(){return this.logger.debug("BrowserUrlManager","checking code",{code:this.searchParams.get("code"),url:window.location}),this.getAndRemoveSearchParameter("code")}checkUrlForToken(){if(this.hashParams.has("access_token")){const e={access_token:this.hashParams.get("access_token"),expires_in:+this.hashParams.get("expires_in"),scope:this.hashParams.get("scope"),token_type:this.hashParams.get("token_type"),id_token:this.hashParams.get("id_token")};return this.logger.info("BrowserUrlManager","found an access token in the url",e),window.history.replaceState(null,null,`${window.location.pathname}?${window.location.search}`),this.hashParams=new URLSearchParams,e}return null}navigate(e){window.location.assign(e)}getAndRemoveSearchParameter(e){if(this.searchParams.has(e)){const t=this.searchParams.get(e);this.logger.info("BrowserUrlManager",`found ${e} in the url`,t),this.searchParams.delete(e);const o=this.searchParams.toString(),i=o?`?${o}`:"";return window.history.replaceState(null,null,window.location.pathname+i+window.location.hash),t}return""}}class l{constructor(e){this.logLevel=Object.values(o).includes(e)?e:o.Warning}error(e,t,i){this.logLevel!==o.None&&(i?console.error(`OidcClient.${e}`,t,i):console.error(`OidcClient.${e}`,t))}warn(e,t,i){[o.Debug,o.Info,o.Warning].includes(this.logLevel)&&(i?console.warn(`OidcClient.${e}`,t,i):console.warn(`OidcClient.${e}`,t))}info(e,t,i){[o.Debug,o.Info].includes(this.logLevel)&&(i?console.info(`OidcClient.${e}`,t,i):console.info(`OidcClient.${e}`,t))}debug(e,t,i){[o.Debug].includes(this.logLevel)&&(i?console.debug(`OidcClient.${e}`,t,i):console.debug(`OidcClient.${e}`,t))}}class c{static btoa(e){let t=window?.btoa;if(!t)try{t=e=>Buffer.from(e,"binary").toString("base64")}catch(e){throw Error("Could not find a suitable btoa method, perhaps you're on an old browser or node version?")}return t(e)}static atob(e){let t=window?.atob;if(!t)try{t=e=>Buffer.from(e,"base64").toString("binary")}catch(e){throw Error("Could not find a suitable atob method, perhaps you're on an old browser or node version?")}return t(e)}static async generateCodeChallenge(e){const t=(new TextEncoder).encode(e),o=await window.crypto.subtle.digest("SHA-256",t);return c.btoa(String.fromCharCode(...new Uint8Array(o))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}static getRandomString(e){let t="";for(let o=0;o<e;o++)t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62*Math.random()));return t}static async generatePkceArtifacts(e,t){let o;const i=c.getRandomString(128);let n;if(o=e.state?"string"==typeof e.state?e.state:JSON.stringify(e.state):c.getRandomString(20),t.debug("Utilities.OAuth","PKCE Request state generated",o),t.debug("Utilities.OAuth","PKCE CodeVerifier generated",i),e.usePkce)try{n=await c.generateCodeChallenge(i),t.debug("Utilities.OAuth","Code Challenge successfully generated",n)}catch(e){throw t.error("Utilities.OAuth","Error generating code challenge",e),Error("Unexpected exception in authorize() while generating code challenge")}return{nonce:c.getRandomString(10),codeVerifier:i,codeChallenge:n,state:o}}}const h=c;class d{constructor(e){this.TOKEN_KEY=`oidc-client:response:${e}`,this.REFRESH_TOKEN_KEY=`oidc-client:refresh_token:${e}`,this.CODE_VERIFIER_KEY=`oidc-client:code_verifier:${e}`,this.STATE_KEY=`oidc-client:state:${e}`,this.migrateTokens?.(e)}storeCodeVerifier(e){sessionStorage.setItem(this.CODE_VERIFIER_KEY,h.btoa(e))}getCodeVerifier(){const e=sessionStorage.getItem(this.CODE_VERIFIER_KEY);return sessionStorage.removeItem(this.CODE_VERIFIER_KEY),e?h.atob(e):null}setClientState(e){sessionStorage.setItem(this.STATE_KEY,e)}getClientState(){return sessionStorage.getItem(this.STATE_KEY)}removeClientState(){sessionStorage.removeItem(this.STATE_KEY)}}class g extends d{migrateTokens(e){["oidc-client:response","oidc-client:refresh_token","oidc-client:code_verifier"].forEach((t=>{const o=localStorage.getItem(t);o&&(localStorage.setItem(`${t}:${e}`,o),localStorage.removeItem(t))}))}storeToken(e){const t=e.refresh_token;t?(delete e.refresh_token,localStorage.setItem(this.REFRESH_TOKEN_KEY,h.btoa(t))):localStorage.removeItem(this.REFRESH_TOKEN_KEY),this.inMemoryToken=e;const o=JSON.stringify(e);localStorage.setItem(this.TOKEN_KEY,h.btoa(o))}async getToken(){if(this.inMemoryToken)return this.inMemoryToken;const e=localStorage.getItem(this.TOKEN_KEY);if(e){const t=h.atob(e),o=JSON.parse(t);return this.inMemoryToken=o,o}return null}async getRefreshToken(){const e=localStorage.getItem(this.REFRESH_TOKEN_KEY);return localStorage.removeItem(this.REFRESH_TOKEN_KEY),e?h.atob(e):null}removeToken(){this.inMemoryToken=null,localStorage.removeItem(this.TOKEN_KEY),localStorage.removeItem(this.REFRESH_TOKEN_KEY)}storeCodeVerifier(e){localStorage.setItem(this.CODE_VERIFIER_KEY,h.btoa(e))}getCodeVerifier(){const e=localStorage.getItem(this.CODE_VERIFIER_KEY);return localStorage.removeItem(this.CODE_VERIFIER_KEY),e?h.atob(e):null}setClientState(e){localStorage.setItem(this.STATE_KEY,e)}getClientState(){return localStorage.getItem(this.STATE_KEY)}removeClientState(){localStorage.removeItem(this.STATE_KEY)}}class u extends d{migrateTokens(e){["oidc-client:response","oidc-client:refresh_token","oidc-client:code_verifier"].forEach((t=>{const o=sessionStorage.getItem(t);o&&(sessionStorage.setItem(`${t}:${e}`,o),sessionStorage.removeItem(t))}))}storeToken(e){const t=e.refresh_token;t?(delete e.refresh_token,sessionStorage.setItem(this.REFRESH_TOKEN_KEY,h.btoa(t))):sessionStorage.removeItem(this.REFRESH_TOKEN_KEY),this.inMemoryToken=e;const o=JSON.stringify(e);sessionStorage.setItem(this.TOKEN_KEY,h.btoa(o))}async getToken(){if(this.inMemoryToken)return this.inMemoryToken;const e=sessionStorage.getItem(this.TOKEN_KEY);if(e){const t=h.atob(e),o=JSON.parse(t);return this.inMemoryToken=o,o}return null}async getRefreshToken(){const e=sessionStorage.getItem(this.REFRESH_TOKEN_KEY);return sessionStorage.removeItem(this.REFRESH_TOKEN_KEY),e?h.atob(e):null}removeToken(){this.inMemoryToken=null,sessionStorage.removeItem(this.TOKEN_KEY),sessionStorage.removeItem(this.REFRESH_TOKEN_KEY)}}class p extends d{constructor(e){super(e);const t=new Blob(['let a=null,t=null;onmessage=async e=>{switch(e.data.method){case"storeToken":"response"===Object.keys(e.data.payload)[0].toString().split(":")[1]?a=e.data.payload:"refresh_token"===Object.keys(e.data.payload)[0].toString().split(":")[1]&&(t=e.data.payload);break;case"getToken":postMessage(a);break;case"getRefreshToken":postMessage(t);break;case"removeToken":e.data?.payload?"response"===Object.keys(e.data.payload)[0].toString().split(":")[1]?a=null:"refresh_token"===Object.keys(e.data.payload)[0].toString().split(":")[1]&&(t=null):(a=null,t=null);break;default:throw new Error("Storage method not found in inboundMsg or illegal shape of inboundMsg.")}};'],{type:"text/javascript"});this.workerThread=new Worker(window.URL.createObjectURL(t))}storeToken(e){const t=e.refresh_token;t?(delete e.refresh_token,this.msg={method:"storeToken",payload:{[this.REFRESH_TOKEN_KEY]:h.btoa(t)}},this.workerThread.postMessage(this.msg)):(this.msg={method:"removeToken",payload:[this.REFRESH_TOKEN_KEY]},this.removeToken());const o=JSON.stringify(e);this.msg={method:"storeToken",payload:{[this.TOKEN_KEY]:h.btoa(o)}},this.workerThread.postMessage(this.msg)}async getToken(){return new Promise((e=>{this.msg={method:"getToken",payload:`${this.TOKEN_KEY}`},this.workerThread.postMessage(this.msg),this.workerThread.onmessage=t=>{const o=t.data?.[this.TOKEN_KEY];if(o){const t=h.atob(o),i=JSON.parse(t);e(i)}else e(null)}}))}getRefreshToken(){return new Promise((e=>{this.msg={method:"getRefreshToken",payload:`${this.REFRESH_TOKEN_KEY}`},this.workerThread.postMessage(this.msg),this.workerThread.onmessage=t=>{const o=t.data?.[this.REFRESH_TOKEN_KEY];o?(this.msg={method:"removeToken",payload:`${this.REFRESH_TOKEN_KEY}`},this.removeToken(),e(h.atob(o))):e(null)}}))}removeToken(){this.msg?.payload||(this.msg={method:"removeToken"}),this.workerThread.postMessage(this.msg)}}class f{constructor(e,t){this.logger=e,this.browserUrlManager=t}validate(e){let t=!1;e.client_id?this.logger.debug("ClientOptionsValidator","options.client_id verified",e.client_id):(this.logger.error("ClientOptionsValidator","options.client_id is required to send an authorization request"),t=!0);const{currentUrl:o}=this.browserUrlManager;if(e.redirect_uri?this.logger.debug("ClientOptionsValidator","options.redirect_uri verified",e.redirect_uri):o?this.logger.info("ClientOptionsValidator","options.redirect_uri not passed in, defaulting to current browser URL",o):(this.logger.error("ClientOptionsValidator","options.redirect_uri is required to send an authorization request"),t=!0),t)throw Error("An error occurred while validating ClientOptions, client_id and redirect_uri are required.");return{client_id:e.client_id,redirect_uri:e.redirect_uri||o,response_type:this.getResponseType(e),scope:this.getScope(e),usePkce:this.getUsePkce(e),state:e.state,storageType:e.storageType,customParams:e.customParams}}getUsePkce(e){return"boolean"==typeof e.usePkce?(this.logger.debug("ClientOptionsValidator","options.usePkce boolean was provided",e.usePkce),e.usePkce):void 0===e.usePkce||null===e.usePkce?(this.logger.info("ClientOptionsValidator","options.usePkce not provided, defaulting to true"),!0):(this.logger.warn("ClientOptionsValidator","options.usePkce contains an invalid value, expecting a boolean, defaulting to true",e.usePkce),!0)}getResponseType(e){let{response_type:t}=e;const o=Object.values(n);return o.includes(t)?this.logger.debug("ClientOptionsValidator","options.ResponseType passed and valid",e.response_type):(t=n.AuthorizationCode,e.response_type?this.logger.warn("ClientOptionsValidator",`options.ResponseType contained an invalid option, valid options are '${o.join(", ")}'`,e.response_type):this.logger.info("ClientOptionsValidator","options.ResponseType not provided, defaulting to 'code'")),t}getScope(e){const t="openid profile email";return e.scope?this.logger.debug("ClientOptionsValidator","options.Scope passed",e.scope):this.logger.info("ClientOptionsValidator",`options.Scope not provided, defaulting to '${t}'`),e.scope||t}}class m{constructor(e,t){if(this.logger=new l(e?.logLevel),!e||!t)throw Error("clientOptions and issuerConfig are required to initialize an OidcClient");this.browserUrlManager=new a(this.logger),this.issuerConfiguration=t,this.clientOptions=new f(this.logger,this.browserUrlManager).validate(e);const o=this.clientOptions.client_id;switch(e?.storageType){case"local":this.logger.info("OidcClient","option for storageType was local, using localStorage"),this.clientStorage=new g(o);break;case"session":this.logger.info("OidcClient","option for storageType was session, using sessionStorage"),this.clientStorage=new u(o);break;case"worker":if(window.Worker){this.clientStorage=new p(o);break}this.logger.warn("OidcClient","could not initialize a Web Worker, ensure your browser supports them, localStorage will be used instead"),this.clientStorage=new g(o);break;default:this.logger.info("OidcClient","option for storageType was not passed, defaulting to localStorage"),this.clientStorage=new g(o)}this.logger.debug("OidcClient","initialized with issuerConfig",t)}async hasToken(){return!!(await this.clientStorage.getToken())?.access_token}static async initializeClient(e,t){const o=new m(e,t),i=o.browserUrlManager.rawState,n=!!i&&o.clientStorage.getClientState()===i;return n&&o.clientStorage.removeToken(),(await o.hasToken()||n)&&await o.getToken(),o}static async initializeFromOpenIdConfig(e,t){if("string"!=typeof e||!s.isValidUrl(e))return Promise.reject(new Error(`Error creating an OpenIdClient please ensure you have entered a valid url ${e}`));try{const o=e.match(/\.well-known\/openid-configuration/)?e:`${s.trimTrailingSlash(e)}/.well-known/openid-configuration`,i=await fetch(o),n=await i.json();return await m.initializeClient(t,n)}catch(e){return Promise.reject(e)}}async authorize(e,t){try{const o=await this.authorizeUrl(e,t);this.browserUrlManager.navigate(o)}catch(e){return Promise.reject(e)}return Promise.resolve()}async authorizeUrl(e,t){if(this.logger.debug("OidcClient","authorized called"),!this.issuerConfiguration?.authorization_endpoint)return Promise.reject(Error("No authorization_endpoint has not been found, either initialize the client with OidcClient.initializeFromOpenIdConfig() using an issuer with a .well-known endpoint or ensure you have passed in a authorization_endpoint with the OpenIdConfiguration object"));const o=new URLSearchParams;if(o.append("response_type",this.clientOptions.response_type),o.append("client_id",this.clientOptions.client_id),o.append("redirect_uri",this.clientOptions.redirect_uri),o.append("scope",this.clientOptions.scope),this.clientOptions.response_type===i.AuthorizationCode){const e=await c.generatePkceArtifacts(this.clientOptions,this.logger);o.append("state",e.state),o.append("nonce",e.nonce),this.clientStorage.setClientState(e.state),this.clientOptions.usePkce&&(o.append("code_challenge",e.codeChallenge),o.append("code_challenge_method","S256"),this.clientStorage.storeCodeVerifier(e.codeVerifier))}return e&&o.append("login_hint",encodeURIComponent(e)),t&&o.append("prompt","none"),this.clientOptions.customParams&&Object.entries(this.clientOptions.customParams).forEach((e=>{o.append(encodeURIComponent(e[0]),encodeURIComponent(e[1]))})),Promise.resolve(`${this.issuerConfiguration?.authorization_endpoint}?${o.toString()}`)}async getToken(){this.logger.debug("OidcClient","getToken called");let e=await this.clientStorage.getToken();if(e)return e;if(!this.issuerConfiguration?.token_endpoint)return Promise.reject(Error("No token_endpoint has not been found, either initialize the client with OidcClient.initializeFromOpenIdConfig() using an issuer with a .well-known endpoint or ensure you have passed in a token_endpoint with the OpenIdConfiguration object"));if(e=this.browserUrlManager.checkUrlForToken(),!e){const t=this.browserUrlManager.checkUrlForCode();if(!t)return Promise.reject(Error("An authorization code was not found and a token was not found in storage or the url"));const o=new URLSearchParams;if(o.append("grant_type",this.clientOptions.response_type===i.Token?"":"authorization_code"),o.append("code",t),o.append("redirect_uri",this.clientOptions.redirect_uri),this.clientOptions.response_type===i.AuthorizationCode&&this.clientOptions.usePkce){const e=await this.clientStorage.getCodeVerifier();if(!e)throw Error("usePkce is true but a code verifier was not found in localStorage");o.append("code_verifier",e)}try{e=await this.authenticationServerApiCall(this.issuerConfiguration.token_endpoint,o)}catch(e){return Promise.reject(e)}}return e.state=this.browserUrlManager.checkUrlForState(),this.clientStorage.removeClientState(),this.clientStorage.storeToken(e),Promise.resolve(e)}async revokeToken(){this.logger.debug("OidcClient","revokeToken called");const e=await this.verifyToken();if(!e)return Promise.reject(Error("No token available"));if(!this.issuerConfiguration?.revocation_endpoint)return Promise.reject(Error("No revocation_endpoint has been found, either initialize the client with OidcClient.initializeFromOpenIdConfig() using an issuer with a .well-known endpoint or ensure you have passed in a userinfo_endpoint with the OpenIdConfiguration object"));const t=new URLSearchParams;t.append("token",e.access_token),t.append("token_type_hint","access_token");try{const e=await this.authenticationServerApiCall(this.issuerConfiguration.revocation_endpoint,t);return this.clientStorage.removeToken(),e}catch(e){return Promise.reject(e)}}async refreshToken(){this.logger.debug("OidcClient","refreshToken called");const e=await this.clientStorage.getRefreshToken();if(this.clientStorage.removeToken(),e){this.logger.info("OidcClient","refreshToken found in storage, using that to get a new access token.");const t=new URLSearchParams;t.append("grant_type","refresh_token"),t.append("refresh_token",e);try{const e=await this.authenticationServerApiCall(this.issuerConfiguration.token_endpoint,t);return this.clientStorage.storeToken(e),Promise.resolve(e)}catch{this.logger.error("OidcClient","Refresh token is invalid or expired, attempting a silent authentication request.")}}else this.logger.warn("OidcClient","No refresh token found, the Authentication Server may not support refresh tokens, attempting a silent authentication request.");return this.authorize(void 0,!0)}async endSession(e){if(this.logger.debug("OidcClient","endSession called"),!this.issuerConfiguration?.end_session_endpoint)return void this.logger.error("OidcClient","No end_session_endpoint has not been found, either initialize the client with OidcClient.initializeFromOpenIdConfig() using an issuer with a .well-known endpoint or ensure you have passed in a end_session_endpoint with the OpenIdConfiguration object");let t=this.issuerConfiguration.end_session_endpoint;const o=new URLSearchParams,i=await this.clientStorage.getToken();i?.id_token&&(this.logger.info("OidcClient","id_token found, appending id_token_hint the end session url"),o.append("id_token_hint",i.id_token)),e&&(this.logger.debug("OidcClient","postLogoutRedirectUri passed in, appending post_logout_redirect_uri to end session url",e),o.append("post_logout_redirect_uri",e));const n=o.toString();t+=n?`?${n}`:"",this.clientStorage.removeToken(),this.browserUrlManager.navigate(t)}async fetchUserInfo(){this.logger.debug("OidcClient","fetchUserInfo called");const e=await this.verifyToken();if(!e)return Promise.reject(Error("No token available"));if(!this.issuerConfiguration?.userinfo_endpoint)return Promise.reject(Error("No userinfo_endpoint has not been found, either initialize the client with OidcClient.initializeFromOpenIdConfig() using an issuer with a .well-known endpoint or ensure you have passed in a userinfo_endpoint with the OpenIdConfiguration object"));const t=new Headers;t.append("Authorization",`Bearer ${e.access_token}`);const o={method:"GET",headers:t};let i,n;try{i=await fetch(this.issuerConfiguration.userinfo_endpoint,o),n=await i.json()}catch(e){return Promise.reject(e)}return i?.ok?Promise.resolve(n):(this.logger.error("OidcClient",`unsuccessful response encountered from url ${this.issuerConfiguration.userinfo_endpoint}`,i),Promise.reject(n))}async verifyToken(){const e=await this.clientStorage.getToken();return e?.access_token?e:(this.logger.error("OidcClient","Token not found, make sure you have called authorize and getToken methods before attempting to get user info.",e),null)}async authenticationServerApiCall(e,t){const o=new Headers;o.append("Content-Type","application/x-www-form-urlencoded"),t.append("client_id",this.clientOptions.client_id);const i={method:"POST",headers:o,body:t,redirect:"manual"};this.logger.debug("OidcClient","POST url",e),this.logger.debug("OidcClient","POST request",i);const n=await fetch(e,i);if(!n?.ok)return this.logger.error("OidcClient",`Unsuccessful response encountered for url ${e}`,n),Promise.reject(Error("Unsuccessful fetch call"));try{return await n.json()}catch{return}}}return t})()));
//# sourceMappingURL=ping-oidc.js.map