async function doAuthorize() {
    await ping_oidc_client.authorize("sarah");
    
  }
  var authorizeUrl;
  async function doGetUrl() {
    authorizeUrl= await ping_oidc_client.authorizeUrl("sarah")
    console.log("authorizeUrl:"+authorizeUrl);
    alert("url ="+authorizeUrl);
  }   
  
  
  var ping_oidc_client = null;
   async function initializeOidc(clientOptions) {

   
    /**
     * Dynamically fetches your OAuth authorization servers endpoints from the spec-defied .well-known endpoint.
     */
    ping_oidc_client = await pingOidc.OidcClient.initializeFromOpenIdConfig('https://auth.pingone.com/f5e3bd6b-8b61-4af0-82fa-e1312a15ee61/as/', clientOptions);
  
                
  };
