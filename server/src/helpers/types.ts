// req.body types
export type reqBodyType = {
  phone_number: string;
};
// OAuth Response Type
export type OAuthResponseType = {
  access_token: string;
};
// Subscriber check response
export type SubscriberCheckResponseType = {
  check_id: string;
  _links: { check_url: { href: string } };
};
