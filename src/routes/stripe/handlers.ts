import { Request, NextFunction } from "express";
import { BasicError, CustomResponse } from "../../types/basic-types";
import Stripe from "stripe";
import { rolltopiaCurrencyId } from "../levels/handlers";
import { assetlayer } from "../../server";
import { createBundleMetadata, rolltopiaBundles } from "../handcash/handlers";

const webhookSecret = process.env.PAYMENT_INTENT_WEBHOOK_SECRET!;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

type CreatePaymentIntentProps = {
  userId: string;
  appId: string;
  id: string;
  currencyId: string;
  price: number;
  quantity: number;
};
type CreatePaymentIntentRequest = Request<{}, {}, CreatePaymentIntentProps>;
export const createPaymentIntent = async (req: CreatePaymentIntentRequest, res: CustomResponse, next: NextFunction) => {
  try {
    const { userId, appId, id: bundleId, currencyId, price, quantity } = req.body;
    
    if (!userId) throw new BasicError('missing userId', 409);
    if (!bundleId) throw new BasicError('missing bundleId', 409);

    const bundle = rolltopiaBundles[bundleId];
    if (!bundle) throw new BasicError('invalid bundleId', 409);
    else if (bundle.appId !== appId) throw new BasicError('invalid appId', 409);
    else if (bundle.currencyId !== currencyId) throw new BasicError('invalid currencyId', 409);
    else if (bundle.price !== price) throw new BasicError('invalid price', 409);
    else if (bundle.quantity !== quantity) throw new BasicError('invalid quantity', 409);
    
    const paymentIntentParams = {
      amount: bundle.price * 100,
      currency: 'usd',
      automatic_payment_methods: { enabled: true }, // default true
      // payment_method_types: ['card'], // defaults to payment methods in set in stripe dashboard
      statement_descriptor: `RTK ${bundle.quantity}`, // max length + prefix (stripe dashboard) = 22
      metadata: createBundleMetadata(userId, bundle),
    };

    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
    // await dbInvoices.insertOne({ paymentIntentId: paymentIntent.id, bundle: props.bundle, completed: false });

    return res.json({ statusCode: 200, success: true, body: paymentIntent });
  }
  catch (e) {
    return next(e);
  }
}

type PaymentIntentWebhookRequest = Request<{}, {}, Buffer>;
export const paymentIntentWebhook = async (req: PaymentIntentWebhookRequest, res: CustomResponse, next: NextFunction) => {
  try {
    if (!(req.method === 'POST')) throw new BasicError('invalid method', 405);
    const sig = req.headers['stripe-signature'];

    if (!sig) throw new BasicError('missing sig', 409);
    if (!req.body) throw new BasicError('missing body', 409);

    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
    if (!paymentIntent.metadata.appId || paymentIntent.metadata.appId !== process.env.ASSETLAYER_APP_ID) 
      throw new BasicError('invalid app id', 409);
  
    switch (event['type']) {
      case 'payment_intent.succeeded': {
        console.log('Stripe Payment Succeeded:', paymentIntent.id);
        await assetlayer.currencies.increaseCurrencyBalance({ 
          currencyId: rolltopiaCurrencyId, 
          amount: Number(paymentIntent.metadata.quantity), 
          userId: paymentIntent.metadata.userId 
        });
        
        /*
        try {
          await dbInvoices.updateOne({ paymentIntentId: paymentIntent.id }, { $set: { completed: true } });
        }
        catch (e) {
          console.error('Failed to update invoice', paymentIntent.id)
        }
        */

        return res.json({ statusCode: 200, success: true });
      }
      case 'payment_intent.payment_failed': {
        const message = `Stripe Payment Failed [${paymentIntent.id}]: ${paymentIntent.last_payment_error?.message || ''}`;
        throw new BasicError(message, 409);
      }
    }

    throw new BasicError('payment intent invalid event type', 409);
  }
  catch (e) {
    return next(e);
  }
}