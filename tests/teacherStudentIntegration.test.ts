import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveStudentSelection, getStudentSelectionKey } from '../src/utils/teacherStudentIntegration';

test('resolves a selected student by enrollment id', () => {
  const students = [
    { id: 'student-1', enrollmentId: 'enr-100', name: 'Alem' },
    { id: 'student-2', enrollmentId: 'enr-200', name: 'Beka' }
  ];

  const selected = resolveStudentSelection(students, 'enr-200');
  assert.equal(selected?.name, 'Beka');
});

test('falls back to student id when no enrollment id is available', () => {
  const students = [
    { id: 'student-1', name: 'Alem' },
    { id: 'student-2', name: 'Beka' }
  ];

  const selected = resolveStudentSelection(students, 'student-2');
  assert.equal(selected?.name, 'Beka');
});

test('creates a stable selection key from enrollment data', () => {
  const student = { id: 'student-1', enrollmentId: 'enr-100', name: 'Alem' };
  assert.equal(getStudentSelectionKey(student), 'enr-100');
});
