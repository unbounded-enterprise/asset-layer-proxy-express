import { Router } from 'express';
import { getCurrency, getCurrencyBalance, getCurrencySummary } from './handlers';

const currenciesRouter: Router = Router();

currenciesRouter.get('/info', getCurrency);
currenciesRouter.get('/balance', getCurrencyBalance);
currenciesRouter.get('/summary', getCurrencySummary);

// currenciesRouter.post('/increaseBalance', increaseCurrencyBalance);
// currenciesRouter.post('/decreaseBalance', decreaseCurrencyBalance);
// currenciesRouter.post('/transfer', transferCurrency);

export default currenciesRouter;