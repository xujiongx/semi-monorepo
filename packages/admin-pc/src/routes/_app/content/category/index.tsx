import React, { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Table, Button, Space, Modal, Toast, Form } from "@douyinfe/semi-ui";
import { IconEdit, IconDelete, IconPlus } from "@douyinfe/semi-icons";
import request from "@/utils/request";

export const Route = createFileRoute("/_app/content/category/")({
  component: CategoryList,
});

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
}

function CategoryList() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const formApi = useRef<any>();

  const fetchData = async () => {
    setLoading(true);
    try {
      const list = await request.get("/category");
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

  const handleEdit = (record: Category) => {
    setCurrentCategory(record);
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个分类吗？",
      onOk: async () => {
        try {
          await request.delete(`/category/${id}`);
          Toast.success("删除成功");
          fetchData();
        } catch (error) {
          // Error handled by interceptor
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentCategory) {
        // Edit
        await request.patch(`/category/${currentCategory.id}`, values);
      } else {
        // Create
        await request.post("/category", values);
      }

      Toast.success(currentCategory ? "更新成功" : "创建成功");
      setVisible(false);
      setCurrentCategory(null);
      fetchData();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleOk = () => {
    formApi.current?.submitForm();
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
    },
    {
      title: "文章数量",
      dataIndex: "count",
    },
    {
      title: "操作",
      dataIndex: "operate",
      render: (_: any, record: Category) => (
        <Space>
          <Button
            icon={<IconEdit />}
            theme="borderless"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<IconDelete />}
            theme="borderless"
            type="danger"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "var(--semi-color-bg-0)" }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>分类管理</h2>
        <Button
          icon={<IconPlus />}
          theme="solid"
          type="primary"
          onClick={() => {
            setCurrentCategory(null);
            setVisible(true);
          }}
        >
          新建分类
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title={currentCategory ? "编辑分类" : "新建分类"}
        visible={visible}
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
          setCurrentCategory(null);
        }}
        okText="保存"
      >
        <Form
          getFormApi={(api) => (formApi.current = api)}
          onSubmit={handleSubmit}
          initValues={currentCategory || {}}
        >
          <Form.Input
            field="name"
            label="名称"
            rules={[{ required: true, message: "请输入分类名称" }]}
          />
          <Form.TextArea field="description" label="描述" />
        </Form>
      </Modal>
    </div>
  );
}
