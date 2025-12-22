import React, { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Table, Button, Space, Tag, Modal, Toast } from '@douyinfe/semi-ui';
import { IconEdit, IconDelete, IconPlus } from '@douyinfe/semi-icons';
import request from '@/utils/request';

export const Route = createFileRoute('/_app/content/list/')({
    component: ContentList,
});

interface Article {
    id: string;
    title: string;
    category: string;
    status: 'draft' | 'published';
    created_at: string;
}

function ContentList() {
    const navigate = useNavigate();
    const [data, setData] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const list = await request.get('/article');
            setData(list as any);
        } catch (error) {
            // Error handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (id: string) => {
        navigate({ to: `/content/edit/${id}` });
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这篇文章吗？',
            onOk: async () => {
                try {
                    await request.delete(`/article/${id}`);
                    Toast.success('删除成功');
                    fetchData();
                } catch (error) {
                    // Error handled by interceptor
                }
            }
        });
    };

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (text: string) => text ? <Tag color="blue">{text}</Tag> : '-'
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (status: string) => (
                <Tag color={status === 'published' ? 'green' : 'orange'}>
                    {status === 'published' ? '已发布' : '草稿'}
                </Tag>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            render: (text: string) => new Date(text).toLocaleDateString()
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (_: any, record: Article) => (
                <Space>
                    <Button icon={<IconEdit />} theme="borderless" onClick={() => handleEdit(record.id)} />
                    <Button icon={<IconDelete />} theme="borderless" type="danger" onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24, background: 'var(--semi-color-bg-0)' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0 }}>内容列表</h2>
                <Button icon={<IconPlus />} theme="solid" type="primary" onClick={() => navigate({ to: '/content/create' })}>
                    新建文章
                </Button>
            </div>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} loading={loading} />
        </div>
    );
}
