import { COL, ASG, PREP, addDays, TODAY } from './util';

// Field layouts + default values for the add/edit pop-up
export function formFor(kind, subjects) {
  const subj = subjects.map((s) => [s.id, s.name]);
  const sid = subjects[0] && subjects[0].id;
  return {
    subjects: {
      title: 'subject',
      fields: [
        { name: 'name', label: 'Subject name', type: 'text', required: true },
        { name: 'code', label: 'Subject code', type: 'text' },
        { name: 'lecturer', label: 'Lecturer name', type: 'text' },
        { name: 'color', label: 'Colour', type: 'color' },
      ],
      blank: { name: '', code: '', lecturer: '', color: COL[subjects.length % 6] },
    },
    assignments: {
      title: 'assignment',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'subject_id', label: 'Subject', type: 'select', options: subj },
        { name: 'due_date', label: 'Deadline', type: 'date', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ASG.map((x) => [x, x]) },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
      blank: { title: '', subject_id: sid, due_date: addDays(7), status: 'Pending', description: '' },
    },
    sessions: {
      title: 'study session',
      fields: [
        { name: 'subject_id', label: 'Subject', type: 'select', options: subj },
        { name: 'topic', label: 'What will you study?', type: 'text' },
        { name: 'session_date', label: 'Date', type: 'date', required: true },
        { name: 'start_time', label: 'Start time', type: 'time', required: true },
        { name: 'end_time', label: 'End time', type: 'time', required: true },
      ],
      blank: { subject_id: sid, topic: '', session_date: TODAY, start_time: '16:00', end_time: '17:00', completed: false },
    },
    exams: {
      title: 'exam',
      fields: [
        { name: 'title', label: 'Exam name', type: 'text', required: true },
        { name: 'subject_id', label: 'Subject', type: 'select', options: subj },
        { name: 'exam_date', label: 'Exam date', type: 'date', required: true },
        { name: 'prep_status', label: 'Preparation', type: 'select', options: PREP.map((x) => [x, x]) },
      ],
      blank: { title: '', subject_id: sid, exam_date: addDays(14), prep_status: 'Not started' },
    },
  }[kind];
}
