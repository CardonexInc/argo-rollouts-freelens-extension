import { Renderer } from "@freelensapp/extensions";
import { observer } from "mobx-react";
import { ArgoRolloutsPreferencesStore } from "../../common/store";

const {
  Component: { Input, InputValidators, SubTitle },
} = Renderer;

export const ArgoRolloutsSettings = observer(() => {
  const preferences: ArgoRolloutsPreferencesStore =
    ArgoRolloutsPreferencesStore.getInstanceOrCreate<ArgoRolloutsPreferencesStore>();
  const clusterId = window.location.pathname.split("/")[2];
  return (
    <section>
      <SubTitle title="Argo Rollouts Dashboard URL" />
      <Input
        value={preferences.getDashboardUrl(clusterId)}
        onChange={(value: string) => {preferences.setDashboardUrl(clusterId, value);}}
        placeholder="http(s)://<address>"
        validators={preferences.getDashboardUrl(clusterId) ? InputValidators.isUrl : undefined}
      />
      <small className="hint">Specify the base URL for the Argo Rollouts Dashboard.</small>
    </section>
  );
});
