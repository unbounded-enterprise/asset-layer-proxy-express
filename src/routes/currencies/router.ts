import { Router } from 'express';
import { decreaseCurrencyBalance, getCurrency, getCurrencyBalance, getCurrencySummary, increaseCurrencyBalance, transferCurrency } from './handlers';

const currenciesRouter: Router = Router();

currenciesRouter.get('/info', getCurrency);
currenciesRouter.get('/balance', getCurrencyBalance);
currenciesRouter.get('/summary', getCurrencySummary);

currenciesRouter.post('/increaseBalance', increaseCurrencyBalance);
currenciesRouter.post('/decreaseBalance', decreaseCurrencyBalance);
currenciesRouter.post('/transfer', transferCurrency);

export default currenciesRouter;