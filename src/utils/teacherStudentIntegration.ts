export interface StudentSelectionLike {
  id?: string;
  enrollmentId?: string;
  name?: string;
}

export function getStudentSelectionKey(student?: StudentSelectionLike | null): string | null {
  if (!student) return null;
  return student.enrollmentId || student.id || null;
}

export function resolveStudentSelection<T extends StudentSelectionLike>(students: T[], selectedKey?: string | null): T | undefined {
  if (!selectedKey) return undefined;

  return students.find((student) => {
    const key = getStudentSelectionKey(student);
    return key === selectedKey;
  });
}
