import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./index.module.less";

export const Route = createFileRoute("/_app/settings/")({
  component: SettingsComponent,
});

function SettingsComponent() {
  return (
    <>
      <div>设置</div>
    </>
  );
}
