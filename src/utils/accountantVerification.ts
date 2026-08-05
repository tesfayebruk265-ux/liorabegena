export interface PaymentLike {
  id: string;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  referenceNumber?: string;
  courseName?: string;
  instrument?: string;
  branch?: string;
  amountETB?: number;
  paymentMethod?: string;
  paymentDate?: string;
  screenshotUrl?: string;
  status?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  receiptNumber?: string;
}

export interface PaymentApprovalSyncInput {
  payment: PaymentLike;
  students: any[];
  applications: any[];
  enrollments: any[];
  accounts: Record<string, any>;
  sessionUser: any;
  reviewerName: string;
  reviewerId?: string;
  reviewerEmail?: string;
  reviewerRole?: string;
  receiptNumber: string;
}

export function resolvePaymentIdForTransaction(
  txnId: string,
  payments: PaymentLike[],
  transaction?: { id?: string; referenceNumber?: string; studentName?: string; studentId?: string },
  fallbackPayments: PaymentLike[] = []
): string {
  if (!txnId) return '';

  const normalizedTxnId = txnId.replace(/^TXN-/, '');

  const directMatch = [...payments, ...fallbackPayments].find((payment) => payment.id === txnId || payment.id === normalizedTxnId);
  if (directMatch) return directMatch.id;

  if (transaction) {
    const refMatch = [...payments, ...fallbackPayments].find((payment) => payment.referenceNumber && transaction.referenceNumber && payment.referenceNumber === transaction.referenceNumber);
    if (refMatch) return refMatch.id;

    const studentMatch = [...payments, ...fallbackPayments].find((payment) => {
      const sameStudentName = payment.studentName && transaction.studentName && payment.studentName.trim().toLowerCase() === transaction.studentName.trim().toLowerCase();
      const sameStudentId = payment.studentId && transaction.studentId && payment.studentId === transaction.studentId;
      return sameStudentName || sameStudentId;
    });
    if (studentMatch) return studentMatch.id;
  }

  return txnId;
}

export function buildPaymentApprovalSyncState(input: PaymentApprovalSyncInput) {
  const approvedAt = new Date().toISOString();
  const studentId = input.payment.studentId || '';
  const studentEmail = input.payment.studentEmail || '';
  const studentName = input.payment.studentName || '';
  const normalizedStudentName = studentName.trim().toLowerCase();

  const updateStudentMatches = (record: any) => {
    const sameId = Boolean(studentId && (record.id === studentId || record.studentId === studentId));
    const sameEmail = Boolean(studentEmail && (record.email === studentEmail || record.studentEmail === studentEmail));
    const sameName = Boolean(normalizedStudentName && (record.fullName || '').trim().toLowerCase() === normalizedStudentName || (record.studentName || '').trim().toLowerCase() === normalizedStudentName);
    return sameId || sameEmail || sameName;
  };

  const updateApplicationMatches = (record: any) => {
    const sameId = Boolean(studentId && (record.id === studentId || record.studentId === studentId || record.userId === studentId || record.applicationId === studentId));
    const sameEmail = Boolean(studentEmail && (record.email === studentEmail || record.studentEmail === studentEmail));
    const sameName = Boolean(normalizedStudentName && ((record.studentName || '').trim().toLowerCase() === normalizedStudentName || `${record.firstName || ''} ${record.lastName || ''}`.trim().toLowerCase() === normalizedStudentName));
    return sameId || sameEmail || sameName;
  };

  const updateEnrollmentMatches = (record: any) => {
    const sameId = Boolean(studentId && (record.studentId === studentId || record.id === studentId || record.enrollmentId === studentId));
    const sameEmail = Boolean(studentEmail && (record.studentEmail === studentEmail || record.email === studentEmail));
    const sameName = Boolean(normalizedStudentName && (record.studentName || '').trim().toLowerCase() === normalizedStudentName);
    return sameId || sameEmail || sameName;
  };

  const updatedStudents = input.students.map((student: any) => {
    if (!updateStudentMatches(student)) return student;
    return {
      ...student,
      status: 'Approved',
      paymentStatus: 'Approved',
      tuitionPaid: true,
      registrationFeePaid: true,
      approvedAt: approvedAt,
      approvedBy: input.reviewerName,
      studentStatus: 'Enrollment Active'
    };
  });

  const updatedApplications = input.applications.map((application: any) => {
    if (!updateApplicationMatches(application)) return application;
    return {
      ...application,
      status: 'Approved',
      paymentStatus: 'Approved',
      isPaymentCompleted: true,
      studentStatus: 'Enrollment Active'
    };
  });

  const updatedEnrollments = input.enrollments.map((enrollment: any) => {
    if (!updateEnrollmentMatches(enrollment)) return enrollment;
    return {
      ...enrollment,
      status: 'Active',
      paymentStatus: 'Verified',
      approvedAt: approvedAt,
      approvedBy: input.reviewerName
    };
  });

  const updatedAccounts = { ...input.accounts };
  Object.keys(updatedAccounts).forEach((email) => {
    const account = updatedAccounts[email];
    if (!account) return;
    const matchesAccount = Boolean(studentId && (account.id === studentId || account.studentId === studentId)) || Boolean(studentEmail && account.email === studentEmail) || Boolean(normalizedStudentName && (account.fullName || '').trim().toLowerCase() === normalizedStudentName);
    if (!matchesAccount) return;
    updatedAccounts[email] = {
      ...account,
      studentStatus: 'Enrollment Active',
      isRegistrationCompleted: true,
      isPaymentCompleted: true,
      status: 'Active',
      enrolledCourse: account.enrolledCourse || input.payment.courseName || account.enrolledCourse,
      enrolledInstrument: account.enrolledInstrument || input.payment.instrument || account.enrolledInstrument
    };
  });

  let updatedSessionUser = input.sessionUser;
  const sessionMatches = Boolean(studentId && (updatedSessionUser?.id === studentId || updatedSessionUser?.studentId === studentId)) || Boolean(studentEmail && updatedSessionUser?.email === studentEmail) || Boolean(normalizedStudentName && (updatedSessionUser?.fullName || '').trim().toLowerCase() === normalizedStudentName);
  if (updatedSessionUser && sessionMatches) {
    updatedSessionUser = {
      ...updatedSessionUser,
      studentStatus: 'Enrollment Active',
      isRegistrationCompleted: true,
      isPaymentCompleted: true,
      status: 'Active',
      enrolledCourse: updatedSessionUser.enrolledCourse || input.payment.courseName || updatedSessionUser.enrolledCourse,
      enrolledInstrument: updatedSessionUser.enrolledInstrument || input.payment.instrument || updatedSessionUser.enrolledInstrument
    };
  }

  return {
    students: updatedStudents,
    applications: updatedApplications,
    enrollments: updatedEnrollments,
    accounts: updatedAccounts,
    sessionUser: updatedSessionUser,
    auditDetails: `studentId=${studentId}; paymentId=${input.payment.id}; reviewerId=${input.reviewerId || ''}; reviewerEmail=${input.reviewerEmail || ''}; reviewerRole=${input.reviewerRole || ''}; action=approve; timestamp=${approvedAt}`
  };
}
