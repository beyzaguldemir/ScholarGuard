# 🛡️ ScholarGuard – Academic Review & Editor Support System

ScholarGuard is an AI-powered **academic review assistant** designed to help researchers reduce **desk rejection** risks by providing professional, editor-style feedback — **without writing or rewriting academic content**.

## 🎯 Purpose
ScholarGuard does **not** generate academic text.  
It acts as a **review and auditing tool**, similar to Microsoft Word’s *Review* mode, focusing on:
- Language and clarity issues
- Structural and formatting inconsistencies
- Journal submission risks
- Editor and reviewer expectations

## ✨ Key Features
- 📝 **Word-like Review Interface** (read-only text + margin comments)
- 🧠 **Desk Rejection Risk Analysis** (Low / Medium / High / Critical)
- 📋 **Actionable Submission Checklist**
- 📊 **Visual Suggestions** for tables and figures (non-generative)
- 🔒 **No data storage** — analysis runs only during the session

## 📁 Supported File Types
- `.txt`
- `.md`
- `.docx` (parsed and analyzed as plain text; original file is never modified)

> ⚠️ ScholarGuard never edits or rewrites uploaded documents.

## 🛠️ Tech Stack
- **Frontend:** React + Tailwind CSS  
- **AI:** Google Gemini API (`gemini-3-flash-preview`)  
- **Charts:** Recharts  
- **Icons:** Lucide React  

## 🧭 Ethical Principles
- No content generation
- No paraphrasing or rewriting
- No authorship contribution
- Final responsibility always belongs to the researcher

## 🚀 Usage
1. Upload or paste your academic draft
2. Click **Analyze**
3. Review comments, risks, and checklist
4. Apply changes manually in your own editor

---

*ScholarGuard aims to clarify the researcher’s voice — not replace it.*
