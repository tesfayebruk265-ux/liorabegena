export interface ParsedRegistrationId {
  prefix: string;
  sequence: number;
  year: string;
}

const REGISTRATION_PREFIX = 'ABL-BGN';
const REGISTRATION_ID_REGEX = /^ABL-BGN-(\d{4})-(\d{2})$/;

export function parseStudentRegistrationId(regId: string): ParsedRegistrationId | null {
  const match = regId?.trim()?.toUpperCase().match(REGISTRATION_ID_REGEX);
  if (!match) return null;
  return {
    prefix: REGISTRATION_PREFIX,
    sequence: Number(match[1]),
    year: match[2]
  };
}

export function formatStudentRegistrationId(sequence: number, year: number): string {
  const yearSuffix = String(year).slice(-2);
  return `${REGISTRATION_PREFIX}-${String(sequence).padStart(4, '0')}-${yearSuffix}`;
}

export function getStudentRegistrationIdYear(studentRegistrationId?: string, registeredAt?: string): string {
  const parsed = studentRegistrationId ? parseStudentRegistrationId(studentRegistrationId) : null;
  if (parsed) return parsed.year;
  if (registeredAt) {
    const date = new Date(registeredAt);
    if (!Number.isNaN(date.getTime())) {
      return String(date.getFullYear()).slice(-2);
    }
  }
  return String(new Date().getFullYear()).slice(-2);
}

export function generateStudentRegistrationId(existingIds: string[], registeredAt?: string): string {
  const currentYear = registeredAt ? new Date(registeredAt).getFullYear() : new Date().getFullYear();
  const yearSuffix = String(currentYear).slice(-2);
  const sequences = existingIds
    .map((id) => parseStudentRegistrationId(id))
    .filter((parsed): parsed is ParsedRegistrationId => Boolean(parsed) && parsed.year === yearSuffix)
    .map((parsed) => parsed.sequence);

  const nextSequence = sequences.length > 0 ? Math.max(...sequences) + 1 : 1;
  return formatStudentRegistrationId(nextSequence, currentYear);
}

export function getDisplayStudentId(student: { studentRegistrationId?: string; id: string }): string {
  return student.studentRegistrationId || student.id;
}
