'use strict';

module.exports = getUsage;

function getUsage(oldUsage) {
  var usage,
      usageTime;

  if (oldUsage && oldUsage._start) {
    usage = Object.assign({}, process.cpuUsage(oldUsage._start.cpuUsage));
    usage.time = Date.now() - oldUsage._start.time;
  } else {
    usage = Object.assign({}, process.cpuUsage());
    usage.time = process.uptime() * 1000; // s to ms
  }

  usageTime = usage.time * 10;

  usage.total = (usage.system + usage.user) / usageTime;
  usage.userPercentage = usage.user / usageTime;
  usage.systemPercentage = usage.system / usageTime;

  Object.defineProperty(usage, '_start', {
    value: {
      cpuUsage: process.cpuUsage(),
      time: Date.now()
    }
  });
  return usage;
}
