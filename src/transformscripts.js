  // asynchrouse method that calls the ping-oidc-client authorize call - which redirects to the 
  // OAuth url

  function doAuthorize() {
      ping_oidc_client.authorize("grey");
    
  }

  // asynchrouse method that calls the ping-oidc-client method that constructs the OAuth AS url 

  var authorizeUrl;
  function doGetUrl() {
    authorizeUrl= ping_oidc_client.authorizeUrl("grey");
    console.log("authorizeUrl:"+authorizeUrl);
    alert("url ="+authorizeUrl);
  }   
  
  
  var ping_oidc_client = null;
  // method that initializes the OAuth client with details about oauth server, oauth client
   function initializeOidc(oauthASUrl,clientOptions) {

   
    /**
     * Dynamically fetches your OAuth authorization servers endpoints from the spec-defied .well-known endpoint.
     */
    ping_oidc_client =  pingOidc.OidcClient.initializeFromOpenIdConfig(oauthASUrl, clientOptions);
  
                
  };

  function doAllSteps() {
    const localClientOptions = {
      client_id: '482b146c-8620-4076-b355-92c70d9002ff',  // id of an oidc application in PingOne SSO
      redirect_uri: 'https://localhost:3001/done.html', // URL to return (must match return uri in above oidc application)
      scope: 'openid email', // defaults to 'openid profile email'
      response_type: 'code', // defaults to 'code' other option is token
      usePkce: false, // defaults to true
      state: 'xyz', // will apply a random state as a string, you can pass in a string or object
      logLevel: 'debug', // defaults to 'warn'
      storageType: 'session', // 'local' | 'session' | 'worker'. defaults to 'local'. Also falls back to 'local' for backwards compatibility when choosing 'worker' and the Worker object is not present.
      // customParams: { param1: 'value1', param2: 'value2' } // will append custom parameters to the authorization url.  Expects an object with string key/values.
    }; // client options object with configuration needed to initialize ping-oidc-client   

    // url that points to a PingOne environment 
     const localoauthASUrl = 'https://auth.pingone.com/f5e3bd6b-8b61-4af0-82fa-e1312a15ee61/as/';

     ping_oidc_client = pingOidc.OidcClient.initializeFromOpenIdConfig(oauthASUrl, clientOptions);
     authorizeUrl= ping_oidc_client.authorizeUrl("grey");
     console.log("authorizeUrl:"+authorizeUrl);
    ping_oidc_client.authorize("grey");

  }