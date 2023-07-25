const { AssetLayer } = require('dubby-sdk-test');

const assetlayer = new AssetLayer({
  appSecret: process.env.ASSETLAYER_APP_SECRET,
});

exports.allHandler = async (req, res, next) => {
  try {
    const app = await assetlayer.apps.getApp('633b30ca09d1acacd0c50df4');

    console.log('app', app);

    return res.json(app);
  }
  catch (e) {
    return next(e);
  }
}