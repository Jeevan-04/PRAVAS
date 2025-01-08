import admin from "firebase-admin";

const serviceAccount = {
   "PASTE YOURS HERE"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();

export default admin;
