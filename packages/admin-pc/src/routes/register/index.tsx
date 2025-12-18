import React, { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { Form, Button, Typography, Toast } from '@douyinfe/semi-ui';
import styles from './index.module.less';

export const Route = createFileRoute('/register/')({
  component: RegisterComponent,
});

function RegisterComponent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '注册失败');
            }

            Toast.success('注册成功，请登录');
            navigate({ to: '/login' });
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
                    Admin Register
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
                        rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}
                    />
                    <Button
                        htmlType="submit"
                        theme="solid"
                        type="primary"
                        block
                        loading={loading}
                        style={{ marginTop: 16 }}
                    >
                        注册
                    </Button>
                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        已有账号？ <Link to="/login">立即登录</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}
