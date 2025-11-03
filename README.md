# MailGenieAI — Gmail Add‑on (Google Workspace Add‑on)

An AI‑assisted Gmail add‑on that **summarizes threads, drafts replies, rewrites tone/grammar,
and translates text** — directly in the Gmail sidebar. Built on **Google Apps Script** (CardService)
as a **Google Workspace Add‑on** for Gmail.

[![Last commit](https://img.shields.io/github/last-commit/MeetAdalaja/MailGenieAI---Gmail-Add-On)](https://github.com/MeetAdalaja/MailGenieAI---Gmail-Add-On/commits/main)
[![Repo size](https://img.shields.io/github/repo-size/MeetAdalaja/MailGenieAI---Gmail-Add-On)](https://github.com/MeetAdalaja/MailGenieAI---Gmail-Add-On)
[![Open issues](https://img.shields.io/github/issues/MeetAdalaja/MailGenieAI---Gmail-Add-On)](https://github.com/MeetAdalaja/MailGenieAI---Gmail-Add-On/issues)
![Built with](https://img.shields.io/badge/Google%20Apps%20Script-Workspace%20Add--on-34A853)

---

## ✨ What it does

- 🧠 **Summarize** long email threads (TL;DR)
- ✍️ **Draft a reply** from the current thread context
- 🎭 **Rewrite tone** (formal, friendly, concise) and **fix grammar**
- 🌐 **Translate** selected text or the composed reply
- 📋 **Insert** the generated text into the Gmail reply box with one click

> Exact features depend on the repo version; remove any that don’t apply to your codebase.

---


## 📽️ Demo

📺 Watch a walkthrough of the extension in action:  
**[Demo Video →](https://drive.google.com/file/d/1XLQEB14bVdKrvYUpcYqUFDyPupHNryJC/view?usp=sharing)**  

---

## 🧱 Tech Stack

- **Platform:** Google **Apps Script** (V8 runtime), **Workspace Add‑on (Gmail)**
- **UI:** **CardService** (cards, sections, widgets, actions)
- **AI provider (configurable):** OpenAI API (default) — can be swapped for Vertex/Gemini etc.
- **Secrets:** Script & User Properties (encrypted at rest by Google)
- **Optional tooling:** `clasp` for local development and version control

---

## 🗂️ Repository Structure (typical)

```text
MailGenieAI---Gmail-Add-On/
├─ src/
│  ├─ addon.gs            # entry points: buildAddOn(e), actions, utilities
│  ├─ cards.gs            # CardService UI (home card, contextual cards)
│  ├─ ai_client.gs        # call to OpenAI (or provider) with safety & retries
│  ├─ gmail_context.gs    # thread/message extraction helpers
│  └─ utils.gs            # formatting, truncation, logging
├─ appsscript.json        # manifest (addOn config, oauthScopes, runtime)
├─ README.md
└─ (optional) /docs       # screenshots, flow charts, privacy statement
```

> Your file names may differ; adjust this section to match your repo exactly.

---

## 🔧 Setup (Developer Install)

> You can develop entirely in the **Apps Script** editor, or use **clasp** locally.

### Option A — Apps Script editor
1. In Gmail, click the add‑on icon → **Manage add‑ons** → **Build your own** (or go to https://script.google.com).
2. Create a **Standalone** Apps Script project and copy the files from this repo.
3. Update the **manifest** (`appsscript.json`) with the add‑on config (see below).
4. Set **Script Properties** → `OPENAI_API_KEY` (or your chosen provider key).
5. **Deploy** → **Test deployments** → Install for your account → Open Gmail and test.

### Option B — Local dev with `clasp`
```bash
npm i -g @google/clasp
clasp login
# clone this repo
git clone https://github.com/MeetAdalaja/MailGenieAI---Gmail-Add-On.git
cd MailGenieAI---Gmail-Add-On
# create or link to an Apps Script project
clasp create --type standalone --title "MailGenieAI"
# or: clasp clone <scriptId>
clasp push     # uploads src/ and manifest
clasp open     # opens the project in the Apps Script IDE
```

---

## 🗝️ Configuration

### Script Properties
Set these in **Project Settings → Script properties**:

```
OPENAI_API_KEY=sk-xxxxx                     # or GEMINI_API_KEY, etc.
PROVIDER=openai                             # openai | vertex | other
MODEL=gpt-4o-mini                           # choose your model
MAX_TOKENS=512
TEMPERATURE=0.2
```

> Rename to match your actual code. Never hard‑code secrets into source.

### Manifest (`appsscript.json`) — Example
```json
{
  "timeZone": "America/Toronto",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/script.locale",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/gmail.addons.execute",
    "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
    "https://www.googleapis.com/auth/gmail.addons.current.action.compose"
  ],
  "addOns": {
    "common": {
      "name": "MailGenieAI",
      "logoUrl": "https://.../logo.png",
      "layoutProperties": { "primaryColor": "#1967d2", "secondaryColor": "#185abc" }
    },
    "gmail": {
      "contextualTriggers": [{
        "unconditional": {},
        "onTriggerFunction": "buildAddOn"
      }],
      "openLinkUrlPrefixes": ["https://", "http://"],
      "primaryColor": "#1967d2",
      "secondaryColor": "#185abc"
    }
  }
}
```
> Keep scopes **minimal**. If you only read messages and write drafts, avoid broader Gmail scopes.

---

## 🚀 Deploy (User/Domain or Marketplace)

1. In the Script IDE: **Deploy → Manage deployments → Install test deployments** to your account.
2. For teammates (same domain): switch to **Workspace Add‑on** deployment and **Publish → Deploy** to domain.
3. For public distribution: complete **OAuth consent** (Cloud Console), **Add‑on review**, and **Marketplace listing**.

**After deploy:** open Gmail → right sidebar → **MailGenieAI** → test actions.

---

## 🔒 Privacy & Security

- **No persistent storage** of email content by default (beyond Apps Script logs, which you should keep minimal).
- **PII‑aware prompts:** truncate/redact long threads; send **only what’s needed** to the AI provider.
- **Secrets** live in Script/User Properties; do **not** commit keys to Git.
- Add a **PRIVACY.md** (suggested) describing data flow and retention.
- Respect API/data‑source **Terms of Use** and user consent.

---

## 🧭 Roadmap

- [ ] Per‑user settings (default tone, target language)
- [ ] Thread‑aware context window with smart truncation
- [ ] Templates (Follow‑up, Intro, Scheduling, Bug report)
- [ ] Organization policy controls (domain‑wide toggles)
- [ ] i18n for the Add‑on UI

---

## 🐞 Troubleshooting

- **"This app is blocked" / Consent screen:** finish OAuth configuration in Cloud Console and add test users.
- **403 domain policy:** ask your Workspace admin to allow third‑party add‑ons.
- **429 / rate limit (AI API):** lower frequency; add exponential backoff.
- **`Exception: Request failed (401)`:** verify API key in Script Properties.
- **Quota errors:** Apps Script daily limits may apply — check quotas in the editor.

---

## 📄 License

Add a `LICENSE` file (e.g., MIT) if you intend to open‑source.  
Without a license, the default is **all rights reserved**.

---

## 🙏 Acknowledgements

- Google Workspace Add‑on platform & CardService
- Open‑source community for examples and tooling (`clasp`, Apps Script samples)
