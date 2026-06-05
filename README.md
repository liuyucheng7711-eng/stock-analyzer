# 股票分析软件 - Stock Analyzer

一个基于Python + React的实时股票分析平台，集成同花顺、通达信、东方财富等数据源。

## 功能特性

- 📊 **每日涨停板筛选** - 实时监控涨停股票
- 💰 **20元以下股票过滤** - 低价股筛选
- 🔥 **板块强度分析** - 分析各板块表现
- 💵 **资金流向分析** - 主力资金动向追踪
- 📈 **换手率分析** - 流动性指标
- 📊 **量比分析** - 成交量对比
- 🎯 **3倍量筛选** - 异常放量股票

## 项目结构

```
stock-analyzer/
├── backend/                 # Python后端
│   ├── app.py              # Flask应用入口
│   ├── requirements.txt     # 依赖管理
│   ├── config.py           # 配置文件
│   ├── models/             # 数据模型
│   ├── services/           # 业务逻���
│   │   ├── data_fetcher.py      # 数据抓取服务
│   │   ├── stock_analyzer.py    # 股票分析服务
│   │   └── screener.py          # 股票筛选器
│   ├── api/                # API路由
│   │   ├── stocks.py       # 股票API
│   │   ├── analysis.py     # 分析API
│   │   └── screener.py     # 筛选API
│   └── utils/              # 工具函数
│
├── frontend/               # React前端
│   ├── src/
│   │   ├── components/     # React组件
│   │   │   ├── StockList.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Screener.jsx
│   │   │   └── Analysis.jsx
│   │   ├── pages/          # 页面
│   │   ├── services/       # API调用
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── public/
│
├── docker-compose.yml      # Docker配置
└── .gitignore
```

## 技术栈

### 后端
- Python 3.9+
- Flask / Flask-RESTful
- SQLAlchemy
- Pandas / NumPy
- tushare / akshare（数据源）

### 前端
- React 18+
- Axios
- ECharts / Recharts（数据可视化）
- Ant Design（UI组件库）

## 快速开始

### 后端启动
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 前端启动
```bash
cd frontend
npm install
npm start
```

## API文档

### 获取涨停板股票
```
GET /api/stocks/limit-up
```

### 获取20元以下股票
```
GET /api/stocks/under-20
```

### 获取板块强度
```
GET /api/analysis/sector-strength
```

### 获取资金流向
```
GET /api/analysis/capital-flow
```

### 筛选3倍量股票
```
GET /api/screener/triple-volume
```

## 配置说明

编辑 `backend/config.py` 配置数据源和API密钥。

## 许可证

MIT