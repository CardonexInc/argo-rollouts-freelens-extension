import { Renderer } from "@freelensapp/extensions";
import { ArgoRolloutsPreferencesStore } from "../common/store";
import { ArgoRolloutsSettings } from "./components/argo-rollouts-settings";
import { ArgoRolloutDetails } from "./details/argo-rollout-details";
import { ArgoRolloutIcon } from "./icons";
import { ArgoRollout, ArgoRolloutApi } from "./k8s/argo-rollout";
import { ArgoRolloutMenuItem, type ArgoRolloutMenuItemProps } from "./menus";
import { ArgoRolloutsPage } from "./pages";

export default class ArgoRolloutsRenderer extends Renderer.LensExtension {
  async onActivate() {
    await ArgoRolloutsPreferencesStore.getInstanceOrCreate().loadExtension(this);
  }

  entitySettings = [
    {
      id: "argo-rollouts-settings",
      apiVersions: ["entity.k8slens.dev/v1alpha1"],
      kind: "KubernetesCluster",
      title: "Argo Rollouts",
      group: "Settings",
      components: {
        View: () => <ArgoRolloutsSettings />,
      },
    },
  ];

  kubeObjectDetailItems = [
    {
      kind: ArgoRollout.kind,
      apiVersions: ArgoRollout.crd.apiVersions,
      priority: 10,
      components: {
        Details: (props: Renderer.Component.KubeObjectDetailsProps<ArgoRollout>) => (
          <ArgoRolloutDetails {...props} extension={this} />
        ),
      },
    },
  ];

  clusterPages = [
    {
      id: ArgoRollout.crd.plural,
      components: {
        Page: () => <ArgoRolloutsPage extension={this} />,
      },
    },
  ];

  clusterPageMenus = [
    {
      id: ArgoRollout.crd.plural,
      //parentId: "workloads",
      title: ArgoRollout.crd.title,
      target: { pageId: ArgoRollout.crd.plural },
      components: {
        Icon: ArgoRolloutIcon,
      },
    },
  ];

  kubeObjectMenuItems = [
    {
      kind: ArgoRollout.kind,
      apiVersions: ArgoRollout.crd.apiVersions,
      components: {
        MenuItem: (props: ArgoRolloutMenuItemProps) => (
          <ArgoRolloutMenuItem {...props} extension={this} api={ArgoRollout.getApi() as ArgoRolloutApi} />
        ),
      },
    },
  ];
}
