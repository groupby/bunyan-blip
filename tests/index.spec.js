const BlipStream = require('../index');

const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');
const spies          = require('chai-spies');
const expect         = chai.expect;

chai.use(spies);

const bunyan       = require('bunyan');
const PrettyStream = require('bunyan-prettystream');
const prettyStdOut = new PrettyStream({mode: 'dev'});
prettyStdOut.pipe(process.stdout);


describe('Bunyan blip stream tests', () => {

  it('blips when above a certain threshold for a string message', (done) => {
    const testData = 'test message';
    const client   = {
      write: (data) => {
        const expectedData = {
          log:      testData,
          cause:    'Log threshold exceed. Threshold level: error Log level: error',
          logLevel: 50
        };
        expect(data).to.eql(expectedData);
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

  it('blips when above a certain threshold for an object', (done) => {
    const testData = {message: 'testMessage'};
    const client   = {
      write: (data) => {
        const expectedData = {
          log:      testData,
          cause:    'Log threshold exceed. Threshold level: error Log level: error',
          logLevel: 50
        };
        expect(data).to.eql(expectedData);
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

  it('does not blip when below a certain threshold', (done) => {
    const testData = {message: 'testMessage'};
    const client   = {
      write: (data) => {
        expect(data.log).to.eql(testData);
        done('should not have been called');
      }
    };

    chai.spy.on(client, 'write');

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

    testLogger.info(testData);

    expect(client.write).to.not.have.been.called;
    done();
  });

});
