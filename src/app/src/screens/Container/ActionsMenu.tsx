import { useCallback, useState } from "react";
import { AnchorButton, ButtonGroup, MenuItem, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { useTranslation } from "react-i18next";
import * as ReactIcon from "@mdi/react";
import { mdiConsole, mdiOpenInApp } from "@mdi/js";

// project
import { ConfirmMenu } from "../../components/ConfirmMenu";
import { Notification } from "../../Notification";
import { Container, ContainerStateList } from "../../Types";
import { goToScreen } from "../../Navigator";

import { useStoreActions } from "../../domain/types";
import { getContainerUrl, getContainerServiceUrl } from "./Navigation";

// Actions menu
interface ActionsMenuProps {
  container: Container;
  expand?: boolean;
  isActive?: (screen: string) => boolean;
}

interface PerformActionOptions {
  confirm?: {
    success?: boolean;
    error?: boolean;
  };
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({ container, expand, isActive }) => {
  const { t } = useTranslation();
  const [disabledAction, setDisabledAction] = useState<string | undefined>();
  const containerFetch = useStoreActions((actions) => actions.container.containerFetch);
  const containerPause = useStoreActions((actions) => actions.container.containerPause);
  const containerUnpause = useStoreActions((actions) => actions.container.containerUnpause);
  const containerStop = useStoreActions((actions) => actions.container.containerStop);
  const containerRestart = useStoreActions((actions) => actions.container.containerRestart);
  const containerRemove = useStoreActions((actions) => actions.container.containerRemove);
  const containerConnect = useStoreActions((actions) => actions.container.containerConnect);
  const performActionCommand = useCallback(
    async (action: string, { confirm }: PerformActionOptions = { confirm: { success: true, error: true } }) => {
      let result = { success: false, message: `No action handler for ${action}` };
      setDisabledAction(action);
      try {
        switch (action) {
          case "container.logs":
            result = await containerFetch(container);
            break;
          case "container.inspect":
            result = await containerFetch(container);
            break;
          case "container.stats":
            result = await containerFetch(container);
            break;
          case "container.stop":
            result = await containerStop(container);
            break;
          case "container.pause":
            result = await containerPause(container);
            break;
          case "container.unpause":
            result = await containerUnpause(container);
            break;
          case "container.restart":
            result = await containerRestart(container);
            break;
          case "container.remove":
            result = await containerRemove(container);
            break;
          case "container.connect":
            result = await containerConnect(container);
            break;
          default:
            break;
        }
        if (confirm?.success) {
          Notification.show({ message: t("Command completed"), intent: Intent.SUCCESS });
        }
        if (action === "container.remove") {
          goToScreen("/screens/containers");
        }
      } catch (error: any) {
        console.error("Command execution failed", error);
        Notification.show({
          message: t("Command did not execute properly - {{message}} {{data}}", {
            message: error.message,
            data: error.data
          }),
          intent: Intent.DANGER
        });
      }
      setDisabledAction(undefined);
    },
    [container, containerFetch, containerPause, containerUnpause, containerStop, containerRestart, containerRemove, containerConnect, t]
  );
  const onRemove = useCallback(
    (tag, confirmed) => {
      if (confirmed) {
        performActionCommand("container.remove");
      }
    },
    [performActionCommand]
  );
  const onActionClick = useCallback(
    async (e) => {
      const sender = e.currentTarget;
      const action = sender.getAttribute("data-action");
      performActionCommand(action);
    },
    [performActionCommand]
  );
  const onOpenTerminalConsole = useCallback(async () => {
    performActionCommand("container.connect", { confirm: { success: false } });
  }, [performActionCommand]);

  const expandAsButtons = expand ? (
    <>
      <AnchorButton
        minimal
        active={isActive ? isActive("container.logs") : false}
        icon={IconNames.ALIGN_JUSTIFY}
        text={t("Logs")}
        href={getContainerUrl(container.Id, "logs")}
      />
      <AnchorButton
        minimal
        active={isActive ? isActive("container.inspect") : false}
        icon={IconNames.EYE_OPEN}
        text={t("Inspect")}
        href={getContainerUrl(container.Id, "inspect")}
      />
      <AnchorButton
        minimal
        active={isActive ? isActive("container.stats") : false}
        icon={IconNames.CHART}
        text={t("Stats")}
        href={getContainerUrl(container.Id, "stats")}
      />
    </>
  ) : undefined;
  const expandAsMenuItems = expand ? undefined : (
    <>
      <MenuItem icon={IconNames.ALIGN_JUSTIFY} text={t("Logs")} href={getContainerUrl(container.Id, "logs")} />
      <MenuItem icon={IconNames.EYE_OPEN} text={t("Inspect")} href={getContainerUrl(container.Id, "inspect")} />
      <MenuItem icon={IconNames.CHART} text={t("Stats")} href={getContainerUrl(container.Id, "stats")} />
    </>
  );

  const containerServiceUrl = getContainerServiceUrl(container);
  const isRunning = container.DecodedState === ContainerStateList.RUNNING;
  const isPaused = container.DecodedState === ContainerStateList.PAUSED;
  const isStopped = container.DecodedState === ContainerStateList.STOPPED;
  // TODO: State machine - manage transitional states
  const canPauseUnpause = isRunning;
  const canStop = isRunning && !isStopped;
  const canRestart = !isPaused;

  return (
    <ButtonGroup>
      {expandAsButtons}
      <ConfirmMenu onConfirm={onRemove} tag={container.Id} disabled={disabledAction === "container.remove"}>
        {expandAsMenuItems}
        <MenuItem
          data-container={container.Id}
          disabled={!isRunning}
          icon={<ReactIcon.Icon path={mdiOpenInApp} size={0.75} />}
          href={containerServiceUrl}
          target="_blank"
          text={t("Open in browser")}
          title={containerServiceUrl}
        />
        <MenuItem
          data-container={container.Id}
          data-action="container.connect"
          disabled={!isRunning}
          icon={<ReactIcon.Icon path={mdiConsole} size={0.75} />}
          text={t("Open terminal console")}
          onClick={onOpenTerminalConsole}
        />
        <MenuItem
          data-container={container.Id}
          data-action={isPaused ? "container.unpause" : "container.pause"}
          disabled={!canPauseUnpause}
          icon={IconNames.PAUSE}
          text={isPaused ? t("Resume") : t("Pause")}
          onClick={onActionClick}
        />
        <MenuItem
          data-container={container.Id}
          data-action="container.stop"
          disabled={!canStop}
          icon={IconNames.STOP}
          text={t("Stop")}
          onClick={onActionClick}
        />
        <MenuItem
          data-container={container.Id}
          data-action="container.restart"
          disabled={!canRestart}
          icon={IconNames.RESET}
          text={t("Restart")}
          onClick={onActionClick}
        />
      </ConfirmMenu>
    </ButtonGroup>
  );
};
