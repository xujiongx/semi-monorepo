import React, { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { IconSemiLogo, IconMail, IconLock } from '@douyinfe/semi-icons';
import { Form, Button, Typography, Toast } from '@douyinfe/semi-ui';
import styles from './index.module.less';
import { SITE_CONFIG } from '@/config/site';
import request from '@/utils/request';

export const Route = createFileRoute('/register/')({
  component: RegisterComponent,
});

function RegisterComponent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await request.post('/auth/register', values);
            Toast.success('注册成功，请登录');
            navigate({ to: '/login' });
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
                        {SITE_CONFIG.title} 注册
                    </Typography.Title>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Input
                        field="email"
                        label="邮箱"
                        labelPosition="left"
                        placeholder="请输入邮箱"
                        prefix={<IconMail style={{ margin: '0 4px' }} />}
                        size="large"
                        rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}
                    />
                    <Form.Input
                        field="password"
                        label="密码"
                        labelPosition="left"
                        mode="password"
                        placeholder="请输入密码"
                        prefix={<IconLock style={{ margin: '0 4px' }} />}
                        size="large"
                        rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}
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
                        注册
                    </Button>
                    <div className={styles.footer}>
                        已有账号？ <Link to="/login">立即登录</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}
