import 'dotenv/config';
import { sendemail } from '../src/utils/SendEmail.js';

try {
  await sendemail({
    email: 'biru93418@gmail.com',
    subject: 'Test Brevo verify',
    message: '<p>Test message</p>'
  });
  console.log('EMAIL_OK');
} catch (e) {
  console.log('EMAIL_ERR', e?.message || e);
}
