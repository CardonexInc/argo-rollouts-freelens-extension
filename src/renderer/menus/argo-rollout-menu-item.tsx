import { Common, Renderer } from "@freelensapp/extensions";
import { withErrorPage } from "../components/error-page";
import { ArgoRollout, ArgoRolloutApi } from "../k8s/argo-rollout/argo-rollout";

const {
  Component: { MenuItem },
} = Renderer;

export interface ArgoRolloutMenuItemProps extends Common.Types.KubeObjectMenuItemProps<ArgoRollout> {
  extension: Renderer.LensExtension;
  api: ArgoRolloutApi;
}

export const ArgoRolloutMenuItem = (props: ArgoRolloutMenuItemProps) =>
  withErrorPage(props, () => {
    const { object, api } = props;
    if (!object) return <></>;

    const phase = object.status?.phase;

    const handleAbort = async () => {
      if (!api) {
        console.error("API is not defined in props.");
        return;
      }

      const patch: Partial<ArgoRollout> = { spec: { paused: false }, status: { abort: true } };
      const resourceDescriptor = { name: object.metadata.name, namespace: object.metadata.namespace };
      await api.patch(resourceDescriptor, patch, "merge");
    };

    const handlePromote = async () => {
      if (!api) {
        console.error("API is not defined in props.");
        return;
      }

      const patch: Partial<ArgoRollout> = { spec: { paused: false }, status: { promoteFull: false } };
      const resourceDescriptor = { name: object.metadata.name, namespace: object.metadata.namespace };
      await api.patch(resourceDescriptor, patch, "merge");
    };

    const handlePromoteFull = async () => {
      if (!api) {
        console.error("API is not defined in props.");
        return;
      }

      const patch: Partial<ArgoRollout> = { spec: { paused: false }, status: { promoteFull: true } };
      const resourceDescriptor = { name: object.metadata.name, namespace: object.metadata.namespace };
      await api.patch(resourceDescriptor, patch, "merge");
    };

    const handleResume = async () => {
      if (!api) {
        console.error("API is not defined in props.");
        return;
      }

      const patch: Partial<ArgoRollout> = { spec: { paused: false } };
      const resourceDescriptor = { name: object.metadata.name, namespace: object.metadata.namespace };
      await api.patch(resourceDescriptor, patch, "merge");
    };

    const handlePause = async () => {
      if (!api) {
        console.error("API is not defined in props.");
        return;
      }

      const patch: Partial<ArgoRollout> = { spec: { paused: true } };
      const resourceDescriptor = { name: object.metadata.name, namespace: object.metadata.namespace };
      await api.patch(resourceDescriptor, patch, "merge");
    };

    const handleRetry = async () => {
      if (!api) {
        console.error("API is not defined in props.");
        return;
      }

      const patch: Partial<ArgoRollout> = { status: { abort: false } };
      const resourceDescriptor = { name: object.metadata.name, namespace: object.metadata.namespace };
      await api.patch(resourceDescriptor, patch, "merge");
    };

    const handleRestart = async () => {
      if (!api) {
        console.error("API is not defined in props.");
        return;
      }

      const restartAt = new Date().toISOString();
      const patch: Partial<ArgoRollout> = { spec: { restartAt } };
      const resourceDescriptor = { name: object.metadata.name, namespace: object.metadata.namespace };
      await api.patch(resourceDescriptor, patch, "merge");
    };

    const actions: JSX.Element[] = [
      <MenuItem onClick={handleAbort} key="abort" icon={{ material: "cancel" }} disabled={!(phase === "Progressing" || phase === "Paused")}>
        <span className="title">Abort</span>
      </MenuItem>,
      <MenuItem onClick={handlePromote} key="promote" icon={{ material: "keyboard_arrow_up" }} disabled={!(phase === "Progressing" || phase === "Paused")}>
        <span className="title">Promote</span>
      </MenuItem>,
      <MenuItem onClick={handlePromoteFull} key="promote-full" icon={{ material: "keyboard_double_arrow_up" }} disabled={!(phase === "Progressing" || phase === "Paused")}>
        <span className="title">Promote Full</span>
      </MenuItem>,
      <MenuItem onClick={handleResume} key="resume" icon={{ material: "play_arrow" }} disabled={!(phase === "Paused")}>
        <span className="title">Resume</span>
      </MenuItem>,
      <MenuItem onClick={handlePause} key="pause" icon={{ material: "pause" }} disabled={!(phase === "Progressing")}>
        <span className="title">Pause</span>
      </MenuItem>,
      <MenuItem onClick={handleRetry} key="retry" icon={{ material: "refresh" }} disabled={!(phase === "Degraded")}>
        <span className="title">Retry</span>
      </MenuItem>,
      <MenuItem onClick={handleRestart} key="restart" icon={{ material: "restart_alt" }} disabled={!(phase === "Healthy")}>
        <span className="title">Restart</span>
      </MenuItem>,
    ];

    return <>{actions}</>;
  });
