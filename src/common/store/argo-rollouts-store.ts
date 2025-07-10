import { Common } from "@freelensapp/extensions";
import { makeObservable, observable, toJS } from "mobx";

export interface ArgoRolloutsPreferencesModel {
  dashboardUrls: string;
}

export class ArgoRolloutsPreferencesStore extends Common.Store.ExtensionStore<ArgoRolloutsPreferencesModel> {
  setDashboardUrl(clusterId: string, value: string) {
    let dashboardUrls = JSON.parse(this.dashboardUrls);
    dashboardUrls[clusterId] = value;
    this.dashboardUrls = JSON.stringify(dashboardUrls);
  }
  getDashboardUrl(clusterId: string): string {
    const dashboardUrls = JSON.parse(this.dashboardUrls);
    return dashboardUrls[clusterId] || "";
  }
  // Persistent
  @observable accessor dashboardUrls: string = "{}";

  constructor() {
    super({
      configName: "argo-rollouts-preferences-store",
      defaults: {
        dashboardUrls: "{}",
      },
    });
    makeObservable(this);
  }

  fromStore = (model: ArgoRolloutsPreferencesModel): void => {
    this.dashboardUrls = model.dashboardUrls;
  };
  
  toJSON = (): ArgoRolloutsPreferencesModel => {
    const value: ArgoRolloutsPreferencesModel = {
      dashboardUrls: this.dashboardUrls,
    };
    return toJS(value);
  };
}
