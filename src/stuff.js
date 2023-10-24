function doAuthorize() {
    ping_oidc_client.authorize("sarah");
    
  }
  var authorizeUrl;
  function doGetUrl() {
    authorizeUrl= ping_oidc_client.authorizeUrl("sarah")
    console.log("authorizeUrl:"+authorizeUrl);
    
  }   
  
  
  var ping_oidc_client = null;
  async function initializeOidc() {
    const clientOptions = {
      client_id: '297ebb0e-26dc-44be-b2cf-6624385e67a9',
      redirect_uri: 'https://demo.provetitle.com:3001/ad_suggestion.html?done=true',
      scope: 'openid email', // defaults to 'openid profile email'
      response_type: 'code', // defaults to 'code' other option is token
      usePkce: false, // defaults to true
      state: 'xyz', // will apply a random state as a string, you can pass in a string or object
      logLevel: 'debug', // defaults to 'warn'
      storageType: 'session', // 'local' | 'session' | 'worker'. defaults to 'local'. Also falls back to 'local' for backwards compatibility when choosing 'worker' and the Worker object is not present.
      // customParams: { param1: 'value1', param2: 'value2' } // will append custom parameters to the authorization url.  Expects an object with string key/values.
   };          
    /**
     * Dynamically fetches your OAuth authorization servers endpoints from the spec-defied .well-known endpoint.
     */
    ping_oidc_client = await pingOidc.OidcClient.initializeFromOpenIdConfig('https://auth.pingone.com/f5e3bd6b-8b61-4af0-82fa-e1312a15ee61/as/', clientOptions);
    
                
  };
