import { Renderer } from "@freelensapp/extensions";
import { ExtensionKubeObject } from "../types";

export interface ArgoRolloutSpec {
  replicas?: number;
  selector?: {
    matchLabels: Record<string, string>;
  };
  paused?: boolean; // Added field
  restartAt?: string; // Added field
  strategy?: {
    blueGreen?: string;
    canary?: string;
  };
}

export type ArgoRolloutStatus = {
  readyReplicas?: number;
  currentPodHash?: string;
  observedGeneration?: number;
  phase?: string;
  stableRS?: string;
  abort?: boolean; // Added field
  promoteFull?: boolean; // Added field
};

export class ArgoRollout extends ExtensionKubeObject<
  Renderer.K8sApi.KubeObjectMetadata,
  ArgoRolloutStatus,
  ArgoRolloutSpec
> {
  static readonly kind = "Rollout";
  static readonly namespaced = true;
  static readonly apiBase = "/apis/argoproj.io/v1alpha1";

  static readonly crd = {
    apiVersions: ["argoproj.io/v1alpha1"],
    plural: "rollouts",
    singular: "rollout",
    shortNames: ["ro"],
    title: "Rollouts",
  };
}

export class ArgoRolloutApi extends Renderer.K8sApi.KubeApi<ArgoRollout> {}
export class ArgoRolloutStore extends Renderer.K8sApi.KubeObjectStore<ArgoRollout, ArgoRolloutApi> {}
