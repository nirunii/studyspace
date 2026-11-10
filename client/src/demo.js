import { TODAY, addDays, wkDays, COL } from './util';

// Sample data shown to visitors who are not logged in. Dates are relative to today
// so the preview always looks current. Nothing here is saved anywhere.
export function demoData() {
  const subjects = [
    { id: 1, name: 'Data Structures', code: 'CS201', lecturer: 'Dr. Chen', color: COL[0] },
    { id: 2, name: 'Database Systems', code: 'CS230', lecturer: 'Prof. Okafor', color: COL[1] },
    { id: 3, name: 'Human-Computer Interaction', code: 'CS315', lecturer: 'Dr. Silva', color: COL[3] },
    { id: 4, name: 'Academic Writing', code: 'ENG101', lecturer: 'Ms. Taylor', color: COL[2] },
  ];
  const assignments = [
    { id: 1, subject_id: 1, title: 'Binary tree traversal lab', description: 'Implement in-order, pre-order and post-order traversal with tests.', due_date: addDays(2), status: 'In Progress' },
    { id: 2, subject_id: 2, title: 'ER diagram for library system', description: 'Normalise to 3NF and submit the diagram as a PDF.', due_date: addDays(5), status: 'Pending' },
    { id: 3, subject_id: 3, title: 'Usability evaluation report', description: 'Heuristic evaluation of a mobile banking app.', due_date: addDays(9), status: 'Pending' },
    { id: 4, subject_id: 4, title: 'Essay outline', description: '', due_date: addDays(-2), status: 'Completed' },
  ];
  const sessions = [];
  let id = 1;
  const add = (subject_id, topic, session_date, start_time, end_time) =>
    sessions.push({ id: id++, subject_id, topic, session_date, start_time, end_time, completed: session_date < TODAY });
  const wk = wkDays(TODAY);
  add(1, 'Linked lists revision', wk[0], '16:00', '17:30');
  add(2, 'SQL joins practice', wk[1], '18:00', '19:00');
  add(3, 'Nielsen heuristics', wk[2], '15:00', '16:30');
  add(1, 'Trees and recursion', wk[3], '17:00', '18:30');
  add(4, 'Draft introduction', wk[4], '14:00', '15:00');
  add(2, 'Normalisation exercises', wk[5], '10:00', '12:00');
  add(1, 'Past paper questions', wk[6], '16:00', '17:00');
  add(2, 'Review ER diagram', TODAY, '19:30', '20:30');
  for (let k = 1; k <= 3; k++) {
    const w = wkDays(addDays(-7 * k));
    add(1, 'Lecture notes', w[1], '17:00', '18:' + (k * 10));
    add(2, 'Tutorial problems', w[3], '16:00', k === 2 ? '16:45' : '18:00');
    if (k !== 3) add(3, 'Reading', w[5], '10:00', '11:30');
  }
  const exams = [
    { id: 1, subject_id: 1, title: 'Data Structures midterm', exam_date: addDays(12), prep_status: 'Studying' },
    { id: 2, subject_id: 2, title: 'Database Systems final', exam_date: addDays(24), prep_status: 'Not started' },
  ];
  return { subjects, assignments, sessions, exams };
}
