import {useCallback, useContext, useRef, useState} from "react";
import { useHistory } from "react-router";
import { Button } from "../../components";
import { Modal } from "../../components/Modal/Modal";
import { Space } from "../../components/Space/Space";
import { useAPI } from "../../providers/ApiProvider";
import { ProjectProvider, useProject } from "../../providers/ProjectProvider";
import { useFixedLocation } from "../../providers/RoutesProvider";
import { Elem } from "../../utils/bem";
import { useRefresh } from "../../utils/hooks";
import { useAuditPage } from "./useAuditPage";
import { ToastContext } from "../../components/Toast/Toast";

export const Inner = () => {
  const toast = useContext(ToastContext);
  const history = useHistory();
  const location = useFixedLocation();
  const modal = useRef();
  const refresh = useRefresh();
  const { project } = useProject();
  const [waiting, setWaitingStatus] = useState(false);
  const api = useAPI();

  const { finishAudit, fileIds, pageProps } = useAuditPage(project);

  const backToDM = useCallback(() => {
    const path = location.pathname.replace(AuditModal.path, "");
    const search = location.search;
    const pathname = `${path}${search !== "?" ? search : ""}`;

    return refresh(pathname);
  }, [location, history]);

  const onCancel = useCallback(async () => {
    modal?.current?.hide();
    // backToDM();
  }, [modal, project, fileIds, backToDM]);

  const onFinish = useCallback(async () => {
    const imported = await finishAudit();
    toast.show({ message: "审核成功！", type: "info" });
    if (!imported) return;
    backToDM();
  }, [backToDM, finishAudit]);

  return (
    <Modal
      title="审核确认"
      ref={modal}
      onHide={() => backToDM()}
      closeOnClickOutside={false}
      style={{ width: "30vw" }}
      visible
      bare
    >
      <Modal.Header divided>
        <Elem block="modal" name="title">
          是否确认审核完成？
        </Elem>

        <Space>
          <Button waiting={waiting} onClick={onCancel}>
            取消
          </Button>
          <Button look="primary" onClick={onFinish} waiting={waiting}>
            确认
          </Button>
        </Space>
      </Modal.Header>
      {/*<div>*/}
      {/*  请确认是否审核完成？*/}
      {/*</div>*/}
    </Modal>
  );
};
export const AuditModal = () => {
  return (
    <ProjectProvider>
      <Inner />
    </ProjectProvider>
  );
};

AuditModal.path = "/audit";
AuditModal.modal = true;
