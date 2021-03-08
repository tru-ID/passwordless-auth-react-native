import fetch from 'node-fetch';
const getSubscriberCheck = async (check_id: string, access_token: string) => {
  const response = await fetch(
    `https://eu.api.tru.id/subscriber_check/v0.1/checks/${check_id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const resp = await response.json();
  return resp;
};
export { getSubscriberCheck };
