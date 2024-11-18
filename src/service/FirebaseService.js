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

export const uploadImageToFirebase = async (file, folder) => {
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  try {
    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, file);

    // Get the download URL for the uploaded file
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);

// firebaseService.js
