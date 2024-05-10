import React from "react";
import { Columns } from "../../../components/Columns/Columns";
import { Description } from "../../../components/Description/Description";
import { Block, cn } from "../../../utils/bem";
import { StorageSet } from "./StorageSet";
import "./StorageSettings.styl";
import { isInLicense, LF_CLOUD_STORAGE_FOR_MANAGERS } from "../../../utils/license-flags";

const isAllowCloudStorage = !isInLicense(LF_CLOUD_STORAGE_FOR_MANAGERS);

export const StorageSettings = () => {
  const rootClass = cn("storage-settings");

  return isAllowCloudStorage ? (
    <Block name="storage-settings">
      <Description style={{ marginTop: 0 }}>
        设置文件存储
      </Description>

      <Columns count={2} gap="40px" size="320px" className={rootClass}>
        <StorageSet title="源文件存储" buttonLabel="新增" rootClass={rootClass} />

        <StorageSet
          title="目标文件存储"
          target="export"
          buttonLabel="新增"
          rootClass={rootClass}
        />
      </Columns>
    </Block>
  ) : null;
};

StorageSettings.title = "云存储";
StorageSettings.path = "/storage";
