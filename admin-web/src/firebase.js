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
export const schedulesRef = ref(database, 'schedules');
export const examSchedulesRef = ref(database, 'exam_schedules');
export const subjectsRef = ref(database, 'subjects');
export const gradesRef = ref(database, 'grades');
export const courseCatalogRef = ref(database, 'course_catalog');

// ============ STUDENT FUNCTIONS ============
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

// ============ ANNOUNCEMENT FUNCTIONS ============
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

// ============ SCHEDULE FUNCTIONS ============
export const addSchedule = async (schedule) => {
    const newRef = push(schedulesRef);
    await set(newRef, { ...schedule, id: newRef.key });
    return newRef.key;
};

export const updateSchedule = async (id, data) => {
    const scheduleRef = ref(database, `schedules/${id}`);
    await update(scheduleRef, data);
};

export const deleteSchedule = async (id) => {
    const scheduleRef = ref(database, `schedules/${id}`);
    await remove(scheduleRef);
};

export const getSchedules = async () => {
    const snapshot = await get(schedulesRef);
    if (snapshot.exists()) {
        return Object.values(snapshot.val());
    }
    return [];
};

// ============ EXAM SCHEDULE FUNCTIONS ============
export const addExamSchedule = async (examSchedule) => {
    const newRef = push(examSchedulesRef);
    await set(newRef, { ...examSchedule, id: newRef.key });
    return newRef.key;
};

export const updateExamSchedule = async (id, data) => {
    const examScheduleRef = ref(database, `exam_schedules/${id}`);
    await update(examScheduleRef, data);
};

export const deleteExamSchedule = async (id) => {
    const examScheduleRef = ref(database, `exam_schedules/${id}`);
    await remove(examScheduleRef);
};

export const getExamSchedules = async () => {
    const snapshot = await get(examSchedulesRef);
    if (snapshot.exists()) {
        return Object.values(snapshot.val());
    }
    return [];
};

// ============ SUBJECT FUNCTIONS ============
export const addSubject = async (subject) => {
    const newRef = push(subjectsRef);
    await set(newRef, { ...subject, id: newRef.key });
    return newRef.key;
};

export const updateSubject = async (id, data) => {
    const subjectRef = ref(database, `subjects/${id}`);
    await update(subjectRef, data);
};

export const deleteSubject = async (id) => {
    const subjectRef = ref(database, `subjects/${id}`);
    await remove(subjectRef);
};

export const getSubjects = async () => {
    const snapshot = await get(subjectsRef);
    if (snapshot.exists()) {
        return Object.values(snapshot.val());
    }
    return [];
};

// ============ REALTIME LISTENERS ============
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

export const onSchedulesChange = (callback) => {
    return onValue(schedulesRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(Object.values(snapshot.val()));
        } else {
            callback([]);
        }
    });
};

export const onExamSchedulesChange = (callback) => {
    return onValue(examSchedulesRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(Object.values(snapshot.val()));
        } else {
            callback([]);
        }
    });
};

export const onSubjectsChange = (callback) => {
    return onValue(subjectsRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(Object.values(snapshot.val()));
        } else {
            callback([]);
        }
    });
};

// ============ GRADE FUNCTIONS ============
export const addGrade = async (grade) => {
    const newRef = push(gradesRef);
    await set(newRef, { ...grade, id: newRef.key });
    return newRef.key;
};

export const updateGrade = async (id, data) => {
    const gradeRef = ref(database, `grades/${id}`);
    await update(gradeRef, data);
};

export const deleteGrade = async (id) => {
    const gradeRef = ref(database, `grades/${id}`);
    await remove(gradeRef);
};

export const getGrades = async () => {
    const snapshot = await get(gradesRef);
    if (snapshot.exists()) {
        return Object.values(snapshot.val());
    }
    return [];
};

export const onGradesChange = (callback) => {
    return onValue(gradesRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(Object.values(snapshot.val()));
        } else {
            callback([]);
        }
    });
};

// ============ COURSE CATALOG FUNCTIONS ============
export const addCourseToCatalog = async (course) => {
    const newRef = push(courseCatalogRef);
    await set(newRef, { ...course, id: newRef.key });
    return newRef.key;
};

export const updateCourseInCatalog = async (id, data) => {
    const courseRef = ref(database, `course_catalog/${id}`);
    await update(courseRef, data);
};

export const deleteCourseFromCatalog = async (id) => {
    const courseRef = ref(database, `course_catalog/${id}`);
    await remove(courseRef);
};

export const onCourseCatalogChange = (callback) => {
    return onValue(courseCatalogRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(Object.values(snapshot.val()));
        } else {
            callback([]);
        }
    });
};

export { database };
