import { Renderer } from "@freelensapp/extensions";
import { observer } from "mobx-react";
import { ArgoRolloutsPreferencesStore } from "../../common/store";

const {
  Component: { Input, InputValidators, SubTitle },
} = Renderer;

export const ArgoRolloutsSettings = observer(() => {
  const preferences: ArgoRolloutsPreferencesStore =
    ArgoRolloutsPreferencesStore.getInstanceOrCreate<ArgoRolloutsPreferencesStore>();
  return (
    <section>
      <SubTitle title="Argo Rollouts Dashboard URL" />
      <Input
        value={preferences.dashboardUrl}
        onChange={(value: string) => (preferences.dashboardUrl = value)}
        placeholder="http(s)://<address>"
        validators={preferences.dashboardUrl ? InputValidators.isUrl : undefined}
      />
      <small className="hint">Specify the URL for the Argo Rollouts Dashboard.</small>
    </section>
  );
});
