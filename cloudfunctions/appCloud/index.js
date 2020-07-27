const cloud = require('wx-server-sdk')

const userController = require('./controller/user.js')
const configController = require('./controller/config.js')
const orderController = require('./controller/order.js')
const excCodeController = require('./controller/excCode.js')
const shareController = require('./controller/share.js')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { model } = event;

  if (model === 'user') return await userController(event, context);
  else if (model === 'config') return await configController(event, context);
  else if (model === 'order') return await orderController(event, context);
  else if (model === 'excCode') return await excCodeController(event, context);
  else if (model === 'share') return await shareController(event, context);

  return {}

}