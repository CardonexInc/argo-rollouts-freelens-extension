import { Renderer } from "@freelensapp/extensions";
import { observer } from "mobx-react";
import { useState } from "react";
import { ArgoRolloutsPreferencesStore } from "../../common/store";
import { withErrorPage } from "../components/error-page";
import { ArgoRollout } from "../k8s/argo-rollout/argo-rollout";

const {
  Component: { DrawerItem, DrawerTitle, KubeObjectListLayout, KubeObjectAge },
} = Renderer;

export interface ArgoRolloutDetailsProps extends Renderer.Component.KubeObjectDetailsProps<ArgoRollout> {
  extension: Renderer.LensExtension;
}

function getDashboardUrl(baseUrl: string, namespace: string, rolloutName: string): string {
  return `${baseUrl}/rollouts/rollout/${namespace}/${rolloutName}`;
}

export const ArgoRolloutDetails = observer((props: ArgoRolloutDetailsProps) => {
  const [preferencesStore, _setPreferencesStore] = useState<ArgoRolloutsPreferencesStore>(
    ArgoRolloutsPreferencesStore.getInstanceOrCreate<ArgoRolloutsPreferencesStore>(),
  );
  const clusterId = window.location.hostname.split(".")[0];
  const { object: argoRollout } = props;
  return withErrorPage(props, () => {
    const podsStore = Renderer.K8sApi.apiManager.getStore("/api/v1/pods")!;
    const baseUrl = preferencesStore.getDashboardUrl(clusterId);
    console.log("[ARGO-ROLLOUTS-DRAWER] baseUrl", baseUrl);

    return (
      <>
        {argoRollout.metadata.annotations?.["rollout.argoproj.io/revision"] && (
          <DrawerItem name="Revision">
            {argoRollout.metadata.annotations["rollout.argoproj.io/revision"] || "N/A"}
          </DrawerItem>
        )}
        {argoRollout.status?.currentPodHash && (
          <DrawerItem name="Current Pod Hash">
            {argoRollout.status.currentPodHash || "N/A"}
          </DrawerItem>
        )}
        {argoRollout.status?.phase && (
          <DrawerItem name="Phase">{argoRollout.status.phase || "N/A"}</DrawerItem>
        )}
        {baseUrl && (
          <DrawerItem name="Rollouts Dashboard">
            <a
              href={getDashboardUrl(baseUrl, argoRollout?.getNs() ?? "", argoRollout?.metadata?.name ?? "")}
              target="_blank"
              rel="noopener noreferrer"
            >
              {argoRollout.metadata.name}
            </a>
          </DrawerItem>
        )}
        <DrawerTitle>Pods</DrawerTitle>
        <KubeObjectListLayout
          tableId="argoRolloutPodsTable"
          className="argoRolloutPods"
          store={podsStore}
          getItems={() => {
            return podsStore.getAllByNs(argoRollout?.getNs() ?? "default").filter((pod) => {
              const labels = pod.metadata.labels || {};
              return (
                labels["rollouts-pod-template-hash"] === argoRollout.status?.currentPodHash &&
                argoRollout.spec.selector?.matchLabels &&
                Object.entries(argoRollout.spec.selector.matchLabels).every(([key, value]) => labels[key] === value)
              );
            });
          }}
          isConfigurable={false}
          showHeader={false}
          sortingCallbacks={{
            name: (pod) => pod.getName(),
            namespace: (pod) => pod.getNs(),
          }}
          searchFilters={[(pod) => pod.getSearchFields()]}
          renderHeaderTitle="Pods"
          renderTableHeader={[
            { title: "Name", sortBy: "name" },
            { title: "Ready", sortBy: "ready" },
            { title: "Status", sortBy: "status" },
            { title: "Restarts", sortBy: "restarts" },
            { title: "Age", sortBy: "age" },
          ]}
          renderTableContents={(pod) => {
            let realPod = pod as Renderer.K8sApi.Pod;
            return [
              realPod.getName(),
              `${realPod.getRunningContainers().length} / ${realPod.getContainers().length}`,
              realPod.getStatus(),
              realPod.getRestartsCount(),
              <KubeObjectAge object={realPod} key="age" />,
            ];
          }}
        />
      </>
    );
  });
});
