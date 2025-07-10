import { Common, Renderer } from "@freelensapp/extensions";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { withErrorPage } from "../components/error-page";
import { ArgoRollout } from "../k8s/argo-rollout/argo-rollout";

const {
  Component: { KubeObjectAge, KubeObjectListLayout },
  K8sApi: { namespacesApi },
  Navigation: { getDetailsUrl },
} = Renderer;

const {
  Util: { stopPropagation },
} = Common;

const KubeObject = ArgoRollout;
type KubeObject = ArgoRollout;

export interface ArgoRolloutsPageProps {
  extension: Renderer.LensExtension;
}

export const ArgoRolloutsPage = observer((props: ArgoRolloutsPageProps) =>
  withErrorPage(props, () => {
    const store = KubeObject.getStore();
    return (
      <KubeObjectListLayout
        tableId={`${KubeObject.crd.singular}Table`}
        className="argoRolloutsPage"
        store={store}
        sortingCallbacks={{
          name: (object: KubeObject) => object.getName(),
          namespace: (object: KubeObject) => object.getNs(),
          phase: (object: KubeObject) => object.status?.phase ?? "",
          replicas: (object: KubeObject) => object.spec.replicas,
          currentPodHash: (object: KubeObject) => object.status?.currentPodHash ?? "",
          type: (object: KubeObject) =>
            object.spec.strategy?.blueGreen ? "BlueGreen" : object.spec.strategy?.canary ? "Canary" : "Unknown",
          revision: (object: KubeObject) => object.metadata.annotations?.["rollout.argoproj.io/revision"] || "-",
        }}
        searchFilters={[(object: KubeObject) => object.getSearchFields()]}
        renderHeaderTitle={KubeObject.crd.title}
        renderTableHeader={[
          { title: "Name", sortBy: "name" },
          { title: "Namespace", sortBy: "namespace" },
          { title: "Phase", sortBy: "phase" },
          { title: "Replicas", sortBy: "replicas" },
          { title: "Current Pod Hash", sortBy: "currentPodHash" },
          { title: "Type", sortBy: "type" },
          { title: "Revision", sortBy: "revision" },
          { title: "Age", sortBy: "age" },
        ]}
        renderTableContents={(object: KubeObject) => {
          return [
            object.getName(),
            <Link
              key="link"
              to={getDetailsUrl(namespacesApi.formatUrlForNotListing({ name: object.getNs() }))}
              onClick={stopPropagation}
            >
              {object.getNs()}
            </Link>,
            object.status?.phase ?? "-",
            object.status?.readyReplicas ?? "-",
            object.status?.currentPodHash ?? "-",
            object.spec.strategy?.blueGreen ? "BlueGreen" : object.spec.strategy?.canary ? "Canary" : "Unknown",
            object.metadata.annotations?.["rollout.argoproj.io/revision"] || "-",
            <KubeObjectAge object={object} key="age" />,
          ];
        }}
      />
    );
  }),
);
