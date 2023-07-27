import { Router } from 'express';
import { createExpression, getExpressionTypes, getSlotExpressions, updateAssetExpressionValues, updateAssetsExpressionValues, updateBulkExpressionValues, updateCollectionExpressionValues, updateExpression } from './handlers';

const expressionsRouter: Router = Router();

expressionsRouter.get('/types', getExpressionTypes);
expressionsRouter.get('/slot', getSlotExpressions);

expressionsRouter.post('/new', createExpression);

expressionsRouter.put('/update', updateExpression);

expressionsRouter.post('/values/nft', updateAssetExpressionValues);
expressionsRouter.post('/values/nfts', updateAssetsExpressionValues);
expressionsRouter.post('/values/collection', updateCollectionExpressionValues);
expressionsRouter.post('/values/bulk', updateBulkExpressionValues);

export default expressionsRouter;