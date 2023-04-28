import express = require("express");
import { ClientCredentialRequest, ConfidentialClientApplication, OnBehalfOfRequest } from "@azure/msal-node";
import Axios from "axios";
import { getItem, setItem } from "node-persist";


export const dbRouter = (options: any): express.Router => {
  const router = express.Router();

  // TODO: [1] add API endpoint GET /meetingDetails/:meetingId

  router.get(
    '/db/:estimate',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
        

            const estimateId = req.params.estimateID;
            const topics = await getItem(estimateId) || [];

            res.type('application/json');
            res.end(JSON.stringify(topics));
        } catch (err) {
            res.status(500).send(err);
        }
    });
router.post(
    '/db/:estimate',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {


            const estimateId = req.params.estimateid;
            const estimate = req.body;

            await setItem(estimateId, estimate);

            res.type('application/json');
            res.end(JSON.stringify(estimate));
        } catch (err) {
            res.status(500).send(err);
        }
});


  return router;
};