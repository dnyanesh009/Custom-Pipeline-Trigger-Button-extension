Here's the **complete `README.md`** file in Markdown format for your Azure DevOps custom extension that triggers a pipeline using an Azure Function:

---

```markdown
# 🚀 Azure DevOps Custom Pipeline Trigger Button Extension

This Azure DevOps extension adds a **custom button** to work item forms that allows users to **trigger a pipeline** with custom input fields.

The button communicates securely with an **Azure Function**, which performs the actual pipeline invocation using Azure DevOps REST APIs.

---

## 🧩 Features

- Adds a **"Trigger Pipeline"** button to work items.
- Accepts user inputs for:
  - Organization URL (`orgUrl`)
  - Pipeline ID (`pipelineId`)
  - Personal Access Token (`patToken`) – handled securely via Azure Function
- Calls a **backend Azure Function** to securely invoke Azure DevOps REST API.
- Avoids **CSP violations** and ensures best practices for secure token usage.

---

```
## 🗂️ Project Structure

````
Custom-Pipeline-Trigger-Button-extension/
    dist/
    ├── workItemControl.ts      # Main logic (written in TypeScript)
    ├── workItemControl.html    # HTML for the UI layout
    ├── styles.css              # Custom styles (optional)
    ├── SDK.min.js 
    src/
    ├── workItemControl.ts      # Main logic (written in TypeScript)
    ├── workItemControl.html    # HTML for the UI layout
    ├── styles.css              # Custom styles (optional)
    ├── SDK.min.js              # Azure DevOps SDK (bundled locally)
    webpack.config.js           # Webpack build configuration
    vss-extension.json          # Extension manifest file

````
---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/)
- [TFX CLI](https://github.com/microsoft/tfs-cli):  
  Install via:

  ```bash
  npm install -g tfx-cli
````
---

## 🏗️ Building the Extension

Use Webpack to bundle your TypeScript and static assets:

```bash
npx webpack --config webpack.config.js
```

You can also just run:

```bash
npx webpack
```

> 🔁 Run this every time you make changes in `src/`.

---

## 📦 Packaging the Extension

After the build, generate a `.vsix` package:

```bash
tfx extension create --manifest-globs vss-extension.json
```

This will create a `.vsix` file in the root folder.

---

## 🚀 Publishing to Marketplace

If you're a publisher and want to share or publish the extension:

```bash
tfx extension publish \
  --publisher AnkitaGhogare \
  --share-with ankitaghogare \
  --token <your-PAT>
```

Replace `<your-PAT>` with your personal access token.

---

## 🔐 Backend: Azure Function

To securely trigger the pipeline:

* Create an **HTTP-triggered Azure Function**.
* The function should accept a JSON payload like:

```json
{
  "orgUrl": "https://dev.azure.com/yourorg",
  "pipelineId": "12345",
  "patToken": "**********"
}
```

* It should make an authenticated `POST` request to:

```
{orgUrl}/{project}/_apis/pipelines/{pipelineId}/runs?api-version=7.1-preview.1
```

* Return a success or failure response to the frontend.

> 💡 This ensures your **PAT is never exposed in the browser**, preventing CSP violations and improving security.

---

## 🧪 Testing the Extension

1. Install the extension in your Azure DevOps organization.
2. Navigate to a work item.
3. Enter pipeline info in the UI.
4. Click **Trigger Pipeline**.
5. View status updates in the extension UI.

---

## 🛡️ Content Security Policy (CSP) Notes

* Direct calls from frontend to Azure DevOps APIs **will be blocked** by CSP.
* Using an Azure Function as a **proxy** avoids this limitation.

---

## 📝 License

MIT

---

## 🧠 Author

**Ankita Ghogare**
