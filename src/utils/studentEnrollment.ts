import { StudentEnrollment, User } from '../types';

export type InstrumentType = 'Begena' | 'Krar' | 'Masenqo' | 'Washint' | 'Kebero' | 'Vocal';

export function normalizeInstrumentName(raw?: string): InstrumentType {
  if (!raw || !raw.trim()) return '' as any;
  const lower = raw.toLowerCase().trim();
  if (
    lower.includes('kirar') ||
    lower.includes('krar') ||
    lower.includes('krara') ||
    lower.includes('ክራር') ||
    lower.includes('ቅራር') ||
    lower.includes('ከራር')
  ) return 'Krar';
  if (
    lower.includes('masenqo') ||
    lower.includes('masinko') ||
    lower.includes('masinqo') ||
    lower.includes('ማሰንቆ') ||
    lower.includes('ማስንቆ')
  ) return 'Masenqo';
  if (
    lower.includes('washint') ||
    lower.includes('flute') ||
    lower.includes('ዋሽንት')
  ) return 'Washint';
  if (
    lower.includes('kebero') ||
    lower.includes('drum') ||
    lower.includes('ከበሮ')
  ) return 'Kebero';
  if (
    lower.includes('vocal') ||
    lower.includes('voice') ||
    lower.includes('zema') ||
    lower.includes('mezmur') ||
    lower.includes('ድምፅ') ||
    lower.includes('ድምጽ') ||
    lower.includes('ዜማ') ||
    lower.includes('መዝሙር')
  ) return 'Vocal';
  if (
    lower.includes('begena') ||
    lower.includes('በገና')
  ) return 'Begena';
  return 'Begena';
}

export function getStudentActiveEnrollments(
  user: User | null,
  contextEnrollments: StudentEnrollment[] = []
): StudentEnrollment[] {
  if (!user) return [];

  // Check if student is permanently deleted
  try {
    const rawDeleted = localStorage.getItem('ab_deleted_students_v3');
    if (rawDeleted) {
      const deletedList: string[] = JSON.parse(rawDeleted);
      if (Array.isArray(deletedList) && deletedList.length > 0) {
        const uId = (user.id || '').toLowerCase().trim();
        const uEmail = (user.email || '').toLowerCase().trim();
        const uName = (user.fullName || '').toLowerCase().trim();
        const isDel = deletedList.some(item => {
          if (!item) return false;
          const cleanItem = String(item).toLowerCase().trim();
          return (uId && cleanItem === uId) || (uEmail && cleanItem === uEmail) || (uName && cleanItem === uName);
        });
        if (isDel) return [];
      }
    }
  } catch {}

  const results: StudentEnrollment[] = [];
  const userFullNameClean = (user.fullName || '').toLowerCase().trim();
  const userEmailClean = (user.email || '').toLowerCase().trim();

  // Helper matcher
  const matchesUser = (stuId?: string, email?: string, name?: string) => {
    if (stuId && user.id && stuId === user.id) return true;
    if (email && userEmailClean && email.toLowerCase().trim() === userEmailClean) return true;
    if (name && userFullNameClean && name.toLowerCase().trim() === userFullNameClean) return true;
    return false;
  };

  // 1. Search in DataContext enrollments
  // IMPORTANT: Only return enrollments with status 'Active' or 'Completed'.
  // 'Pending Verification' enrollments must NOT be shown as active until the
  // accountant verifies the payment and activates the enrollment.
  if (Array.isArray(contextEnrollments) && contextEnrollments.length > 0) {
    const matched = contextEnrollments.filter(
      (e) => e && matchesUser(e.studentId, e.studentEmail, e.studentName) && (e.status === 'Active' || e.status === 'Completed')
    );
    if (matched.length > 0) {
      results.push(...matched);
    }
  }

  // 2. Search in localStorage ab_enrollments_v4
  try {
    const saved = localStorage.getItem('ab_enrollments_v4');
    if (saved) {
      const parsed: StudentEnrollment[] = JSON.parse(saved);
      const matched = parsed.filter(
        (e) => e && matchesUser(e.studentId, e.studentEmail, e.studentName) && (e.status === 'Active' || e.status === 'Completed')
      );
      for (const m of matched) {
        if (!results.some((r) => r.id === m.id || r.courseName === m.courseName)) {
          results.push(m);
        }
      }
    }
  } catch {}

  // 3. Search in localStorage ab_applications_v3
  // IMPORTANT: Only create an active enrollment from an application that has been
  // explicitly Approved (status === 'Approved' or paymentStatus === 'Approved').
  // A submitted-but-unapproved application must NOT produce an active enrollment
  // or trigger a teacher assignment.
  try {
    const apps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
    const userApps = apps.filter(
      (app: any) =>
        app &&
        (app.status === 'Approved' || app.paymentStatus === 'Approved') &&
        (matchesUser(app.userId, app.studentEmail || app.email, app.studentName) ||
          (app.firstName && matchesUser(app.userId, app.email, `${app.firstName} ${app.lastName || ''}`)))
    );
    for (let idx = 0; idx < userApps.length; idx++) {
      const app = userApps[idx];
      const instrumentStr = app.selectedInstrument || app.instrument || app.selectedCourseName || app.course?.name || user.enrolledInstrument || '';
      if (!instrumentStr) continue; // Do not default to Begena; require an explicit instrument
      const inst = normalizeInstrumentName(instrumentStr);
      if (!inst) continue;
      const rawCourseName = app.selectedCourseName || app.courseName || app.course?.name || user.enrolledCourse || `${inst} Basic 1`;
      const appEnrId = `ENR-APP-${app.id || idx}`;
      if (!results.some((r) => r.id === appEnrId || normalizeInstrumentName(r.instrument || r.courseName) === inst)) {
        results.push({
          id: appEnrId,
          studentId: user.id,
          studentName: user.fullName || 'Student',
          studentEmail: user.email || '',
          courseId: inst.toLowerCase(),
          courseName: rawCourseName,
          instrument: inst,
          level: app.selectedLevel || app.selectedLevelName || 'Basic 1',
          learningMode: app.learningMode || 'In-Person',
          branch: app.selectedBranch || 'Bole Branch, Addis Ababa',
          assignedTeacherName: app.assignedTeacherName || (app.assignedTeacherId ? 'Assigned Teacher' : undefined),
          assignmentStatus: app.assignedTeacherName ? 'Assigned' : 'Pending Teacher Assignment',
          enrollmentDate: app.submittedAt || new Date().toISOString().split('T')[0],
          status: 'Active',
          progressPercent: 0
        });
      }
    }
  } catch {}

  // 4. Search in localStorage ab_students_v3
  // IMPORTANT: Only create an active enrollment from a student record that has been
  // explicitly Approved (status === 'Approved' or paymentStatus === 'Approved').
  // A submitted-but-unapproved student record must NOT produce an active enrollment.
  try {
    const students = JSON.parse(localStorage.getItem('ab_students_v3') || '[]');
    const matchedStudents = students.filter((s: any) =>
      s &&
      (s.status === 'Approved' || s.paymentStatus === 'Approved' || s.tuitionPaid === true) &&
      matchesUser(s.id || s.studentId, s.email, s.fullName)
    );
    for (const s of matchedStudents) {
      const instRaw = s.instrument || s.instrumentOwned || s.courseName || s.course;
      if (!instRaw) continue; // Require an explicit instrument; do not default
      const inst = normalizeInstrumentName(instRaw);
      if (!inst) continue;
      const cName = s.courseName || s.course || `${inst} Course`;
      const stuEnrId = `ENR-STU-${s.id || user.id}`;
      if (!results.some((r) => r.id === stuEnrId || normalizeInstrumentName(r.instrument || r.courseName) === inst)) {
        results.push({
          id: stuEnrId,
          studentId: user.id,
          studentName: user.fullName || s.fullName,
          studentEmail: user.email || s.email || '',
          courseId: inst.toLowerCase(),
          courseName: cName,
          instrument: inst,
          level: s.level || 'Basic 1',
          learningMode: s.learningMode || 'In-Person',
          branch: s.branch || 'Bole Branch, Addis Ababa',
          assignedTeacherName: s.assignedTeacherName || (s.teacherName && s.teacherName !== 'Lique Mezemer Abel' ? s.teacherName : undefined),
          assignmentStatus: s.assignedTeacherName ? 'Assigned' : 'Pending Teacher Assignment',
          enrollmentDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          progressPercent: 0
        });
      }
    }
  } catch {}

  // 5. Search in localStorage ab_transactions_v3
  try {
    const txns = JSON.parse(localStorage.getItem('ab_transactions_v3') || '[]');
    const userTxns = txns.filter(
      (t: any) =>
        t &&
        (t.status === 'Verified' || t.status === 'Approved') &&
        matchesUser(t.studentId, t.studentEmail, t.studentName)
    );
    for (const t of userTxns) {
      if (t.course) {
        const inst = normalizeInstrumentName(t.course);
        if (!inst) continue;
        const txnEnrId = `ENR-TXN-${t.id}`;
        if (!results.some((r) => r.id === txnEnrId || normalizeInstrumentName(r.instrument || r.courseName) === inst)) {
          results.push({
            id: txnEnrId,
            studentId: user.id,
            studentName: user.fullName,
            studentEmail: user.email || '',
            courseId: inst.toLowerCase(),
            courseName: t.course,
            instrument: inst,
            level: t.level || 'Basic 1',
            learningMode: 'In-Person',
            branch: t.branch || 'Bole Branch, Addis Ababa',
            assignedTeacherName: t.assignedTeacherName || undefined,
            assignmentStatus: t.assignedTeacherName ? 'Assigned' : 'Pending Teacher Assignment',
            enrollmentDate: t.date || new Date().toISOString().split('T')[0],
            status: 'Active',
            progressPercent: 0
          });
        }
      }
    }
  } catch {}

  // 6. Fallback from user profile attributes if user is student and has enrollment active status
  // IMPORTANT: Only create an enrollment from the user profile if the student has
  // explicitly completed payment (isPaymentCompleted === true) or has an explicit
  // enrollment active/approved status. Do NOT create an enrollment just because
  // enrolledInstrument or enrolledCourse exists on the profile - those fields can
  // be set during registration before payment is verified.
  if (results.length === 0 && user.role === 'student') {
    if (
      user.isPaymentCompleted === true ||
      user.studentStatus === 'Enrollment Active' ||
      user.studentStatus === 'Approved'
    ) {
      const instRaw = user.enrolledInstrument || user.enrolledCourse;
      if (!instRaw) return []; // No instrument specified; do not default to Begena
      const inst = normalizeInstrumentName(instRaw);
      if (!inst) return [];
      const courseName = user.enrolledCourse || `${inst} Basic 1`;
      results.push({
        id: `ENR-PROFILE-${user.id}`,
        studentId: user.id,
        studentName: user.fullName,
        studentEmail: user.email,
        courseId: inst.toLowerCase(),
        courseName: courseName,
        instrument: inst,
        level: 'Basic 1',
        learningMode: 'In-Person',
        branch: user.branch || 'Bole Branch, Addis Ababa',
        assignedTeacherName: (user as any).assignedTeacherName || undefined,
        assignmentStatus: (user as any).assignedTeacherName ? 'Assigned' : 'Pending Teacher Assignment',
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        progressPercent: 0
      });
    }
  }

  // 7. Filter & Deduplicate enrollments
  const userCourseRaw = user.enrolledCourse || (user as any).selectedCourseName || '';
  const userInstRaw = user.enrolledInstrument || (user as any).selectedInstrument || '';
  const targetInst = (userInstRaw || userCourseRaw) ? normalizeInstrumentName(userInstRaw || userCourseRaw) : null;

  let filtered = results;
  if (targetInst && results.length > 1) {
    const matchingTarget = results.filter(r => normalizeInstrumentName(r.instrument || r.courseName) === targetInst);
    if (matchingTarget.length > 0) {
      filtered = matchingTarget;
    }
  }

  // Deduplicate by normalized instrument so a student doesn't see duplicate enrollments for the same course
  const uniqueByInst: StudentEnrollment[] = [];
  for (const item of filtered) {
    const inst = normalizeInstrumentName(item.instrument || item.courseName);
    if (!uniqueByInst.some(u => normalizeInstrumentName(u.instrument || u.courseName) === inst)) {
      uniqueByInst.push(item);
    }
  }

  return uniqueByInst;
}

export function isStudentEnrolledInInstrument(
  user: User | null,
  targetInstrument: InstrumentType,
  contextEnrollments: StudentEnrollment[] = []
): boolean {
  if (!user) return false;
  // Non-students (teachers, admins, parents) can inspect any portal
  if (user.role !== 'student') return true;

  const enrollments = getStudentActiveEnrollments(user, contextEnrollments);
  if (enrollments.length === 0) return false;

  const targetNorm = normalizeInstrumentName(targetInstrument);
  return enrollments.some((e) => normalizeInstrumentName(e.instrument || e.courseName) === targetNorm);
}