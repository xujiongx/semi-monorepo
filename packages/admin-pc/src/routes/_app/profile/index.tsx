import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Tabs, TabPane, Form, Button, Toast, Table, Avatar, Tag, Card, Row, Col } from '@douyinfe/semi-ui';
import { IconUser, IconLock, IconHistory } from '@douyinfe/semi-icons';
import request from '@/utils/request';

export const Route = createFileRoute('/_app/profile/')({
  component: ProfilePage,
});

function ProfilePage() {
    const [activeKey, setActiveKey] = useState('1');
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>({});
    const [logs, setLogs] = useState<any[]>([]);
    const [logsLoading, setLogsLoading] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await request.get('/user/profile');
            setProfile(data);
        } catch (error) {
            // Interceptor handles error
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        setLogsLoading(true);
        try {
            const data = await request.get('/user/logs');
            setLogs(data as any[]);
        } catch (error) {
            // Interceptor handles error
        } finally {
            setLogsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (activeKey === '3') {
            fetchLogs();
        }
    }, [activeKey]);

    const handleUpdateProfile = async (values: any) => {
        try {
            await request.patch('/user/profile', values);
            Toast.success('更新成功');
            fetchProfile();
        } catch (error) {
            // Interceptor handles error
        }
    };

    const handleChangePassword = async (values: any) => {
        if (values.password !== values.confirmPassword) {
            Toast.error('两次输入的密码不一致');
            return;
        }
        try {
            await request.post('/user/change-password', { password: values.password });
            Toast.success('密码修改成功');
        } catch (error) {
            // Interceptor handles error
        }
    };

    const logColumns = [
        { title: '时间', dataIndex: 'login_at', render: (text: string) => new Date(text).toLocaleString() },
        { title: 'IP 地址', dataIndex: 'ip_address', render: (text: string) => text || '未知' },
        { title: '设备', dataIndex: 'device', render: (text: string) => text || '未知' },
    ];

    return (
        <div style={{ padding: 24, background: 'var(--semi-color-bg-0)' }}>
            <h2 style={{ marginBottom: 24 }}>个人中心</h2>
            <Tabs type="line" activeKey={activeKey} onChange={setActiveKey}>
                <TabPane tab={<span><IconUser />基本信息</span>} itemKey="1">
                    <Row>
                        <Col span={12}>
                            <Card style={{ marginTop: 16 }} loading={loading}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                                    <Avatar 
                                        size="large" 
                                        src={profile.avatar_url} 
                                        color="orange" 
                                        style={{ marginRight: 16 }}
                                    >
                                        {profile.nickname?.[0] || profile.email?.[0]}
                                    </Avatar>
                                    <div>
                                        <div style={{ fontSize: 18, fontWeight: 'bold' }}>{profile.nickname || '未设置昵称'}</div>
                                        <div style={{ color: 'var(--semi-color-text-2)' }}>{profile.email}</div>
                                    </div>
                                </div>
                                <Form initValues={profile} onSubmit={handleUpdateProfile} labelPosition="left" labelWidth={100}>
                                    <Form.Input field="nickname" label="昵称" style={{ width: 300 }} />
                                    <Form.Input field="avatar_url" label="头像 URL" style={{ width: 300 }} />
                                    <Form.Select field="gender" label="性别" style={{ width: 300 }}>
                                        <Form.Select.Option value="male">男</Form.Select.Option>
                                        <Form.Select.Option value="female">女</Form.Select.Option>
                                        <Form.Select.Option value="other">其他</Form.Select.Option>
                                    </Form.Select>
                                    <Form.Input field="phone" label="联系方式" style={{ width: 300 }} />
                                    <Form.TextArea field="bio" label="个人简介" style={{ width: 300 }} />
                                    <Button type="primary" htmlType="submit" style={{ marginLeft: 100, marginTop: 16 }}>保存修改</Button>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab={<span><IconLock />账号安全</span>} itemKey="2">
                    <Row>
                        <Col span={12}>
                            <Card style={{ marginTop: 16 }}>
                                <Form onSubmit={handleChangePassword} labelPosition="left" labelWidth={100}>
                                    <Form.Input 
                                        field="password" 
                                        label="新密码" 
                                        mode="password" 
                                        style={{ width: 300 }} 
                                        rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码长度不能少于6位' }]}
                                    />
                                    <Form.Input 
                                        field="confirmPassword" 
                                        label="确认密码" 
                                        mode="password" 
                                        style={{ width: 300 }}
                                        rules={[{ required: true, message: '请确认新密码' }]}
                                    />
                                    <Button type="primary" htmlType="submit" style={{ marginLeft: 100, marginTop: 16 }}>修改密码</Button>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab={<span><IconHistory />登录日志</span>} itemKey="3">
                    <Card style={{ marginTop: 16 }}>
                        <Table 
                            columns={logColumns} 
                            dataSource={logs} 
                            loading={logsLoading} 
                            pagination={{ pageSize: 10 }}
                            empty="暂无登录记录"
                        />
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
}
