import React, { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Form, Button, Typography, Toast } from "@douyinfe/semi-ui";
import styles from "./index.module.less";
import { SITE_CONFIG } from "@/config/site";
import { IconLock, IconMail, IconSemiLogo } from "@douyinfe/semi-icons";
import request from "@/utils/request";

export const Route = createFileRoute("/login/")({
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data: any = await request.post("/auth/login", values);

      // 存储 Token (实际项目中可能需要更安全的存储方式或配合 Context)
      localStorage.setItem("access_token", data.session?.access_token);

      Toast.success("登录成功");
      navigate({ to: "/" });
    } catch (error: any) {
      // Interceptor handles error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <IconSemiLogo style={{ fontSize: 48 }} />
          <Typography.Title heading={3} className={styles.title}>
            {SITE_CONFIG.title} 登录
          </Typography.Title>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            field="email"
            label="邮箱"
            labelPosition="left"
            placeholder="请输入邮箱"
            prefix={<IconMail style={{ margin: "0 4px" }} />}
            size="large"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          />
          <Form.Input
            field="password"
            label="密码"
            labelPosition="left"
            mode="password"
            placeholder="请输入密码"
            prefix={<IconLock style={{ margin: "0 4px" }} />}
            size="large"
            rules={[{ required: true, message: "请输入密码" }]}
          />
          <Button
            htmlType="submit"
            theme="solid"
            type="primary"
            block
            size="large"
            loading={loading}
            style={{ marginTop: 8 }}
          >
            登录
          </Button>
          <div className={styles.footer}>
            没有账号？ <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
