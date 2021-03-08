import { SubscriberCheckResponseType } from './types';
import fetch from 'node-fetch';
// create subscriber check and get back check_url
const createSubscriberCheck = async (
  phone_number: string,
  access_token: string
) => {
  const body = JSON.stringify(phone_number);
  const response = await fetch(
    'https://eu.api.tru.id/subscriber_check/v0.1/checks',
    {
      method: 'POST',
      body,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const {
    _links,
    check_id,
  }: SubscriberCheckResponseType = await response.json();
  return {check_id, check_url:_links.check_url.href};
};
export { createSubscriberCheck };
