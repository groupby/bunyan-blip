# bunyan-blip

[![Greenkeeper badge](https://badges.greenkeeper.io/groupby/bunyan-blip.svg)](https://greenkeeper.io/)
[![CircleCI](https://circleci.com/gh/groupby/bunyan-blip.svg?style=svg)](https://circleci.com/gh/groupby/bunyan-blip) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/4b20c1c6dec94326a5714eccfabaa41d)](https://www.codacy.com/app/GroupByInc/bunyan-blip?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=groupby/bunyan-blip&amp;utm_campaign=Badge_Grade) 

Blip stuff from bunyan

## Installation
```bash
npm i -S bunyan-blip
```

## Use
```javascript
const bunyan     = require('bunyan');
const BunyanBlip = require('bunyan-blip');
const BlipClient = require('blip-client');

const blipClient = BlipClient.createClient('mybliphost.com', 8080, 'some service', 'prod');

const logger = bunyan.createLogger({
    name:    'my app',
    streams: {
       type: 'raw',
       stream: new BunyanBlip(blipClient, 'error')
     }
  });


logger.info('Not sent to blip server');
logger.error('Sent to blip server because its above the threshold');

```