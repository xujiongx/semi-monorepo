import React, { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Form, Button, Toast, Select } from '@douyinfe/semi-ui';
import MDEditor from '@uiw/react-md-editor';

export const Route = createFileRoute('/_app/content/edit/$id')({
  component: ContentEditor,
});

function ContentEditor() {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [initValues, setInitValues] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const getToken = () => localStorage.getItem('access_token');

    useEffect(() => {
        // Fetch categories
        fetch('/api/category', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then(data => setCategories(data));

        if (id) {
            fetch(`/api/article/${id}`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            })
                .then(res => res.json())
                .then(data => {
                    setInitValues(data);
                    setContent(data.content);
                })
                .catch(() => Toast.error('获取文章详情失败'));
        }
    }, [id]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/article/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}` 
                },
                body: JSON.stringify({ ...values, content }),
            });

            if (!res.ok) throw new Error('Update failed');

            Toast.success('保存成功');
            navigate({ to: '/content/list' });
        } catch (error) {
            Toast.error('保存失败');
        } finally {
            setLoading(false);
        }
    };

    if (!initValues && id) return null;

    return (
        <div style={{ padding: 24, background: 'var(--semi-color-bg-0)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>编辑文章</h2>
            </div>
            
            <Form 
                onSubmit={handleSubmit} 
                initValues={initValues}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
                <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Input 
                        field="title" 
                        label="标题" 
                        style={{ width: 400 }}
                        rules={[{ required: true, message: '请输入标题' }]} 
                    />
                    <Form.Select 
                        field="category_id" 
                        label="分类" 
                        style={{ width: 200 }}
                        rules={[{ required: true, message: '请选择分类' }]}
                    >
                        {categories.map(c => (
                            <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                        ))}
                    </Form.Select>
                    <Form.Select 
                        field="status" 
                        label="状态" 
                        style={{ width: 120 }}
                        initValue="draft"
                    >
                        <Select.Option value="draft">草稿</Select.Option>
                        <Select.Option value="published">发布</Select.Option>
                    </Form.Select>
                </div>

                <div style={{ marginTop: 16, flex: 1, minHeight: 500 }} data-color-mode="light">
                    <MDEditor
                        value={content}
                        onChange={(val) => setContent(val || '')}
                        height="100%"
                        style={{ height: '100%' }}
                    />
                </div>

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <Button onClick={() => navigate({ to: '/content/list' })}>取消</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
                </div>
            </Form>
        </div>
    );
}
