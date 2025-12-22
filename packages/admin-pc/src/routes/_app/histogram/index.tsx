import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./index.module.less";

export const Route = createFileRoute("/_app/histogram/")({
  component: HistogramComponent,
});

function HistogramComponent() {
  return (
    <>
      <div>基础数据</div>
    </>
  );
}
