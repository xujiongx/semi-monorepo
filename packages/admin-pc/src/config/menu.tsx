import React from 'react';
import { IconHome, IconHistogram, IconLive, IconSetting, IconArticle, IconHistory } from '@douyinfe/semi-icons';

export interface MenuItem {
  itemKey: string;
  text: string;
  icon?: React.ReactNode;
  path?: string;
  items?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    itemKey: 'Home',
    text: '首页',
    icon: <IconHome />,
    path: '/home',
  },
  {
    itemKey: 'TimeTracks',
    text: '时光轨迹',
    icon: <IconHistory />,
    items: [
        {
            itemKey: 'DailyMoments',
            text: '每日时光',
            path: '/time-tracks/daily',
        }
    ]
  },
  {
    itemKey: 'Content',
    text: '内容管理',
    icon: <IconArticle />,
    items: [
        {
            itemKey: 'ContentList',
            text: '内容列表',
            path: '/content/list',
        },
        {
            itemKey: 'Category',
            text: '分类管理',
            path: '/content/category',
        },
    ]
  },
  {
    itemKey: 'Histogram',
    text: '基础数据',
    icon: <IconHistogram />,
    path: '/histogram',
  },
  {
    itemKey: 'Live',
    text: '测试功能',
    icon: <IconLive />,
    path: '/live',
  },
  {
    itemKey: 'Setting',
    text: '设置',
    icon: <IconSetting />,
    path: '/settings',
  },
];
