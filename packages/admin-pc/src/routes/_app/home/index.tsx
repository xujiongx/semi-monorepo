import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb, Lottie, Skeleton } from "@douyinfe/semi-ui";
import styles from "./index.module.less";

export const Route = createFileRoute("/_app/home/")({
  component: HomeComponent,
});

function HomeComponent() {
  const jsonURL =
    "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/lottie_demo.json";

  return (
    <>
      <Breadcrumb className={styles.breadcrumb} routes={["概览"]} />
      <div className={styles.container}>
        <Lottie params={{ path: jsonURL }} width={"300px"} height={"300"} />
      </div>
    </>
  );
}
