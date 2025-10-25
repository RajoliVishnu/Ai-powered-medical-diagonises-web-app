# 📧 Step-by-Step Guide to Send Real Email

## ✅ Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Click "Select app" → Choose "Mail"
4. Click "Select device" → Choose "Other" → Type "Testing"
5. Click "Generate"
6. **Copy the 16-character password** (it looks like: abcd efgh ijkl mnop)

---

## ✅ Step 2: Edit the Email Script

Open: `project/send-real-email.js`

### Find these lines (around line 14-16):
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // ← Change this
    pass: 'your-app-password'      // ← Change this
  }
});
```

### Replace with your actual Gmail:
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR-GMAIL@gmail.com',           // ← Your Gmail
    pass: 'abcd efgh ijkl mnop'              // ← The app password you copied
  }
});
```

---

## ✅ Step 3: Uncomment the Send Line

Find this line (around line 123):
```javascript
// const info = await transporter.sendMail(mailOptions);
```

Remove the `//` to make it:
```javascript
const info = await transporter.sendMail(mailOptions);
```

Also uncomment these lines (around line 124-125):
```javascript
// console.log('✅ Email sent successfully!');
// console.log('📬 Message ID:', info.messageId);
```

To:
```javascript
console.log('✅ Email sent successfully!');
console.log('📬 Message ID:', info.messageId);
```

---

## ✅ Step 4: Run the Script

```bash
cd project
node send-real-email.js
```

---

## ✅ Step 5: Check Your Email

Check the inbox of: **vishnuvardan308@gmail.com**

You should receive an email with:
- Subject: "✅ Integration Test Confirmation - Medical Diagnosis Successful"
- Beautiful HTML format with test results
- All integration test steps passed
- Performance metrics

---

## 🎯 What You'll Get in Your Email:

The email will contain:
- ✅ All 7 integration test steps (PASSED)
- 📊 System performance metrics
- 🔗 Data flow verification
- 🎨 Professional HTML formatting
- Your email address (vishnuvardan308@gmail.com)

---

## ⚠️ Troubleshooting:

**If you get an error about "Less secure app access":**
- Make sure you're using App Password, not your regular Gmail password
- App Password is 16 characters separated by spaces

**If email doesn't send:**
- Check that you removed `//` from the send line
- Verify the app password is correct
- Make sure your Gmail is correct

---

## 📸 Screenshot for Your Report:

After the email arrives:
1. Open your Gmail inbox
2. Click on the email
3. Take a screenshot
4. It will look exactly like Figure 7.3 in your report!

---

**Ready? Follow the steps above!** 🚀
