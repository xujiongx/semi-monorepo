import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./index.module.less";

export const Route = createFileRoute("/_app/live/")({
  component: LiveComponent,
});

function LiveComponent() {
  return (
    <>
      <div>测试功能</div>
    </>
  );
}
