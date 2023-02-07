// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '94uv4f71bh'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-c46eiac8app8n2k3.us.auth0.com',            // Auth0 domain
  clientId: 'Bg8nMi69mwaQGiwWMn4f0j55XB6jfCYV',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
