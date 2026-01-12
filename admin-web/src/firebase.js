import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, get, remove, update, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDdiL3LZT55NreliNpt_tufYHTq_DhUclI",
    authDomain: "appsinhvien-5d398.firebaseapp.com",
    databaseURL: "https://appsinhvien-5d398-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "appsinhvien-5d398",
    storageBucket: "appsinhvien-5d398.firebasestorage.app",
    messagingSenderId: "968569756250",
    appId: "1:968569756250:web:2e08af82e8b9e7cd975663"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database references
export const studentsRef = ref(database, 'students');
export const announcementsRef = ref(database, 'announcements');

// Helper functions
export const addStudent = async (student) => {
    const newRef = push(studentsRef);
    await set(newRef, { ...student, id: newRef.key });
    return newRef.key;
};

export const updateStudent = async (id, data) => {
    const studentRef = ref(database, `students/${id}`);
    await update(studentRef, data);
};

export const deleteStudent = async (id) => {
    const studentRef = ref(database, `students/${id}`);
    await remove(studentRef);
};

export const getStudents = async () => {
    const snapshot = await get(studentsRef);
    if (snapshot.exists()) {
        return Object.values(snapshot.val());
    }
    return [];
};

export const addAnnouncement = async (announcement) => {
    const newRef = push(announcementsRef);
    await set(newRef, { ...announcement, id: newRef.key });
    return newRef.key;
};

export const updateAnnouncement = async (id, data) => {
    const announcementRef = ref(database, `announcements/${id}`);
    await update(announcementRef, data);
};

export const deleteAnnouncement = async (id) => {
    const announcementRef = ref(database, `announcements/${id}`);
    await remove(announcementRef);
};

export const getAnnouncements = async () => {
    const snapshot = await get(announcementsRef);
    if (snapshot.exists()) {
        return Object.values(snapshot.val());
    }
    return [];
};

// Realtime listeners
export const onStudentsChange = (callback) => {
    return onValue(studentsRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(Object.values(snapshot.val()));
        } else {
            callback([]);
        }
    });
};

export const onAnnouncementsChange = (callback) => {
    return onValue(announcementsRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(Object.values(snapshot.val()));
        } else {
            callback([]);
        }
    });
};

export { database };
