import { Common } from "@freelensapp/extensions";
import { makeObservable, observable, toJS } from "mobx";

export interface ArgoRolloutsPreferencesModel {
  dashboardUrl: string;
}

export class ArgoRolloutsPreferencesStore extends Common.Store.ExtensionStore<ArgoRolloutsPreferencesModel> {
  // Persistent
  @observable accessor dashboardUrl: string = "";

  constructor() {
    super({
      configName: "argo-rollouts-preferences-store",
      defaults: {
        dashboardUrl: "",
      },
    });
    console.log("[ARGO-ROLLOUTS-PREFERENCES-STORE] constructor");
    makeObservable(this);
  }

  fromStore = ({ dashboardUrl }: ArgoRolloutsPreferencesModel): void => {
    console.log(`[ARGO-ROLLOUTS-PREFERENCES-STORE] set ${dashboardUrl}`);

    this.dashboardUrl = dashboardUrl;
  };

  toJSON = (): ArgoRolloutsPreferencesModel => {
    const value: ArgoRolloutsPreferencesModel = {
      dashboardUrl: this.dashboardUrl,
    };
    console.log(`[ARGO-ROLLOUTS-PREFERENCES-STORE] get ${value.dashboardUrl}`);
    return toJS(value);
  };
}
