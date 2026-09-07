require('dotenv').config({ path: '.env.local' });
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();

async function importData() {
  try {
    const backupPath = path.join(__dirname, '..', '..', '..', 'makam-backup.json');
    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    console.log(`Starting import of ${data.length} records...`);

    let count = 0;
    const batch = db.batch();
    
    for (const doc of data) {
      const docId = `${doc.blok}-${doc.no}`;
      const docRef = db.collection('makam').doc(docId);
      
      batch.set(docRef, {
        no: doc.no,
        blok: doc.blok,
        pemilik: doc.pemilik || '-',
        status: doc.status || 'Tersedia',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      count++;
    }

    await batch.commit();
    console.log(`Successfully imported ${count} records to Firebase Firestore!`);
  } catch (error) {
    console.error("Error importing data:", error);
  }
}

importData();
