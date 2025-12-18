import React, { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { Form, Button, Typography, Toast } from '@douyinfe/semi-ui';
import styles from './index.module.less';

export const Route = createFileRoute('/login/')({
  component: LoginComponent,
});

function LoginComponent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '登录失败');
            }

            // 存储 Token (实际项目中可能需要更安全的存储方式或配合 Context)
            localStorage.setItem('access_token', data.session?.access_token);
            
            Toast.success('登录成功');
            navigate({ to: '/' });
        } catch (error: any) {
            Toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <Typography.Title heading={2} className={styles.title}>
                    Admin Login
                </Typography.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Input
                        field="email"
                        label="邮箱"
                        placeholder="请输入邮箱"
                        rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}
                    />
                    <Form.Input
                        field="password"
                        label="密码"
                        mode="password"
                        placeholder="请输入密码"
                        rules={[{ required: true, message: '请输入密码' }]}
                    />
                    <Button
                        htmlType="submit"
                        theme="solid"
                        type="primary"
                        block
                        loading={loading}
                        style={{ marginTop: 16 }}
                    >
                        登录
                    </Button>
                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        没有账号？ <Link to="/register">立即注册</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}
