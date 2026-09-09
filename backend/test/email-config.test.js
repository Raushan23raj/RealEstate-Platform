import test from 'node:test';
import assert from 'node:assert/strict';
import { getBrevoSenderEmail } from '../src/utils/SendEmail.js';

test('prefers explicit Brevo sender email over fallback EMAIL_USER', () => {
  process.env.BREVO_SENDER_EMAIL = 'verified@realstate.com';
  process.env.EMAIL_USER = 'raushanlakh@gmail.com';

  assert.equal(getBrevoSenderEmail(), 'verified@realstate.com');
});

test('falls back to EMAIL_USER when Brevo sender is absent', () => {
  delete process.env.BREVO_SENDER_EMAIL;
  process.env.EMAIL_USER = 'raushanlakh@gmail.com';

  assert.equal(getBrevoSenderEmail(), 'raushanlakh@gmail.com');
});
