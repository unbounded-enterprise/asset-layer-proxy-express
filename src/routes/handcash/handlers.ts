import { Request, NextFunction } from "express";
import { BasicError, CustomResponse } from "../../types/basic-types";
import { formatIncomingHeaders } from "../../utils/basic-format";
import { BasicObject } from "@assetlayer/sdk";
import { rolltopiaCurrencyId } from "../levels/handlers";
import { assetlayer, dbInvoices } from "../../server";
import axios from "axios";

export interface RolltopiaBundle {
  appId: string;
  bundleId: string;
  currencyId: string;
  price: number;
  quantity: number;
}

export const rolltopiaBundles: BasicObject<RolltopiaBundle> = {
  '0': {
	  appId: process.env.ASSETLAYER_APP_ID!,
    bundleId: '0',
	  currencyId: rolltopiaCurrencyId,
    price: 1.89,
    quantity: 5000,
  },
  '1': {
	  appId: process.env.ASSETLAYER_APP_ID!,
    bundleId: '1',
	  currencyId: rolltopiaCurrencyId,
    price: 8.99,
    quantity: 25000,
  },
  '2': {
	  appId: process.env.ASSETLAYER_APP_ID!,
    bundleId: '2',
	  currencyId: rolltopiaCurrencyId,
    price: 39.99,
    quantity: 100000,
  },
  '3': {
	  appId: process.env.ASSETLAYER_APP_ID!,
    bundleId: '3',
	  currencyId: rolltopiaCurrencyId,
    price: 149.99,
    quantity: 500000,
  },
};

export function createBundleMetadata(userId: string, bundle: RolltopiaBundle) {
	return {
		userId,
		appId: bundle.appId,
		bundleId: bundle.bundleId,
		currencyId: bundle.currencyId,
		price: "" + bundle.price,
		quantity: "" + bundle.quantity,
	}
}

function getPaymentProps(userId: string, bundle: RolltopiaBundle) {
  return {
    method: 'POST',
    url: 'https://cloud.handcash.io/v2/paymentRequests',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'app-secret': process.env.HANDCASH_APP_SECRET,
      'app-id': process.env.HANDCASH_APP_ID
    },
    data: {
      product: {
        name: 'Rolltopia',
        description: 'Let the good times roll.',
        imageUrl: 'https://www.rolltopia.games/static/explorerImage.png'
      },
      receivers: [
        { sendAmount: bundle.price, currencyCode: 'USD', destination: 'dubby' }
      ],
      requestedUserData: ['paymail'],
      notifications: {
        webhook: {
          customParameters: createBundleMetadata(userId, bundle),
          webhookUrl: 'https://www.rolltopia.games/api/handcash/paymentWebhook'
        },
        email: 'jordan@assetlayer.com'
      },
      expirationType: 'never',
      redirectUrl: process.env.URL + '/shop?purchaseCompleteBundleId=' + bundle.bundleId,
    }
  };
}

type CreateHandcashPaymentProps = {
  userId: string;
  appId: string;
  id: string;
  currencyId: string;
  price: number;
  quantity: number;
};
type CreateHandcashPaymentRequest = Request<{},{},CreateHandcashPaymentProps>;
export const createHandcashPayment = async (req: CreateHandcashPaymentRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { userId, appId, id: bundleId, currencyId, price, quantity } = req.body;

    if (!userId) throw new BasicError('missing userId', 409);
    else if (!bundleId) throw new BasicError('missing bundleId', 409);

    const bundle = rolltopiaBundles[bundleId];
    if (!bundle) throw new BasicError('invalid bundleId', 409);
    else if (bundle.appId !== appId) throw new BasicError('invalid appId', 409);
    else if (bundle.currencyId !== currencyId) throw new BasicError('invalid currencyId', 409);
    else if (bundle.price !== price) throw new BasicError('invalid price', 409);
    else if (bundle.quantity !== quantity) throw new BasicError('invalid quantity', 409);

    const response = await axios.request(getPaymentProps(userId, bundle));

    await dbInvoices.insertOne({ paymentRequestId: response.data.id, bundle, completed: false });

    return res.json({ statusCode: 200, success: true, body: response.data });
  }
  catch (e) {
    return next(e);
  }
}

type HandcashPaymentWebhookProps = {
  appSecret: string;
  paymentRequestId: string;
  customParameters: BasicObject<string>;
};
type HandcashPaymentWebhookRequest = Request<{},{},HandcashPaymentWebhookProps>;
export const handcashPaymentWebhook = async (req: HandcashPaymentWebhookRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { appSecret, paymentRequestId } = req.body;
    const { userId, bundleId } = req.body.customParameters;
    const bundle = rolltopiaBundles[bundleId];

    if (appSecret !== process.env.HANDCASH_APP_SECRET) throw new BasicError('invalid app secret', 409);
    else if (!paymentRequestId) throw new BasicError('missing paymentRequestId', 409);
    else if (!userId) throw new BasicError('missing userId', 409);
    else if (!bundleId) throw new BasicError('missing bundleId', 409);
    else if (!bundle) throw new BasicError('invalid bundleId', 409);
    
    await assetlayer.currencies.increaseCurrencyBalance({ 
      currencyId: bundle.currencyId,
      amount: bundle.quantity, 
      userId
    });
    
    try {
      await dbInvoices.updateOne({ paymentRequestId }, { $set: { completed: true } });
    }
    catch (e) {
      console.error('Failed to update invoice', paymentRequestId)
    }

    return res.json({ statusCode: 200, success: true });
  }
  catch (e) {
    return next(e);
  }
}

type CheckPaymentCompletedProps = {
  paymentId: string;
};
type CheckPaymentCompletedRequest = Request<{},{},CheckPaymentCompletedProps>;
export const checkPaymentCompleted = async (req: CheckPaymentCompletedRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) throw new BasicError('missing paymentId', 409);

    const invoice = await dbInvoices.findOne({ paymentRequestId: paymentId });

    return res.json({ statusCode: 200, success: true, body: { completed: !!invoice?.completed } });
  }
  catch (e) {
    return next(e);
  }
}