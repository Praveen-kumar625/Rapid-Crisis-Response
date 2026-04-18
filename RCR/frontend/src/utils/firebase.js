import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY", 
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        if (isMobile) {
            await signInWithRedirect(auth, googleProvider);
        } else {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();
            localStorage.setItem('google_token', token);
            return result.user;
        }
    } catch (error) {
        console.error("Auth Error:", error);
        throw error;
    }
};

export const handleRedirectResult = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            const token = await result.user.getIdToken();
            localStorage.setItem('google_token', token);
            return result.user;
        }
    } catch (error) {
        console.error("Redirect Error:", error);
    }
};