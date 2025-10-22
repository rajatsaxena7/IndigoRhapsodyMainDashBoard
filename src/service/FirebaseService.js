// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZe8Wl9jPF-IpJQCws9d5DRFM-69ZqDgg",
  authDomain: "sveccha-11c31.firebaseapp.com",
  projectId: "sveccha-11c31",
  storageBucket: "sveccha-11c31.appspot.com",
  messagingSenderId: "904787268928",
  appId: "1:904787268928:web:a801ffdbbc6426f72456a5",
};

// Initialize Firebase first
const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);

export const uploadImageToFirebase = async (file, folder) => {
  try {
    console.log("🔥 Firebase: Starting image upload...", { fileName: file.name, folder });

    // Create a reference to the file location
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    console.log("🔥 Firebase: Upload reference created:", `${folder}/${fileName}`);

    // Upload the file to Firebase Storage
    console.log("🔥 Firebase: Uploading file...");
    const uploadResult = await uploadBytes(storageRef, file);
    console.log("🔥 Firebase: Upload completed:", uploadResult);

    // Get the download URL for the uploaded file
    console.log("🔥 Firebase: Getting download URL...");
    const url = await getDownloadURL(storageRef);
    console.log("🔥 Firebase: Download URL obtained:", url);

    return url;
  } catch (error) {
    console.error("❌ Firebase: Upload failed:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// firebaseService.js
