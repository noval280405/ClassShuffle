// plugins/firebase.client.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
    // Ganti isi konfigurasi di bawah ini dengan kredibelitas proyek Firebase Anda sendiri
    const firebaseConfig = {
        apiKey: "AIzaSyAtlns1ykxpb8itm3gMQcp8dgW-Xn3H5y0",
        authDomain: "clinic-management-erp.firebaseapp.com",
        projectId: "clinic-management-erp",
        storageBucket: "clinic-management-erp.firebasestorage.app",
        messagingSenderId: "794499631983",
        appId: "1:794499631983:web:619b6faf0a09df80aeb69a",
        measurementId: "G-N90R1ZYMD0"
    }

    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)

    return {
        provide: {
            auth,
            db
        }
    }
})