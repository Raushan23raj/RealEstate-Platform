import test from 'node:test';
import assert from 'node:assert/strict';
import { getBrevoSenderEmail } from '../src/utils/SendEmail.js';

test('prefers explicit Brevo sender email over fallback EMAIL_USER', () => {
  process.env.BREVO_SENDER_EMAIL = 'verified@realstate.com';
  process.env.EMAIL_USER = 'btech10194.23@bitmesra.ac.in';

  assert.equal(getBrevoSenderEmail(), 'verified@realstate.com');
});

test('falls back to EMAIL_USER when Brevo sender is absent', () => {
  delete process.env.BREVO_SENDER_EMAIL;
  process.env.EMAIL_USER = 'btech10194.23@bitmesra.ac.in';

  assert.equal(getBrevoSenderEmail(), 'btech10194.23@bitmesra.ac.in');
});

test('accepts lowercase Brevo environment variable names', () => {
  delete process.env.BREVO_SENDER_EMAIL;
  delete process.env.EMAIL_USER;
  process.env.brevo_sender_email = 'lowercase@realstate.com';

  assert.equal(getBrevoSenderEmail(), 'lowercase@realstate.com');
});
