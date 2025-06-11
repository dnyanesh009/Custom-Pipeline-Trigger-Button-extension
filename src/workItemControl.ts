import * as SDK from "azure-devops-extension-sdk";
import { getClient } from "azure-devops-extension-api";
import { PipelinesRestClient } from "azure-devops-extension-api/Pipelines/PipelinesClient";
import { RunPipelineParameters } from "azure-devops-extension-api/Pipelines/Pipelines";
import { IWorkItemFormService } from "azure-devops-extension-api/WorkItemTracking";
import './styles.css';

SDK.init();

SDK.ready().then(async () => {
  SDK.notifyLoadSucceeded();

  const workService = await SDK.getService<IWorkItemFormService>("ms.vss-work-web.work-item-form");

  const fieldValues = await workService.getFieldValues(["System.AreaPath"]);
  const areaPath = fieldValues["System.AreaPath"];

  if (!areaPath) {
    await workService.setFieldValue("System.AreaPath", "DefaultProject\\DefaultArea");
  }

  const triggerButton = document.getElementById("triggerButton") as HTMLButtonElement | null;
  const statusDiv = document.getElementById("status") as HTMLDivElement | null;

  if (!triggerButton || !statusDiv) {
    console.error("UI elements not found");
    return;
  }

  triggerButton.addEventListener("click", async () => {
    const pipelineIdInput = document.getElementById("pipelineId") as HTMLInputElement | null;
    const projectInput = document.getElementById("project") as HTMLInputElement | null;
    const orgUrlInput = document.getElementById("orgUrl") as HTMLInputElement | null;
    const customVar1Input = document.getElementById("customVar1") as HTMLInputElement | null;

    if (!pipelineIdInput || !projectInput || !orgUrlInput) {
      statusDiv.textContent = "Missing input elements.";
      statusDiv.style.color = "red";
      return;
    }

    const pipelineId = Number(pipelineIdInput.value.trim());
    const project = projectInput.value.trim();
    const orgUrlRaw = orgUrlInput.value.trim();
    const orgUrl = orgUrlRaw.endsWith("/") ? orgUrlRaw.slice(0, -1) : orgUrlRaw;
    const customVar1 = customVar1Input?.value.trim() || "defaultValue";

    if (!pipelineId || !project || !orgUrl) {
      statusDiv.textContent = "Please provide valid pipeline ID, project, and org URL.";
      statusDiv.style.color = "red";
      return;
    }

    try {
      statusDiv.textContent = "Triggering pipeline...";
      statusDiv.style.color = "black";

      const client = getClient(PipelinesRestClient); // ✅ fixed (no await)

      const parameters: RunPipelineParameters = {
        previewRun: false,
        resources: {
          builds: {},
          containers: {},
          packages: {},
          pipelines: {},
          repositories: {}
        },
        variables: {
          customVar1: { value: customVar1, isSecret: false },
          triggerSource: { value: "WorkItemButton", isSecret: false }
        },
        stagesToSkip: [],
        templateParameters: {},
        yamlOverride: ""
      };

      console.log("Calling runPipeline...", { project, pipelineId, parameters });

      const result = await client.runPipeline(parameters, project, pipelineId);

      console.log("Pipeline triggered successfully:", result);

      statusDiv.textContent = `Pipeline triggered! Run ID: ${result.id}`;
      statusDiv.style.color = "green";

      const runSummaryUrl = `${orgUrl}/${project}/_build/results?buildId=${result.id}`;
      window.open(runSummaryUrl, "_blank");

    } catch (e: any) {
      console.error("Pipeline trigger failed:", e);
      statusDiv.textContent = `Error: ${e.message || e}`;
      statusDiv.style.color = "red";
    }
  });
});

SDK.register("pipeline-trigger-button-control", () => {
  return {
    initialize: () => {
      console.log("pipeline-trigger-button-control initialized");
    }
  };
});
