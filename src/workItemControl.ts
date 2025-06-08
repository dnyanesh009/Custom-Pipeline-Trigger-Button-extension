import * as SDK from "azure-devops-extension-sdk";
import { getService } from "azure-devops-extension-sdk";
import { IWorkItemFormService } from "azure-devops-extension-api/WorkItemTracking";
import './styles.css'; // ✅ This automatically inlines it into your JS bundle


SDK.init(); // Initialize the SDK
SDK.ready().then(async () => {
  SDK.notifyLoadSucceeded();

  const service = await getService<IWorkItemFormService>("ms.vss-work-web.work-item-form");

  const areaPath = await service.getFieldValue("System.AreaPath");

  if (!areaPath) {
    await service.setFieldValue("System.AreaPath", "DefaultProject\\DefaultArea");
  }
// });

  const triggerButton = document.getElementById("triggerButton") as HTMLButtonElement;
  const statusDiv = document.getElementById("status") as HTMLDivElement;

  triggerButton.addEventListener("click", async () => {
    const pipelineId = (document.getElementById("pipelineId") as HTMLInputElement).value.trim();
    const orgUrl = (document.getElementById("orgUrl") as HTMLInputElement).value.trim();
    const project = (document.getElementById("project") as HTMLInputElement).value.trim();
    const patToken = (document.getElementById("patToken") as HTMLInputElement).value.trim();

    if (!pipelineId || !orgUrl || !project || !patToken) {
      statusDiv.textContent = "Please fill in all fields.";
      statusDiv.style.color = "red";
      return;
    }

    const normalizedOrgUrl = orgUrl.endsWith('/') ? orgUrl.slice(0, -1) : orgUrl;
    const apiUrl = `${normalizedOrgUrl}/${project}/_apis/pipelines/${pipelineId}/runs?api-version=7.1-preview.1`;

    try {
      statusDiv.textContent = "Triggering pipeline...";
      statusDiv.style.color = "black";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(":" + patToken),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const err = await response.text();
        statusDiv.textContent = `Error: ${response.status} - ${err}`;
        statusDiv.style.color = "red";
        return;
      }

      statusDiv.textContent = "Pipeline triggered successfully!";
      statusDiv.style.color = "green";
    } catch (error: any) {
      statusDiv.textContent = `Exception: ${error.message}`;
      statusDiv.style.color = "red";
    }
  });
});

SDK.register("pipeline-trigger-button-control", () => {
  return {};
});

