import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = 'AppSinhVien.db';

let db = null;

// Kết nối database
export const getDBConnection = async () => {
  if (db) return db;
  
  db = await SQLite.openDatabase({
    name: DATABASE_NAME,
    location: 'default',
  });
  
  return db;
};

// Khởi tạo các bảng
export const initDatabase = async () => {
  const database = await getDBConnection();
  
  // Tạo bảng users
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mssv TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      ho_ten TEXT NOT NULL,
      lop TEXT,
      khoa TEXT,
      email TEXT,
      avatar TEXT
    );
  `);
  
  // Tạo bảng announcements
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      sender TEXT,
      created_at TEXT,
      type TEXT DEFAULT 'chung'
    );
  `);
  
  // Tạo bảng schedule
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      mon_hoc TEXT NOT NULL,
      giang_vien TEXT,
      phong TEXT,
      thu INTEGER,
      tiet_bat_dau INTEGER,
      tiet_ket_thuc INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  
  // Tạo bảng grades
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      mon_hoc TEXT NOT NULL,
      so_tin_chi INTEGER,
      diem_giua_ky REAL,
      diem_cuoi_ky REAL,
      diem_tong_ket REAL,
      diem_chu TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  
  console.log('Database initialized successfully!');
  return database;
};

// Kiểm tra xem đã có dữ liệu chưa
export const checkDataExists = async () => {
  const database = await getDBConnection();
  const results = await database.executeSql('SELECT COUNT(*) as count FROM users');
  return results[0].rows.item(0).count > 0;
};

// Lấy user theo MSSV và password
export const getUserByCredentials = async (mssv, password) => {
  const database = await getDBConnection();
  const results = await database.executeSql(
    'SELECT * FROM users WHERE mssv = ? AND password = ?',
    [mssv, password]
  );
  
  if (results[0].rows.length > 0) {
    return results[0].rows.item(0);
  }
  return null;
};

// Lấy user theo ID
export const getUserById = async (userId) => {
  const database = await getDBConnection();
  const results = await database.executeSql(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );
  
  if (results[0].rows.length > 0) {
    return results[0].rows.item(0);
  }
  return null;
};

// Lấy danh sách thông báo
export const getAnnouncements = async (type = null) => {
  const database = await getDBConnection();
  let query = 'SELECT * FROM announcements ORDER BY created_at DESC';
  let params = [];
  
  if (type) {
    query = 'SELECT * FROM announcements WHERE type = ? ORDER BY created_at DESC';
    params = [type];
  }
  
  const results = await database.executeSql(query, params);
  const announcements = [];
  
  for (let i = 0; i < results[0].rows.length; i++) {
    announcements.push(results[0].rows.item(i));
  }
  
  return announcements;
};

// Lấy thời khóa biểu của user
export const getSchedule = async (userId) => {
  const database = await getDBConnection();
  const results = await database.executeSql(
    'SELECT * FROM schedule WHERE user_id = ? ORDER BY thu, tiet_bat_dau',
    [userId]
  );
  
  const schedule = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    schedule.push(results[0].rows.item(i));
  }
  
  return schedule;
};

// Lấy điểm của user
export const getGrades = async (userId) => {
  const database = await getDBConnection();
  const results = await database.executeSql(
    'SELECT * FROM grades WHERE user_id = ?',
    [userId]
  );
  
  const grades = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    grades.push(results[0].rows.item(i));
  }
  
  return grades;
};

export default {
  getDBConnection,
  initDatabase,
  checkDataExists,
  getUserByCredentials,
  getUserById,
  getAnnouncements,
  getSchedule,
  getGrades,
};
