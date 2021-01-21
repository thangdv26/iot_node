const Device = require('../model/device');
const { DEVICE_STATUS } = require('../utils/constant');
const mqttClient = require('./index');

const triggerDevice = async (_device, action) => {
  try {
    const device = { ..._device };
    const topic = `/${device.mac}/${device.deviceId}`;
    mqttClient.onPublish(topic, action);
    if (device.status === DEVICE_STATUS.RUNNING && action === 'off') device.status = DEVICE_STATUS.ACTIVE;
    if (device.status === DEVICE_STATUS.ACTIVE && action === 'on') device.status = DEVICE_STATUS.RUNNING;
    await Device.updateOne({ _id: device.id }, { status: device.status });
    // eslint-disable-next-line no-param-reassign
    _device.status = device.status;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { triggerDevice };
