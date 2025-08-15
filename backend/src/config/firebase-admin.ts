// src/config/firebase-admin.ts
import admin from 'firebase-admin';
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

export default admin;
