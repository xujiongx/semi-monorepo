import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Typography,
  Button,
  Input,
  Select,
  Empty,
  Toast,
  Tag,
  Upload,
  Checkbox,
  Modal,
  Form
} from '@douyinfe/semi-ui';
import {
  IconSearch,
  IconFilter,
  IconUpload,
  IconDelete,
  IconFile,
  IconImage,
  IconVideo,
  IconMusic,
  IconInbox,
  IconEdit,
  IconMore
} from '@douyinfe/semi-icons';
import request from '@/utils/request';
import styles from './index.module.less';

export const Route = createFileRoute('/_app/content/resources/')({
  component: ResourcesPage,
});

interface Resource {
  id: string;
  filename: string;
  url: string;
  type: string;
  size?: number;
  tags?: string[];
  created_at: string;
}

const RESOURCE_TYPES = [
  { label: '图片', value: 'image' },
  { label: '视频', value: 'video' },
  { label: '文档', value: 'document' },
  { label: '音频', value: 'audio' },
  { label: '其他', value: 'other' },
];

function ResourcesPage() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('');
  const [tagFilter, setTagFilter] = useState('');

  // Tag Edit Modal
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (type) params.type = type;
      if (tagFilter) params.tags = tagFilter;

      const data = await request.get('/resources', { params });
      setResources(data as any);
    } catch (error) {
      Toast.error('获取资源列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [search, type, tagFilter]);

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    
    Modal.confirm({
        title: '确认删除',
        content: `确定要删除选中的 ${selectedIds.length} 个资源吗？`,
        onOk: async () => {
            try {
                await request.delete('/resources/batch', { data: { ids: selectedIds } });
                Toast.success('删除成功');
                setSelectedIds([]);
                fetchResources();
            } catch (error) {
                Toast.error('批量删除失败');
            }
        }
    });
  };

  const handleUpdateTags = async (values: any) => {
      try {
          if (editingResource) {
              // Single update
              await request.patch(`/resources/${editingResource.id}`, { tags: values.tags });
          } else if (selectedIds.length > 0) {
              // Batch update (Not implemented in backend yet, looping for now or need new API)
              // For simplicity, let's just support single edit via modal for now, or loop
              // Ideally backend should support batch update
               await Promise.all(selectedIds.map(id => request.patch(`/resources/${id}`, { tags: values.tags })));
          }
          Toast.success('标签更新成功');
          setTagModalVisible(false);
          setEditingResource(null);
          fetchResources();
      } catch (error) {
          Toast.error('标签更新失败');
      }
  }

  const handleUploadSuccess = async (response: any, file: any) => {
      console.log("😷", response);
      if (response && response.code === 0) {
          // Create resource record in backend
          const fileType = file.type.split('/')[0];
          const resourceType = ['image', 'video', 'audio'].includes(fileType) ? fileType : 'document';
          
          try {
              await request.post('/resources', {
                  filename: file.name,
                  url: response.data.url,
                  type: resourceType,
                  size: file.size,
              });
              Toast.success(`${file.name} 上传成功`);
              fetchResources();
          } catch (e) {
              console.error(e);
              Toast.error('创建资源失败');
          }
      } else {
          Toast.error('上传文件失败');
      }
  };

  const handleUploadError = () => {
      Toast.error('上传服务不可用');
  };

  const toggleSelection = (id: string) => {
      setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
  };

  const handleManualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      
      console.log('【手动上传】开始处理文件:', files.length);

      // Convert FileList to Array
      const fileList = Array.from(files);
      
      for (const file of fileList) {
           console.log('【手动上传】上传中:', file.name);
           const formData = new FormData();
           formData.append('file', file);
           
           try {
               const response = await request.post('/upload', formData, {
                   headers: { 'Content-Type': 'multipart/form-data' },
                   onUploadProgress: (progressEvent) => {
                       if (progressEvent.total) {
                           const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                           console.log(`【手动上传】进度 ${file.name}: ${percent}%`);
                       }
                   }
               });
               console.log('【手动上传】成功:', response);
               handleUploadSuccess(response, file);
           } catch (error: any) {
               console.error('【手动上传】失败:', error);
               Toast.error(`上传失败: ${file.name} - ${error.response?.status || '未知错误'}`);
               handleUploadError();
           }
      }
      
      // Reset input value to allow selecting same file again
      e.target.value = '';
  };

  const renderIcon = (type: string) => {
      switch(type) {
          case 'image': return <IconImage className={styles.fileIcon} />;
          case 'video': return <IconVideo className={styles.fileIcon} />;
          case 'audio': return <IconMusic className={styles.fileIcon} />;
          default: return <IconFile className={styles.fileIcon} />;
      }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title heading={3}>时光资源</Typography.Title>
        <div className={styles.filters}>
            <Input 
                prefix={<IconSearch />} 
                placeholder="搜索资源名称" 
                value={search} 
                onChange={setSearch} 
                style={{ width: 200 }} 
            />
            <Select 
                placeholder="类型筛选" 
                value={type} 
                onChange={(v) => setType(v as string)} 
                optionList={RESOURCE_TYPES} 
                showClear 
                style={{ width: 120 }} 
            />
            <Input 
                prefix={<IconFilter />} 
                placeholder="标签筛选" 
                value={tagFilter} 
                onChange={setTagFilter} 
                style={{ width: 150 }} 
            />
        </div>
      </div>

      <div className={styles.toolbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Checkbox 
                checked={resources.length > 0 && selectedIds.length === resources.length}
                onChange={e => setSelectedIds(e.target.checked ? resources.map(r => r.id) : [])}
            >
                全选
            </Checkbox>
            {selectedIds.length > 0 && (
                <>
                    <Button type="danger" theme="light" icon={<IconDelete />} onClick={handleBatchDelete}>
                        删除 ({selectedIds.length})
                    </Button>
                    <Button theme="light" icon={<IconEdit />} onClick={() => { setEditingResource(null); setTagModalVisible(true); }}>
                        批量打标签
                    </Button>
                </>
            )}
          </div>
          
          <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleManualUpload} 
              multiple 
          />
          <Button 
            theme="solid" 
            type="primary" 
            icon={<IconUpload />}
            onClick={() => fileInputRef.current?.click()}
          >
              上传资源
          </Button>
      </div>

      {resources.length > 0 ? (
        <div className={styles.grid}>
            {resources.map(resource => (
                <div 
                    key={resource.id} 
                    className={`${styles.card} ${selectedIds.includes(resource.id) ? styles.selected : ''}`}
                    onClick={() => toggleSelection(resource.id)}
                >
                    <div className={styles.checkbox}>
                        <Checkbox checked={selectedIds.includes(resource.id)} />
                    </div>
                    <div className={styles.preview}>
                        {resource.type === 'image' ? (
                            <img src={resource.url} alt={resource.filename} />
                        ) : (
                            renderIcon(resource.type)
                        )}
                    </div>
                    <div className={styles.info}>
                        <div className={styles.filename} title={resource.filename}>{resource.filename}</div>
                        <div className={styles.meta}>
                            <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                            <span>{resource.type}</span>
                        </div>
                        {resource.tags && resource.tags.length > 0 && (
                            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {resource.tags.map((tag, i) => (
                                    <Tag key={i} size="small" color="blue">{tag}</Tag>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.actions} onClick={e => e.stopPropagation()}>
                         <Button 
                            icon={<IconEdit />} 
                            size="small" 
                            theme="borderless" 
                            onClick={() => { setEditingResource(resource); setTagModalVisible(true); }} 
                        />
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <Empty 
            image={<IconInbox style={{ fontSize: 60 }} />} 
            title="暂无资源" 
            description="上传文件，开始沉淀你的数字资产"
        />
      )}

      <Modal
        title={editingResource ? "编辑标签" : "批量编辑标签"}
        visible={tagModalVisible}
        onCancel={() => setTagModalVisible(false)}
        footer={null}
      >
          <Form onSubmit={handleUpdateTags} initValues={{ tags: editingResource?.tags || [] }}>
              <Form.TagInput
                field="tags"
                label="时光标签"
                placeholder="输入标签并回车（如：2023毕业季）"
                rules={[{ required: true, message: '请输入标签' }]}
              />
              <Button type="primary" htmlType="submit" theme="solid" block style={{ marginTop: 20 }}>
                  保存
              </Button>
          </Form>
      </Modal>
    </div>
  );
}
