# 📬 AI-Powered Gmail Extension with Gemini API

> Co-developed a smart Gmail sidebar add-on using Google Apps Script and Gemini API to enhance email writing through context-aware suggestions.

---

## ✨ Project Overview

This Gmail Add-on leverages Google’s **Gemini API** and **Apps Script** to provide AI-driven email drafting support based on **tone**, **intent**, and **message context**. Seamlessly integrated within Gmail's sidebar, it empowers users to compose polished emails faster and more effectively.

---

## 💡 Features

- 🧠 **Context-Aware Email Suggestions**: Analyzes current thread and drafts recommended replies.
- 🎯 **Tone & Intent Control**: Users can select tone (e.g., formal, casual) and intent (e.g., thank, request).
- 🧩 **Modular Design**: Clean code separation for logic, UI rendering, and API communication.
- ⚡ **Fast & Lightweight**: Designed to work natively within Gmail without external dependencies.
- ✅ **Agile Workflow**: Built collaboratively using Agile methodologies for iterative development and user feedback integration.

---

## 🛠️ Tech Stack

| Component         | Technology                     |
|------------------|---------------------------------|
| Add-on Platform  | Google Apps Script              |
| AI Integration   | Gemini API                      |
| UX/UI            | CardService in Apps Script      |
| Version Control  | Git & GitHub                    |
| Deployment       | Google Workspace (internal)     |

---

## 📽️ Demo

📺 Watch a walkthrough of the extension in action:  
**[Demo Video →](https://your-demo-link.com)**  
_(Replace with a real video link or screenshots if available)_

---

## 🚀 Setup & Deployment

### 1. Clone the repository
```bash
git clone https://github.com/your-username/gmail-gemini-addon.git
cd gmail-gemini-addon
```
### 2. Install clasp and log in
```bash
npm install -g @google/clasp
clasp login
```

### 3. Link your script
```bash
clasp clone <your-script-id>
```
### 4. Push changes
```bash
clasp push
```