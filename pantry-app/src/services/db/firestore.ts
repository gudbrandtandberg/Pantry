import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { app } from '../../config/firebase';

export const db = getFirestore(app);

if (process.env.NODE_ENV === 'development') {
    connectFirestoreEmulator(db, 'localhost', 8080);
} 