import type React from "react";
import { type FC, type MouseEvent, useEffect, useState } from "react";
import { Block, Elem } from "../../../utils/bem";

import "./ConfigControl.styl";
import { IconConfig } from "../../../assets/icons/timeline";
import { ControlButton } from "../Controls";
import { Slider } from "./Slider";

const MAX_SPEED = 2.5;
const MAX_ZOOM = 150;
const MIN_SPEED = 0.5;
const MIN_ZOOM = 1;

export interface ConfigControlProps {
  configModal: boolean;
  speed: number;
  amp: number;
  onSetModal?: (e: MouseEvent<HTMLButtonElement>) => void;
  onSpeedChange: (speed: number) => void;
  onAmpChange: (amp: number) => void;
  toggleVisibility?: (layerName: string, isVisible: boolean) => void;
  layerVisibility?: Map<string, boolean>;
}

export const ConfigControl: FC<ConfigControlProps> = ({
  configModal,
  speed,
  amp,
  onSpeedChange,
  onSetModal,
  onAmpChange,
  toggleVisibility,
  layerVisibility,
}) => {
  const playbackSpeed = speed ?? 1;
  const [isTimeline, setTimeline] = useState(true);
  const [isAudioWave, setAudioWave] = useState(true);

  useEffect(() => {
    if (layerVisibility) {
      const defaultDisplay = true;

      setTimeline(layerVisibility?.get?.("timeline") ?? defaultDisplay);
      setAudioWave(layerVisibility?.get?.("waveform") ?? defaultDisplay);
    }
  }, [layerVisibility]);

  const handleSetTimeline = () => {
    setTimeline(!isTimeline);
    toggleVisibility?.("timeline", !isTimeline);
  };

  const handleSetAudioWave = () => {
    setAudioWave(!isAudioWave);
    toggleVisibility?.("waveform", !isAudioWave);
    toggleVisibility?.("regions", !isAudioWave);
  };

  const handleChangePlaybackSpeed = (e: React.FormEvent<HTMLInputElement>) => {
    const _playbackSpeed = Number.parseFloat(e.currentTarget.value);

    if (isNaN(_playbackSpeed)) return;

    onSpeedChange(_playbackSpeed);
  };

  const handleChangeAmp = (e: React.FormEvent<HTMLInputElement>) => {
    const _amp = Number.parseFloat(e.currentTarget.value);

    onAmpChange(_amp);
  };

  const renderLayerToggles = () => {
    return (
      <Elem name={"buttons"}>
        <Elem name="menu-button" onClick={handleSetTimeline}>
          {isTimeline ? "隐藏" : "显示"} 时间线
        </Elem>
        <Elem name="menu-button" onClick={handleSetAudioWave}>
          {isAudioWave ? "隐藏" : "显示"} 音频波形
        </Elem>
      </Elem>
    );
  };

  const renderModal = () => {
    return (
      <Elem name="modal">
        <Slider
          min={MIN_SPEED}
          max={MAX_SPEED}
          step={0.1}
          value={playbackSpeed}
          description={"播放速度"}
          info={"拖动滑块加快/降低播放速度"}
          onChange={handleChangePlaybackSpeed}
        />
        <Slider
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.1}
          value={amp}
          description={"音频Y轴缩放"}
          info={"增加/减少音频的波幅显示"}
          onChange={handleChangeAmp}
        />
        {renderLayerToggles()}
      </Elem>
    );
  };

  return (
    <Block name="audio-config" onClick={(e: MouseEvent<HTMLButtonElement>) => e.stopPropagation()}>
      <ControlButton look={configModal ? "active" : undefined} onClick={onSetModal}>
        {<IconConfig />}
      </ControlButton>
      {configModal && renderModal()}
    </Block>
  );
};
