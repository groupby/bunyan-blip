const BlipStream = require('../index');

const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect         = chai.expect;

const bunyan       = require('bunyan');
const PrettyStream = require('bunyan-prettystream');
const prettyStdOut = new PrettyStream({mode: 'dev'});
prettyStdOut.pipe(process.stdout);


describe('Bunyan blip stream tests', () => {

  it('show me something', () => {
    const blipStream = new BlipStream();
    const testLogger = bunyan.createLogger({
      name:    'testLogger',
      streams: [
        {
          type:   'raw',
          level:  'info',
          stream: prettyStdOut
        },
        {
          type:   'raw',
          stream: blipStream
        }
      ]
    });

    testLogger.info('Oh snap');
  });

  it.only('blips when above a certain threshold for a string message', (done) => {
    const testData = 'test message';
    const client = {
      write : (data) =>  {
        expect(data.log.msg).to.eql(testData);
        done();
      }
    };

    const blipStream = new BlipStream(client, 'error');

    const testLogger = bunyan.createLogger({
      name:    'testLogger',
      streams: [
        {
          type:   'raw',
          level:  'info',
          stream: prettyStdOut
        },
        {
          type:   'raw',
          stream: blipStream
        }
      ]
    });

    testLogger.error(testData);
  });

});
