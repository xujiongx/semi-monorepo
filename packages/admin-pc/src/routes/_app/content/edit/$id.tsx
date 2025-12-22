import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Form, Button, Toast } from "@douyinfe/semi-ui";
import MDEditor from "@uiw/react-md-editor";
import request from "@/utils/request";

export const Route = createFileRoute("/_app/content/edit/$id")({
    component: ContentEditor,
});

function ContentEditor() {
    const { id } = Route.useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [initValues, setInitValues] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        // Fetch categories
        request.get('/category')
            .then(data => setCategories(data as any[]))
            .catch(() => {
                // Error handled by interceptor
            });

        if (id) {
            request.get(`/article/${id}`)
                .then((data: any) => {
                    setInitValues(data);
                    setContent(data.content);
                })
                .catch(() => {
                    // Error handled by interceptor
                });
        }
    }, [id]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await request.patch(`/article/${id}`, { ...values, content });
            Toast.success('更新成功');
            navigate({ to: '/content/list' });
        } catch (error) {
            // Error handled by interceptor
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
