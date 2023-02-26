export const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY || "def_str",
    authDomain: process.env.REACT_APP_AUTH_DOMAIN || "def_str",
    projectId: process.env.REACT_APP_PROJECT_ID || "def_str",
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET || "def_str",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || "def_str",
    appId: process.env.REACT_APP_APP_ID || "def_str",
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || "def_str"
}
