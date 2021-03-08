import { OAuthResponseType } from './types';
import { config } from 'dotenv';
import fetch from 'node-fetch';
import btoa from 'btoa';
config();
// create access token
const createAccessToken = async () => {
  // make request body acceptable by application/x-www-form-urlencoded
  const clientID = process.env.TRU_ID_CLIENT;
  const clientSecret = process.env.TRU_ID_SECRET;

  const basicAuth = btoa(`${clientID}:${clientSecret}`);
  const resp = await fetch(`https://eu.api.tru.id/oauth2/v1/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials&scope=subscriber_check',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
  });
  const { access_token }: OAuthResponseType = await resp.json();
  return access_token;
};
export { createAccessToken };
