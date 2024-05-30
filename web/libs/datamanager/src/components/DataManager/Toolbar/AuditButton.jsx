import { inject } from "mobx-react";
import { Button } from "../../Common/Button/Button";


const injector = inject(({ store }) => {
  return {
    store,
    needsDataFetch: store.needsDataFetch,
    projectFetch: store.projectFetch,
  };
});

export const AuditButton = injector(({ store, needsDataFetch, projectFetch, size, style, ...rest }) => {
  return (
    <Button
      size={size}
      look="danger"
      onClick={async () => {
        await store.auditProject(1);
      }}
      style={{
        ...(style ?? {}),
      }}
      {...rest}
    >
      审核完成
    </Button>
  );
});
