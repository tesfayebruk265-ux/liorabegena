const fs = require('fs');
const filePath = 'src/components/EnrollmentWizard.tsx';
let content = fs.readFileSync(filePath, 'utf8');
const oldStr = "status: 'Active'\n      }, 'Student Online Registration');";
const newStr = "status: 'Pending Verification'\n      }, 'Student Online Registration');";
if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(filePath, content);
  console.log('SUCCESS: Replaced status Active -> Pending Verification');
} else {
  // Try with \r\n
  const oldStr2 = "status: 'Active'\r\n      }, 'Student Online Registration');";
  if (content.includes(oldStr2)) {
    content = content.replace(oldStr2, newStr);
    fs.writeFileSync(filePath, content);
    console.log('SUCCESS: Replaced status Active -> Pending Verification (CRLF)');
  } else {
    console.log('ERROR: Could not find the target string');
    // Show surrounding content for debugging
    const idx = content.indexOf("'Student Online Registration'");
    if (idx > -1) {
      console.log('Context around target:');
      console.log(JSON.stringify(content.substring(idx - 100, idx + 50)));
    }
  }
}