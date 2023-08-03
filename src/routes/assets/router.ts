import { Router } from 'express';
import { getAsset, getAssets, getUserAssets, getUserCollectionAssets, getUserCollectionsAssets, getUserSlotAssets, getUserSlotsAssets, mintAssets, sendAsset, sendLowestAsset, sendRandomAsset, updateAsset } from './handlers';
import { updateAssetExpressionValue, updateBulkExpressionValues } from '../expressions/handlers';

const assetsRouter: Router = Router();

assetsRouter.get('/info', getAsset);
assetsRouter.get('/infos', getAssets);
assetsRouter.get('/user', getUserAssets);
assetsRouter.get('/collection', getUserCollectionAssets);
assetsRouter.get('/collections', getUserCollectionsAssets);
assetsRouter.get('/slot', getUserSlotAssets);
assetsRouter.get('/slots', getUserSlotsAssets);

assetsRouter.post('/mint', mintAssets);
assetsRouter.post('/send', sendAsset);
assetsRouter.post('/sendLowest', sendLowestAsset);
assetsRouter.post('/sendRandom', sendRandomAsset);

assetsRouter.put('/update', updateAsset);

assetsRouter.post('/asset/expressionValues', updateAssetExpressionValue);
// assetsRouter.post('/asset/expressionValues/assets', updateAssetsExpressionValue);
// assetsRouter.post('/asset/expressionValues/collection', updateCollectionAssetsExpressionValue);
assetsRouter.post('/asset/expressionValuesBulk', updateBulkExpressionValues);

export default assetsRouter;