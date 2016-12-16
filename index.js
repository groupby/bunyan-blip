const Stream = function (blipClient, threshold) {
  const self = this;
  const logLevels = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal'
  ];

  self.thresholdLevel = (logLevels.indexOf(threshold) + 1) * 10;

  const prepareBlipData = (data) => {
    const exclusionArray = [
      'hostname',
      'pid',
      'time',
      'v',
      'level'
    ];
    const cleanData      = {};
    Object.keys(data).forEach((key) => exclusionArray.indexOf(key) >= 0 ? null : cleanData[key] = data[key]);


    const level = data.level;
    return {
      cause:    `Log threshold exceed. Threshold level: ${self.thresholdLevel} Log level: ${level}`,
      logLevel: level,
      log:      cleanData
    };

  };

  self.write = (data) => {
    const cleanData = prepareBlipData(data);
    if (data.level >= self.thresholdLevel) {
      console.log(JSON.stringify(cleanData, null, 2));
      blipClient.write(cleanData);
    }
  };

  self.end = () => {
    console.log('Stream end was called. This is good..?');
  };

  return self;
};


module.exports = Stream;
