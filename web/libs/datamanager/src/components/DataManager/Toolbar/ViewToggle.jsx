import { inject, observer } from "mobx-react";
import { LsGrid, LsList } from "../../../assets/icons";
import { FF_LOPS_E_10, isFF } from "../../../utils/feature-flags";
import { RadioGroup } from "../../Common/RadioGroup/RadioGroup";
import { Tooltip } from "../../Common/Tooltip/Tooltip";

const viewInjector = inject(({ store }) => ({
  view: store.currentView,
}));

export const ViewToggle = viewInjector(
  observer(({ view, size, ...rest }) => {
    const isDatasetsFF = isFF(FF_LOPS_E_10);

    return (
      <RadioGroup size={size} value={view.type} onChange={(e) => view.setType(e.target.value)} {...rest}>
        <RadioGroup.Button value="list">
          <Tooltip title="列表展示">{isDatasetsFF ? <LsList /> : <span>列表</span>}</Tooltip>
        </RadioGroup.Button>
        <RadioGroup.Button value="grid">
          <Tooltip title="宫格展示">{isDatasetsFF ? <LsGrid /> : <span>宫格</span>}</Tooltip>
        </RadioGroup.Button>
      </RadioGroup>
    );
  }),
);

export const DataStoreToggle = viewInjector(({ view, size, ...rest }) => {
  return (
    <RadioGroup value={view.target} size={size} onChange={(e) => view.setTarget(e.target.value)} {...rest}>
      <RadioGroup.Button value="tasks">Tasks</RadioGroup.Button>
      <RadioGroup.Button value="annotations" disabled>
        Annotations
      </RadioGroup.Button>
    </RadioGroup>
  );
});
