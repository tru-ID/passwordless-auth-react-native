import express from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import { __PROD__ } from './helpers/constants';
import { reqBodyType } from './helpers/types';
import { createAccessToken } from './helpers/createAccessToken';
import { createSubscriberCheck } from './helpers/createSubscriberCheck';
import { getSubscriberCheck } from './helpers/getSubscriberCheck';
(() => {
  config();
  const app = express();
  app.use(express.json());
  app.use(morgan(!__PROD__ ? 'dev' : 'common'));
  app.get('/', (_, res) =>
    res.send(`<h1>So it doesn't say: "Cannot get /" </h1>`)
  );
  app.post('/api/subscribercheck', async (req, res) => {
    const { phone_number }: reqBodyType = req.body;
    try {
      const access_token = await createAccessToken();
      const { check_id, check_url } = await createSubscriberCheck(
        phone_number,
        access_token
      );
      res.status(200).send({
        message: 'success',
        data: { check_id, check_url, access_token },
      });
    } catch (e) {
      throw new Error(e.message);
    }
  });
  app.get('/api/subscribercheck/:checkId', async (req, res) => {
    const { checkId: check_id } = req.params;
    const { access_token } = req.query;
    try {
      const resp = await getSubscriberCheck(check_id, access_token as string);
      res
        .status(200)
        .send({ message: 'SubscriberCheck Successful', data: resp });
    } catch (e) {
      throw new Error(e.message);
    }
  });
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
})();
