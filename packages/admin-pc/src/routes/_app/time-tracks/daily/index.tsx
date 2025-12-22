import React, { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Typography,
  DatePicker,
  Input,
  Button,
  Timeline,
  Card,
  Upload,
  Tag,
  Empty,
  Select,
  Rating,
  TextArea,
  Toast,
  Image,
} from "@douyinfe/semi-ui";
import {
  IconPlus,
  IconSearch,
  IconImage,
  IconMusic,
  IconCalendar,
  IconDelete,
  IconHash,
} from "@douyinfe/semi-icons";
import request from "@/utils/request";
import styles from "./index.module.less";

export const Route = createFileRoute("/_app/time-tracks/daily/")({
  component: DailyMoments,
});

interface LogEntry {
  id: string;
  date: Date;
  content: string;
  images?: string[];
  audio?: string;
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
}

function DailyMoments() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined); // undefined means all time
  const [filterType, setFilterType] = useState<"day" | "month" | "year">(
    "month",
  );
  const [keyword, setKeyword] = useState("");
  
  // Tags state
  const [tags, setTags] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock upload state
  const [fileList, setFileList] = useState<any[]>([]);

  const fetchTags = async () => {
    try {
      const data = await request.get('/category');
      setTags(data as any);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const params: any = {};
      if (keyword) params.keyword = keyword;
      if (filterDate) params.date = filterDate.toISOString();
      if (filterType) params.type = filterType;
      
      const data = await request.get('/time-tracks/daily', { params });
      setLogs(data as any);
    } catch (error) {
      // Interceptor handles error
    }
  };

  React.useEffect(() => {
    fetchLogs();
    fetchTags();
  }, [keyword, filterDate, filterType]);

  const handleSubmit = async () => {
    if (!content && fileList.length === 0) return;

    try {
      const images = fileList
        .map((f) => f.response?.data?.url || f.url)
        .filter(Boolean);

      await request.post('/time-tracks/daily', {
        content,
        images,
        tags: selectedTags,
        date: selectedDate ? selectedDate.toISOString() : new Date().toISOString()
      });
      
      setContent("");
      setFileList([]);
      setSelectedTags([]);
      Toast.success('保存成功');
      fetchLogs(); // Refresh list
    } catch (error) {
      // Interceptor handles error
    }
  };

  const filteredLogs = logs; // Backend handles filtering

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title heading={2}>时光日志</Typography.Title>
      </div>

      {/* Create Section */}
      <div className={styles.createSection}>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            placeholder="选择日期"
          />
          <Select
            multiple
            placeholder="选择标签"
            style={{ width: 200 }}
            value={selectedTags}
            onChange={(v) => setSelectedTags(v as string[])}
            prefix={<IconHash />}
          >
            {tags.map(tag => (
              <Select.Option key={tag.id} value={tag.name}>{tag.name}</Select.Option>
            ))}
          </Select>
          <Typography.Text type="secondary">记录你的时光</Typography.Text>
        </div>

        <TextArea
          value={content}
          onChange={setContent}
          placeholder="今天发生了什么？（支持文本、搜索关键词...）"
          autosize={{ minRows: 3, maxRows: 6 }}
        />

        <div className={styles.uploadArea}>
          <Upload
            action="/api/upload"
            headers={{ Authorization: `Bearer ${localStorage.getItem('access_token')}` }}
            name="file"
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            accept="image/*,audio/*"
            onSuccess={(response) => {
              if (response && response.code === 0) {
                Toast.success("上传成功");
              } else {
                Toast.error("上传失败");
              }
            }}
            onError={() => Toast.error("上传失败")}
          >
            <Button
              icon={<IconImage />}
              theme="light"
              style={{ marginRight: 8 }}
            ></Button>
          </Upload>
          <Button
            theme="solid"
            type="primary"
            icon={<IconPlus />}
            onClick={handleSubmit}
            disabled={!content && fileList.length === 0}
          >
            保存时光
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Input
            prefix={<IconSearch />}
            placeholder="搜索日志..."
            value={keyword}
            onChange={setKeyword}
            style={{ width: 300 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Select
              value={filterType}
              onChange={(v) => setFilterType(v as any)}
              style={{ width: 100 }}
            >
              <Select.Option value="day">按日</Select.Option>
              <Select.Option value="month">按月</Select.Option>
              <Select.Option value="year">按年</Select.Option>
            </Select>
            <DatePicker
              type={
                filterType === "day"
                  ? "date"
                  : filterType === "month"
                  ? "month"
                  : ("year" as any)
              }
              value={filterDate}
              onChange={(date) => setFilterDate(date as Date)}
              placeholder={`按${
                filterType === "day"
                  ? "日"
                  : filterType === "month"
                  ? "月"
                  : "年"
              }筛选`}
              showClear
            />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className={styles.timelineSection}>
        {filteredLogs.length > 0 ? (
          <Timeline mode="left">
            {filteredLogs.map((log) => (
              <Timeline.Item
                key={log.id}
                time={new Date(log.date).toLocaleString()}
              >
                <div className={styles.momentCard}>
                  <div className={styles.momentContent}>{log.content}</div>
                  {log.tags && log.tags.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      {log.tags.map((tag, i) => (
                        <Tag key={i} color="blue" style={{ marginRight: 4 }}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                  {log.images && log.images.length > 0 && (
                    <div className={styles.mediaGrid}>
                      {log.images.map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          className={styles.mediaItem}
                          alt="时光媒体"
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
            image={<IconCalendar style={{ fontSize: 48 }} />}
            description="暂无记录"
          />
        )}
      </div>
    </div>
  );
}
