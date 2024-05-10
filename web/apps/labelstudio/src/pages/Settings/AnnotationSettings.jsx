import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button } from "../../components";
import { Form, TextArea, Toggle } from "../../components/Form";
import { MenubarContext } from "../../components/Menubar/Menubar";
import { Block, Elem } from "../../utils/bem";

import { ModelVersionSelector } from "./AnnotationSettings/ModelVersionSelector";
import { ProjectContext } from "../../providers/ProjectProvider";
import { Divider } from "../../components/Divider/Divider";

export const AnnotationSettings = () => {
  const { project, fetchProject } = useContext(ProjectContext);
  const pageContext = useContext(MenubarContext);
  const formRef = useRef();
  const [collab, setCollab] = useState(null);

  useEffect(() => {
    pageContext.setProps({ formRef });
  }, [formRef]);

  const updateProject = useCallback(() => {
    fetchProject(project.id, true);
  }, [project]);

  return (
    <Block name="annotation-settings">
      <Elem name={"wrapper"}>
        <Form
          ref={formRef}
          action="updateProject"
          formData={{ ...project }}
          params={{ pk: project.id }}
          onSubmit={updateProject}
        >
          <Form.Row columnCount={1}>
            <Elem name={"header"}>打标签说明</Elem>
            <div>
              <Toggle label="在打标签之前显示" name="show_instruction" />
            </div>
            <div style={{ color: "rgba(0,0,0,0.4)" }}>
              <p>在下方添加打标签教程文档</p>
              <p>文档支持HTML语法，支持图片和iframe(pdf)</p>
            </div>
          </Form.Row>

          <Form.Row columnCount={1}>
            <TextArea name="expert_instruction" style={{ minHeight: 128, maxWidth: "520px" }} />
          </Form.Row>

          <Divider height={32} />

          <Form.Row columnCount={1} style={{ borderTop: "1px solid #f1f1f1" }}>
            <br />
            <Elem name={"header"}>预标记</Elem>
            <div>
              <Toggle
                label="使用预测算法进行预标记"
                description={<span>开启并选择预测算法进行预标记.</span>}
                name="show_collab_predictions"
                onChange={(e) => {
                  setCollab(e.target.checked);
                }}
              />
            </div>

            {(collab !== null ? collab : project.show_collab_predictions) && <ModelVersionSelector />}
          </Form.Row>

          <Form.Actions>
            <Form.Indicator>
              <span case="success">保存成功!</span>
            </Form.Indicator>
            <Button type="submit" look="primary" style={{ width: 120 }}>
              保存
            </Button>
          </Form.Actions>
        </Form>
      </Elem>
    </Block>
  );
};

AnnotationSettings.title = "标注";
AnnotationSettings.path = "/annotation";
