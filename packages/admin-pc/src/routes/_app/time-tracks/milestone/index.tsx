import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Typography,
  Button,
  Timeline,
  Card,
  Tag,
  SideSheet,
  Form,
  useFormState,
  Toast,
  Select,
  Popconfirm,
  Image,
  Upload,
  Empty,
} from "@douyinfe/semi-ui";
import {
  IconPlus,
  IconDelete,
  IconEdit,
  IconUpload,
  IconInbox,
} from "@douyinfe/semi-icons";
import request from "@/utils/request";
import styles from "./index.module.less";

export const Route = createFileRoute("/_app/time-tracks/milestone/")({
  component: MilestonePage,
});

interface Milestone {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: string;
  category: string;
  attachments?: string[];
}

const MILESTONE_TYPES = [
  { label: "毕业", value: "graduation" },
  { label: "入职", value: "job" },
  { label: "结婚", value: "marriage" },
  { label: "其他", value: "custom" },
];

const MILESTONE_CATEGORIES = [
  { label: "求学", value: "education" },
  { label: "工作", value: "career" },
  { label: "生活", value: "life" },
];

function MilestonePage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(
    null,
  );
  const [filterType, setFilterType] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  const fetchMilestones = async () => {
    try {
      const data = await request.get("/milestone");
      setMilestones(data as any);
    } catch (error) {
      console.error("Failed to fetch milestones", error);
      Toast.error("获取里程碑列表失败");
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await request.delete(`/milestone/${id}`);
      Toast.success("删除成功");
      fetchMilestones();
    } catch (error) {
      Toast.error("删除失败");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        date: values.date, // Semi Form DatePicker returns Date object or string depending on config, check later
        attachments:
          values.attachments
            ?.map((f: any) => f.response?.data?.url || f.url)
            .filter(Boolean) || [],
      };

      if (currentMilestone) {
        await request.patch(`/milestone/${currentMilestone.id}`, payload);
        Toast.success("更新成功");
      } else {
        await request.post("/milestone", payload);
        Toast.success("创建成功");
      }
      setVisible(false);
      setCurrentMilestone(null);
      fetchMilestones();
    } catch (error) {
      Toast.error(currentMilestone ? "更新失败" : "创建失败");
    }
  };

  const filteredMilestones = milestones.filter((m) => {
    if (filterType && m.type !== filterType) return false;
    if (filterCategory && m.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title heading={3}>时光里程碑</Typography.Title>
        <div className={styles.filters}>
          <Select
            placeholder="筛选类型"
            style={{ width: 120 }}
            value={filterType}
            onChange={(v) => setFilterType(v as string)}
            showClear
            optionList={MILESTONE_TYPES}
          />
          <Select
            placeholder="筛选阶段"
            style={{ width: 120 }}
            value={filterCategory}
            onChange={(v) => setFilterCategory(v as string)}
            showClear
            optionList={MILESTONE_CATEGORIES}
          />
          <Button
            icon={<IconPlus />}
            theme="solid"
            onClick={() => {
              setCurrentMilestone(null);
              setVisible(true);
            }}
          >
            新增里程碑
          </Button>
        </div>
      </div>

      <div className={styles.timeline}>
        {filteredMilestones.length > 0 ? (
          <Timeline>
            {filteredMilestones.map((milestone) => (
              <Timeline.Item
                key={milestone.id}
                time={new Date(milestone.date).toLocaleDateString()}
                type="success" // Highlight with color, success is usually green, maybe use customized color if needed
                dot={
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "var(--semi-color-danger)",
                      border: "2px solid var(--semi-color-bg-0)",
                      boxShadow: "0 0 0 2px var(--semi-color-danger)",
                    }}
                  />
                }
              >
                <div className={styles.milestoneCard}>
                  <div className={styles.milestoneHeader}>
                    <div className={styles.milestoneTitle}>
                      {milestone.title}
                      <Tag style={{ marginLeft: 8 }} color="blue">
                        {
                          MILESTONE_TYPES.find(
                            (t) => t.value === milestone.type,
                          )?.label
                        }
                      </Tag>
                      <Tag style={{ marginLeft: 4 }} color="amber">
                        {
                          MILESTONE_CATEGORIES.find(
                            (c) => c.value === milestone.category,
                          )?.label
                        }
                      </Tag>
                    </div>
                    <div>
                      <Button
                        icon={<IconEdit />}
                        theme="borderless"
                        onClick={() => {
                          setCurrentMilestone(milestone);
                          setVisible(true);
                        }}
                      />
                      <Popconfirm
                        title="确定删除这个里程碑吗？"
                        position="left"
                        onConfirm={() => handleDelete(milestone.id)}
                      >
                        <Button
                          icon={<IconDelete />}
                          theme="borderless"
                          type="danger"
                        />
                      </Popconfirm>
                    </div>
                  </div>
                  <div className={styles.milestoneContent}>
                    {milestone.description}
                  </div>
                  {milestone.attachments &&
                    milestone.attachments.length > 0 && (
                      <div className={styles.attachments}>
                        {milestone.attachments.map((url, index) => (
                          <Image
                            key={index}
                            src={url}
                            width={100}
                            height={100}
                            className={styles.attachmentImage}
                          />
                        ))}
                      </div>
                    )}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Empty
            image={<IconInbox style={{ fontSize: 60 }} />}
            title="暂无里程碑"
            description="记录你的每一个重要时刻"
            style={{ padding: 40 }}
          >
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Button
                theme="solid"
                type="primary"
                style={{ padding: "6px 24px" }}
                onClick={() => {
                  setCurrentMilestone(null);
                  setVisible(true);
                }}
              >
                添加里程碑
              </Button>
            </div>
          </Empty>
        )}
      </div>

      <SideSheet
        title={currentMilestone ? "编辑里程碑" : "新增里程碑"}
        visible={visible}
        onCancel={() => setVisible(false)}
        width={400}
      >
        <Form
          initValues={
            currentMilestone
              ? {
                  ...currentMilestone,
                  date: new Date(currentMilestone.date),
                  attachments: currentMilestone.attachments?.map((url) => ({
                    uid: url,
                    url,
                    name: "image",
                  })),
                }
              : { date: new Date() }
          }
          onSubmit={handleSubmit}
        >
          <Form.Input
            field="title"
            label="标题"
            trigger="blur"
            rules={[{ required: true, message: "请输入标题" }]}
          />
          <Form.DatePicker
            field="date"
            label="日期"
            type="date"
            rules={[{ required: true, message: "请选择日期" }]}
            style={{ width: "100%" }}
          />
          <Form.Select
            field="type"
            label="类型"
            optionList={MILESTONE_TYPES}
            rules={[{ required: true, message: "请选择类型" }]}
            style={{ width: "100%" }}
          />
          <Form.Select
            field="category"
            label="人生阶段"
            optionList={MILESTONE_CATEGORIES}
            rules={[{ required: true, message: "请选择阶段" }]}
            style={{ width: "100%" }}
          />
          <Form.TextArea field="description" label="描述" autosize />
          <Form.Upload
            field="attachments"
            label="附件"
            action="/api/upload" // Assuming /api prefix is handled by proxy or base URL, otherwise check request config
            listType="picture"
            accept="image/*"
            name="file" // Check what the upload controller expects
          >
            <Button icon={<IconUpload />} theme="light">
              上传附件
            </Button>
          </Form.Upload>

          <Button
            type="primary"
            htmlType="submit"
            theme="solid"
            block
            style={{ marginTop: 20 }}
          >
            保存
          </Button>
        </Form>
      </SideSheet>
    </div>
  );
}
