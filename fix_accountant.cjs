const fs = require('fs');
const filePath = 'src/components/AccountantPortal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find the handleVerifyTransaction function and add enrollment activation logic
// We need to add code after the ab_students_v3 update to also update ab_enrollments_v4

const oldStr = `        safeSetItem('ab_students_v3', JSON.stringify(updatedStudents));

        // Update user accounts`;

const newStr = `        safeSetItem('ab_students_v3', JSON.stringify(updatedStudents));

        // Update enrollment record to Active status and trigger teacher auto-assignment
        try {
          const savedEnrs = JSON.parse(localStorage.getItem('ab_enrollments_v4') || '[]');
          let enrChanged = false;
          const updatedEnrs = savedEnrs.map((enr: any) => {
            const enrMatchId = enr.studentId === targetTxn.studentId || enr.studentId === targetTxn?.studentId;
            const enrMatchName = enr.studentName && targetTxn?.studentName && enr.studentName.trim().toLowerCase() === targetTxn.studentName.trim().toLowerCase();
            const enrMatchEmail = enr.studentEmail && (targetTxn as any).studentEmail && enr.studentEmail.trim().toLowerCase() === (targetTxn as any).studentEmail.trim().toLowerCase();
            if (enrMatchId || enrMatchName || enrMatchEmail) {
              enrChanged = true;
              return {
                ...enr,
                status: 'Active',
                paymentStatus: 'Verified'
              };
            }
            return enr;
          });
          if (enrChanged) {
            safeSetItem('ab_enrollments_v4', JSON.stringify(updatedEnrs));
            window.dispatchEvent(new Event('ab_enrollments_updated'));
          }
        } catch (e) {
          console.error('Error updating enrollment status in AccountantPortal:', e);
        }

        // Update user accounts`;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(filePath, content);
  console.log('SUCCESS: Added enrollment activation to handleVerifyTransaction');
} else {
  console.log('ERROR: Could not find the target string in AccountantPortal.tsx');
  // Show context for debugging
  const idx = content.indexOf("safeSetItem('ab_students_v3'");
  if (idx > -1) {
    console.log('Context:');
    console.log(JSON.stringify(content.substring(idx, idx + 200)));
  }
}