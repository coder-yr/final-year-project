/**
 * Firebase Admin SDK Configuration
 * This file should ONLY be imported in server-side code (API routes, server components)
 * NEVER import this in client components
 */

import fs from 'node:fs';
import path from 'node:path';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminDb: Firestore;
let adminAuth: Auth;

const SERVICE_ACCOUNT_FILE = 'hotel-reservation-system-73733-firebase-adminsdk-fbsvc-39f29753f4.json';

function loadServiceAccountFromFile() {
    const filePath = path.join(process.cwd(), SERVICE_ACCOUNT_FILE);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const rawContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawContent);
}

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials for server-side operations
 */
function initializeFirebaseAdmin() {
    if (getApps().length === 0) {
        // Prefer the downloaded service account JSON file when present.
        const serviceAccountFile = loadServiceAccountFromFile();

        if (serviceAccountFile) {
            try {
                adminApp = initializeApp({
                    credential: cert(serviceAccountFile),
                    projectId: serviceAccountFile.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                });
                console.log(`✅ Firebase Admin initialized from ${SERVICE_ACCOUNT_FILE}`);
            } catch (error) {
                console.error(`❌ Failed to initialize from ${SERVICE_ACCOUNT_FILE}.`);
                console.error('Error:', error instanceof Error ? error.message : String(error));
                throw error;
            }
        } else if (process.env.FIREBASE_PRIVATE_KEY) {
            try {
                // Fallback: individual environment variables.
                adminApp = initializeApp({
                    credential: cert({
                        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    }),
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                });
                console.log('✅ Firebase Admin initialized with individual environment variables');
            } catch (error) {
                console.error('❌ Failed to initialize with individual env vars.');
                console.error('Error:', error instanceof Error ? error.message : String(error));
                throw error;
            }
        } else {
            throw new Error(`No Firebase Admin credentials found. Place ${SERVICE_ACCOUNT_FILE} in the project root or set FIREBASE_PRIVATE_KEY/FIREBASE_CLIENT_EMAIL.`);
        }
    } else {
        adminApp = getApps()[0];
    }

    adminDb = getFirestore(adminApp);
    adminAuth = getAuth(adminApp);
}

// Initialize on module load
initializeFirebaseAdmin();

export { adminDb, adminAuth, adminApp };
