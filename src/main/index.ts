import { Main } from "@freelensapp/extensions";
import { ArgoRolloutsPreferencesStore } from "../common/store";

export default class ArgoRolloutsMain extends Main.LensExtension {
  async onActivate() {
    await ArgoRolloutsPreferencesStore.getInstanceOrCreate().loadExtension(this);
  }
}
