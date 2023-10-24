  // asynchrouse method that calls the ping-oidc-client authorize call - which redirects to the 
  // OAuth url

  async function doAuthorize() {
    await ping_oidc_client.authorize("grey");
    
  }

  // asynchrouse method that calls the ping-oidc-client method that constructs the OAuth AS url 

  var authorizeUrl;
  async function doGetUrl() {
    authorizeUrl= await ping_oidc_client.authorizeUrl("grey");
    console.log("authorizeUrl:"+authorizeUrl);
    alert("url ="+authorizeUrl);
  }   
  
  
  var ping_oidc_client = null;
  // method that initializes the OAuth client with details about oauth server, oauth client
   async function initializeOidc(oauthASUrl,clientOptions) {

   
    /**
     * Dynamically fetches your OAuth authorization servers endpoints from the spec-defied .well-known endpoint.
     */
    ping_oidc_client = await pingOidc.OidcClient.initializeFromOpenIdConfig(oauthASUrl, clientOptions);
  
                
  };
