import 'babel-polyfill';
import dropbox from '../../shared/dropbox';
import bugsnag from 'bugsnag';
import secrets from '../secrets';

export default ({Records}, context, callback) => {
  try {
    Records.forEach(record => {
      if (record.eventName == 'REMOVE') dropbox.deleteFile(record.dynamodb.OldImage.accessToken.S, record.dynamodb.OldImage.fileName.S)
    });

    callback(null, `Successfully processed ${Records.length} records.`);
  } catch(e) {
    bugsnag.register(secrets.bugsnagApiKey);
    bugsnag.notify(e);
    console.error(`Error: ${JSON.stringify(e)}`);
    console.error(`Failed to process records: ${JSON.stringify(Records)}`)
  }
}