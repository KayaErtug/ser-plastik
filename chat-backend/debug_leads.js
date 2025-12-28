import "dotenv/config";
import { captureLeadIfNeeded } from "./leads.js";
import { sendLeadEmail } from "./mailer.js";

console.log("--- DEBUGGING START ---");

// 1. Check Env Vars
console.log("Checking Environment Variables...");
const requiredVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "LEAD_EMAIL_TO"];
requiredVars.forEach((key) => {
    if (process.env[key]) {
        console.log(`✅ ${key} is set.`);
    } else {
        console.error(`❌ ${key} is MISSING!`);
    }
});

// 2. Test Lead Capture Logic
console.log("\nTesting captureLeadIfNeeded...");
const testLead = {
    timestamp: new Date().toISOString(),
    intent: "sales",
    sessionId: "debug-session-123",
    ip: "127.0.0.1",
    userMessage: "Fiyat nedir? umaykutay@gmail.com",
    aiReply: "Fiyatlarımız şöyledir...",
};

try {
    const result = captureLeadIfNeeded(testLead);
    console.log("captureLeadIfNeeded result:", result);
} catch (error) {
    console.error("captureLeadIfNeeded ERROR:", error);
}

// 3. Test Email Sending Directly (Optional, if captureLeadIfNeeded fails to send)
// console.log("\nTesting sendLeadEmail directly...");
// try {
//   await sendLeadEmail({
//     to: "umaykutay@gmail.com",
//     subject: "Test Email from Debug Script",
//     text: "This is a test email to verify SMTP configuration.",
//   });
//   console.log("Direct email send success.");
// } catch (error) {
//   console.error("Direct email send ERROR:", error);
// }

console.log("--- DEBUGGING END ---");
