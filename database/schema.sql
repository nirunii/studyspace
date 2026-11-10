-- StudySpace database schema (PostgreSQL)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20),
  lecturer VARCHAR(100),
  color VARCHAR(7) NOT NULL DEFAULT '#3FA67B'
);

CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  description TEXT DEFAULT '',
  due_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending','In Progress','Completed'))
);

CREATE TABLE study_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  topic VARCHAR(150) DEFAULT '',
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  CHECK (end_time > start_time)
);

CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  exam_date DATE NOT NULL,
  prep_status VARCHAR(20) NOT NULL DEFAULT 'Not started'
    CHECK (prep_status IN ('Not started','Studying','Ready'))
);

CREATE INDEX idx_subjects_user ON subjects(user_id);
CREATE INDEX idx_assignments_user ON assignments(user_id);
CREATE INDEX idx_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_exams_user ON exams(user_id);
