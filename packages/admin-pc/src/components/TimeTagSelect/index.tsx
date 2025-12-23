import React, { useState, useEffect } from "react";
import { Form } from "@douyinfe/semi-ui";
import request from "@/utils/request";

interface Category {
  id: string;
  name: string;
}

interface TimeTagSelectProps {
  field?: string;
  label?: string;
  rules?: any[];
  placeholder?: string;
  multiple?: boolean;
  maxTagCount?: number;
  style?: React.CSSProperties;
  allowCreate?: boolean;
}

export function TimeTagSelect({
  field = "tags",
  label = "时光标签",
  rules,
  placeholder = "请选择标签",
  multiple = true,
  allowCreate = false,
  ...rest
}: TimeTagSelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await request.get("/category");
        if (Array.isArray(res)) {
          setCategories(res);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const options = categories.map((c) => ({ label: c.name, value: c.name }));

  return (
    <Form.Select
      key={options.length}
      field={field}
      label={label}
      rules={rules}
      placeholder={placeholder}
      multiple={multiple}
      optionList={options}
      loading={loading}
      filter
      allowCreate={allowCreate}
      showClear
      {...rest}
    />
  );
}
