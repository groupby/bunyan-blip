const Stream = function (blipClient, threshold) {
  const self      = this;
  const logLevels = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal'
  ];

  const logLevelIntToString = (levelInt) => logLevels[levelInt / 10 - 1];
  self.thresholdLevel       = (logLevels.indexOf(threshold) + 1) * 10;

  const prepareBlipData = (data) => {
    const exclusionArray = [
      'hostname',
      'pid',
      'time',
      'v',
      'level',
      'name'
    ];
    let cleanData        = {};
    Object.keys(data).forEach((key) => exclusionArray.indexOf(key) >= 0 ? null : cleanData[key] = data[key]);

    if (cleanData.msg !== '') {
      cleanData = cleanData.msg;
    }

    delete cleanData.msg;
    console.log(`cleanData = ${JSON.stringify(cleanData)}`);

    const level = data.level;
    return {
      cause:    `Log threshold exceed. Threshold level: ${logLevelIntToString(self.thresholdLevel)} Log level: ${logLevelIntToString(level)}`,
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

  self.end = () => {};

  return self;
};


module.exports = Stream;
