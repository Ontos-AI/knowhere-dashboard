# Knowhere API Dashboard - 中英双语文案结构化文档

## 📚 文档说明

本文档整理了 Knowhere API Dashboard 项目的所有页面文案，按模块分类，提供中英双语对照。

---

## 🦞 OpenClaw 插件页面 (Knowhere OpenClaw Plugin)

### 页面链接
- **URL**: `/claw`
- **页面标题**: Knowhere OpenClaw Plugin | Ground OpenClaw With Knowhere API
- **描述**: Install the Knowhere OpenClaw plugin to turn complex documents into browse-first, citation-ready context inside OpenClaw.

### 页面结构
1. **Hero Section** (插件概览)
2. **Workflow Section** (工作流)
3. **Integration Section** (集成指南)
4. **CTA Section** (行动号召)

---

### Hero Section 文案

#### 标签 (Badges)
| 英文 | 中文 | 说明 |
|------|------|------|
| Knowhere API | Knowhere API | API 标签 |
| OpenClaw Plugin | OpenClaw 插件 | 插件标签 |
| @ontos-ai/knowhere-claw | @ontos-ai/knowhere-claw | npm 包名称 |
| ClawHub: Knowhere | ClawHub: Knowhere | ClawHub 技能标签 |

#### 主标题
| 英文 | 中文 | 说明 |
|------|------|------|
| Your docs | 你的文档 | 主标题 |
| PDF, DOCX, XLSX, PPT | PDF, DOCX, XLSX, PPT | 支持的文件格式 |
| become OpenClaw-native context with grounded retrieval | 变成 OpenClaw 原生的上下文，通过有根据的检索 | 副标题 |
| Browse-first | 浏览优先 | 特性标签 |
| Path-aware | 路径感知 | 特性标签 |
| Chunk-backed | 块支持 | 特性标签 |
| Citation-ready | 引用就绪 | 特性标签 |
| OpenClaw-native | OpenClaw 原生 | 特性标签 |

#### 特性卡片
| 英文 | 中文 | 说明 |
|------|------|------|
| Result packages | 结果包 | 卡片标题 |
| Store once. Reopen anytime. | 存储一次。随时重新打开。 | 描述 |
| Tool surface | 工具界面 | 卡片标题 |
| Browse before the answer. | 在回答之前先浏览。 | 描述 |
| Auto-grounding | 自动接地 | 卡片标题 |
| Context arrives when it matters. | 上下文在需要时到达。 | 描述 |

#### 功能描述
| 英文 | 中文 | 说明 |
|------|------|------|
| The plugin uses Knowhere for parsing and job orchestration, stores the returned result package inside OpenClaw-managed local storage, and gives agents a browse-first path to previews, chunks, hierarchy, and raw files before they answer. | 该插件使用 Knowhere 进行解析和任务编排，将返回的结果包存储在 OpenClaw 管理的本地存储中，并在代理回答之前提供浏览优先的路径来查看预览、块、层次结构和原始文件。 | 主要描述 |

#### CTA 按钮
| 英文 | 中文 | 说明 |
|------|------|------|
| See integration guide | 查看集成指南 | 按钮 |
| Get API key | 获取 API Key | 按钮 |

---

### Workflow Section 文案

#### 小标题 (Eyebrow)
| 英文 | 中文 | 说明 |
|------|------|------|
| Grounded Answer Flow | 有根据的回答流程 | 小标题 |

#### 主标题
| 英文 | 中文 | 说明 |
|------|------|------|
| One dense report in. | 一份密集的报告输入。 | 主标题第一行 |
| One grounded OpenClaw answer out. | 一个有根据的 OpenClaw 回答输出。 | 主标题第二行 |

#### 描述
| 英文 | 中文 | 说明 |
|------|------|------|
| This is the interaction model the plugin is built for: Knowhere extracts structure, OpenClaw stores the package, and the agent answers only after it has previewed or reopened the right evidence. | 这是插件构建的交互模型：Knowhere 提取结构，OpenClaw 存储包，代理只有在预览或重新打开正确证据后才会回答。 | 描述 |

#### 左侧面板 (Document Panel)
| 英文 | 中文 | 说明 |
|------|------|------|
| TSLA-Q4-2025-Update.pdf | TSLA-Q4-2025-更新.pdf | 文件名 |
| Raw source | 原始源 | 标签 |
| Full PDF page preview. | 完整 PDF 页面预览。 | 标题 |
| Zoom only where the evidence lives. | 仅在证据所在位置缩放。 | 副标题 |
| full-page context | 完整页面上下文 | 标签 |
| table-heavy | 表格密集 | 标签 |
| reopenable evidence | 可重新打开的证据 | 标签 |
| UNSTRUCTURED. | 非结构化。 | 底部标签 |

#### 右侧面板 (Chat Panel)
| 英文 | 中文 | 说明 |
|------|------|------|
| OpenClaw | OpenClaw | 聊天标题 |
| knowhere skill loaded | knowhere 技能已加载 | 状态标签 |
| STRUCTURED. | 结构化。 | 底部标签 |

#### 用户消息
| 英文 | 中文 | 说明 |
|------|------|------|
| Did Tesla's free cash flow go negative in any quarter? Show the supporting chunk. | 特斯拉的自由现金流在任何季度是否为负？显示支持的块。 | 用户消息 1 |
| 👀 | 👀 | 表情反应 |
| What should I inspect if I want the raw source instead of the answer? | 如果我想查看原始源而不是答案，我应该检查什么？ | 用户消息 2 |
| 🧭 | 🧭 | 表情反应 |

#### 代理消息
| 英文 | 中文 | 说明 |
|------|------|------|
| Yes. Q1 2024 is the only negative quarter. Operating cash fell to $242M while CapEx stayed at $2,777M. | 是的。Q1 2024 是唯一的负季度。经营现金流降至 2.42 亿美元，而资本支出保持在 27.77 亿美元。 | 代理消息 1 |
| −$2,535M | −$2,535M | 高亮显示 |
| manifest.json, chunks.json, page-33 / table-14 | manifest.json, chunks.json, page-33 / table-14 | 引用 |
| Open the preview first, grep for the metric, then read the exact result file behind that chunk. The plugin keeps the path surface intact. | 首先打开预览，搜索指标，然后阅读该块后面的确切结果文件。插件保持路径表面完整。 | 代理消息 2 |
| preview → grep → read_result_file | 预览 → 搜索 → 读取结果文件 | 高亮显示 |
| knowhere_preview_document, knowhere_grep, knowhere_read_result_file | knowhere_preview_document, knowhere_grep, knowhere_read_result_file | 引用 |

---

### Integration Section 文案

#### 小标题
| 英文 | 中文 | 说明 |
|------|------|------|
| Integration Guide | 集成指南 | 小标题 |

#### 主标题
| 英文 | 中文 | 说明 |
|------|------|------|
| Install it in OpenClaw | 在 OpenClaw 中安装 | 主标题第一行 |
| in three commands. | 用三个命令。 | 主标题第二行 |

#### 描述
| 英文 | 中文 | 说明 |
|------|------|------|
| Follow the same rhythm as a developer-tool homepage: read the steps once, copy the commands in order, and replace the API key only in step 02. | 按照开发者工具主页的节奏：阅读一次步骤，按顺序复制命令，仅在步骤 02 中替换 API 密钥。 | 描述 |

#### 包信息
| 英文 | 中文 | 说明 |
|------|------|------|
| Package | 包 | 标签 |
| @ontos-ai/knowhere-claw | @ontos-ai/knowhere-claw | 包名称 |
| No config wall, no runtime internals, and no extra surface to learn. Install the package, attach the API key, then enable the plugin. | 没有配置墙，没有运行时内部，没有额外的学习界面。安装包，附加 API 密钥，然后启用插件。 | 描述 |

#### ClawHub 技能
| 英文 | 中文 | 说明 |
|------|------|------|
| ClawHub Skill | ClawHub 技能 | 标签 |
| Knowhere | Knowhere | 技能名称 |
| If you install from ClawHub, look for the skill named Knowhere. | 如果从 ClawHub 安装，请查找名为 Knowhere 的技能。 | 描述 |

#### 安装步骤
| 英文 | 中文 | 说明 |
|------|------|------|
| 01 | 01 | 步骤编号 |
| Install package | 安装包 | 步骤标题 |
| Add the packaged runtime so OpenClaw can load the bundled knowhere skill. | 添加打包的运行时，以便 OpenClaw 可以加载捆绑的 knowhere 技能。 | 描述 |
| openclaw plugins install @ontos-ai/knowhere-claw | openclaw plugins install @ontos-ai/knowhere-claw | 命令 |
| 02 | 02 | 步骤编号 |
| Attach API key | 附加 API 密钥 | 步骤标题 |
| Connect this OpenClaw instance to your Knowhere account. | 将此 OpenClaw 实例连接到您的 Knowhere 账户。 | 描述 |
| openclaw config set plugins.entries.knowhere.config.apiKey "sk_..." | openclaw config set plugins.entries.knowhere.config.apiKey "sk_..." | 命令 |
| 03 | 03 | 步骤编号 |
| Enable plugin | 启用插件 | 步骤标题 |
| Turn the entry on so agents can load the plugin inside the runtime. | 打开条目，以便代理可以在运行时加载插件。 | 描述 |
| openclaw plugins enable knowhere | openclaw plugins enable knowhere | 命令 |

#### 提示
| 英文 | 中文 | 说明 |
|------|------|------|
| Only edit step 02 | 仅编辑步骤 02 | 提示标签 |
| Everything else can be pasted exactly as shown. The API key line is the only place where you replace a value. | 其他所有内容都可以完全按显示的方式粘贴。API 密钥行是您替换值的唯一位置。 | 提示描述 |

#### Shell 演示
| 英文 | 中文 | 说明 |
|------|------|------|
| OpenClaw Shell | OpenClaw Shell | 终端标题 |
| INSTALL | INSTALL | 标签 1 |
| API KEY | API KEY | 标签 2 |
| ENABLE | ENABLE | 标签 3 |
| COPY | COPY | 复制按钮 |
| ✓ COPIED | ✓ 已复制 | 复制成功 |

---

### CTA Section 文案

#### 小标题
| 英文 | 中文 | 说明 |
|------|------|------|
| Call to action | 行动号召 | 小标题 |

#### 主标题
| 英文 | 中文 | 说明 |
|------|------|------|
| Bring Knowhere into OpenClaw. | 将 Knowhere 引入 OpenClaw。 | 主标题 |

#### 描述
| 英文 | 中文 | 说明 |
|------|------|------|
| Install the plugin, point it at your API key, and give OpenClaw a browse-first way to inspect documents before an agent answers. | 安装插件，指向您的 API 密钥，并为 OpenClaw 提供浏览优先的方式来检查文档，然后代理回答。 | 描述 |
| PDFs, scanned files, tables, manifests, chunks, and raw result files stay reopenable instead of disappearing into one generated reply. | PDF、扫描文件、表格、清单、块和原始结果文件保持可重新打开，而不是消失在一个生成的回复中。 | 补充描述 |

#### CTA 按钮
| 英文 | 中文 | 说明 |
|------|------|------|
| Get API key | 获取 API Key | 按钮 |
| Review install steps | 查看安装步骤 | 按钮 |

#### 内部变化 (What changes inside OpenClaw)
| 英文 | 中文 | 说明 |
|------|------|------|
| what changes inside OpenClaw | OpenClaw 内部的变化 | 小标题 |

#### 功能特性
| 英文 | 中文 | 说明 |
|------|------|------|
| knowhere_* tools | knowhere_* 工具 | 特性标题 |
| Preview, grep, raw-file reads, ingest, and cleanup become callable in one place. | 预览、搜索、原始文件读取、摄取和清理在一个地方可调用。 | 描述 |
| Browse-first evidence | 浏览优先证据 | 特性标题 |
| Agents can reopen manifest, hierarchy, chunks, and raw files before answering. | 代理可以在回答之前重新打开清单、层次结构、块和原始文件。 | 描述 |
| Scoped local storage | 作用域本地存储 | 特性标题 |
| Result packages stay reusable across session, agent, or global scopes. | 结果包在会话、代理或全局作用域中保持可重用。 | 描述 |

#### 引用
| 英文 | 中文 | 说明 |
|------|------|------|
| "I found the supporting chunk, reopened the result file, and answered with the exact evidence instead of improvising." | "我找到了支持的块，重新打开了结果文件，并用确切的证据回答，而不是即兴发挥。" | 引用 |

---

## 🏠 首页 (Landing Page)

## 🏠 首页 (Landing Page)

### 导航栏 (Navbar)
| 英文 | 中文 | 位置 |
|------|------|------|
| GET API KEY | 获取 API Key | 导航栏 CTA 按钮 |
| Overview | 概览 | 自定义链接 (OpenClaw 页面) |
| Workflow | 工作流 | 自定义链接 (OpenClaw 页面) |
| Integration | 集成 | 自定义链接 (OpenClaw 页面) |
| Docs | 文档 | 外部链接 |

### 首屏区域 (Hero Section)
| 英文 | 中文 | 说明 |
|------|------|------|
| API Platform | API 平台 | 主标题 |
| Transform unstructured documents into clean, structured data. | 将非结构化文档转换为干净、结构化的数据。 | 副标题第一行 |
| Extract tables, formulas, and layouts with pixel-perfect precision. | 提取表格、公式和布局，像素级精准。 | 副标题第二行 |
| Start Free Trial | 免费试用 | CTA 按钮 |
| View Docs | 查看文档 | CTA 按钮 |
| INPUT | 输入 | 流程图输入节点 |
| Documents | 文档 | 输入类型 |
| API | API | 流程图处理节点 |
| Processing | 处理 | 处理类型 |
| OUTPUT | 输出 | 流程图输出节点 |
| Clean JSON | 干净的 JSON | 输出格式 |
| No Card Required | 无需卡片 | 信任指标 |
| 99.8% Accuracy | 99.8% 准确率 | 信任指标 |
| <200ms Speed | <200ms 速度 | 信任指标 |
| Now live on 🦞 OpenClaw | 现已上线 🦞 OpenClaw | 新功能横幅 |

---

## 🔐 认证模块 (Authentication)

### 登录页面 (Login Page)
| 英文 | 中文 | 说明 |
|------|------|------|
| Sign in | 登录 | 页面标题 |
| Sign in to your Knowhere account | 登录到您的 Knowhere 账户 | 描述 |
| Email | 邮箱 | 表单标签 |
| name@example.com | name@example.com | 邮箱占位符 |
| Sign in with Email | 通过邮箱获取登录链接 | 按钮文本 |
| Sending... | 发送中... | 加载状态 |
| Already have an account? | 已有账户？ | 底部链接 |
| Sign in now | 立即登录 | 底部链接 |

### 注册页面 (Register Page)
| 英文 | 中文 | 说明 |
|------|------|------|
| Sign up | 注册 | 页面标题 |
| Create your Knowhere account | 创建您的 Knowhere 账户 | 描述 |
| OR CONTINUE WITH EMAIL | 或使用邮箱继续 | 分隔符 |
| Registering... | 注册中... | 加载状态 |
| Password | 密码 | 表单标签 |
| Enter your password | 请输入密码 | 密码占位符 |
| Confirm Password | 确认密码 | 确认密码标签 |
| Enter your password again | 请再次输入密码 | 确认密码占位符 |
| Username | 用户名 | 用户名标签 |
| Enter your username | 请输入用户名 | 用户名占位符 |
| Password must be at least 8 characters | 密码至少需要8个字符 | 验证错误 |
| Passwords do not match | 密码不匹配 | 验证错误 |
| Registration successful | 注册成功 | 成功提示 |
| Registration failed | 注册失败 | 错误提示 |

### OAuth 按钮
| 英文 | 中文 | 说明 |
|------|------|------|
| Continue with Google | 使用 Google 继续 | Google 登录 |
| Continue with GitHub | 使用 GitHub 继续 | GitHub 登录 |

### 魔法链接回调 (Magic Link Callback)
| 英文 | 中文 | 说明 |
|------|------|------|
| Processing Magic Link... | 正在处理魔法链接... | 处理中 |

### GitHub 登录回调
| 英文 | 中文 | 说明 |
|------|------|------|
| Processing GitHub login... | 正在处理GitHub登录... | 处理中 |
| GitHub login successful | GitHub登录成功 | 成功提示 |
| GitHub login failed | GitHub登录失败 | 错误提示 |

### Apple 登录回调
| 英文 | 中文 | 说明 |
|------|------|------|
| Processing Apple login... | 正在处理Apple登录... | 处理中 |
| Apple login successful | Apple登录成功 | 成功提示 |
| Apple login failed | Apple登录失败 | 错误提示 |

### 邮箱验证页面 (Verify Email)
| 英文 | 中文 | 说明 |
|------|------|------|
| Verifying your email... | 正在验证邮箱... | 验证中 |
| Email Verified! | 邮箱验证成功! | 成功标题 |
| Your email has been successfully verified. | 您的邮箱已成功验证。 | 成功描述 |
| Redirecting to settings... | 正在跳转到设置页面... | 跳转提示 |
| Verification Failed | 验证失败 | 错误标题 |
| This link is invalid or has expired. Please request a new verification email. | 此链接无效或已过期,请重新申请验证邮件。 | 错误描述 |
| Go to Settings | 前往设置 | 按钮 |

---

## 📊 仪表板模块 (Dashboard)

### 通用导航
| 英文 | 中文 | 说明 |
|------|------|------|
| Dashboard | 概览 | 侧边栏 |
| Usage | 用量 | 侧边栏 |
| API Keys | API Keys | 侧边栏 |
| Webhooks | Webhooks | 侧边栏 |
| Billing | 计费 | 侧边栏 |
| Settings | 设置 | 侧边栏 |
| Sign out | 退出登录 | 侧边栏 |
| Open sidebar | 打开侧边栏 | 无障碍 |
| View notifications | 查看通知 | 通知 |
| Toggle theme | 切换主题 | 主题切换 |
| Light | 浅色 | 主题 |
| Dark | 深色 | 主题 |
| System | 系统 | 主题 |
| Credits | 积分 | 积分显示 |
| Buy | 购买 | 购买按钮 |
| Starter Plan | 入门套餐 | 套餐 |
| Loading... | 加载中... | 加载状态 |

### 用量页面 (Usage Page)
| 英文 | 中文 | 说明 |
|------|------|------|
| Usage & Billing | 用量与账单 | 页面标题 |
| Track your API usage, costs, and job history. | 追踪您的API用量、成本和任务历史。 | 描述 |
| Total Credits Used | 已用积分 | 统计卡片 |
| Total Requests | 总请求数 | 统计卡片 |
| Total Pages | 总页数 | 统计卡片 |
| Success Rate | 成功率 | 统计卡片 |
| Completion Rate | 完成率 | 统计卡片 |
| Remaining Credits | 剩余积分 | 统计卡片 |
| Available Balance | 可用余额 | 统计卡片 |
| Recent Records | 近期记录 | 表格标题 |
| Details of recent API calls | 最近的API调用详情 | 表格描述 |
| Export CSV | 导出 CSV | 按钮 |
| Call History | 调用历史 | 标签 |
| vs last month | 较上月 | 对比 |
| est. {cost} | 预估 {cost} | 预估成本 |
| Average processing time: {time} | 平均处理时间: {time} | 处理时间 |
| 1d | 1天 | 时间范围 |
| 7d | 7天 | 时间范围 |
| 30d | 30天 | 时间范围 |
| Pick a date | 选择日期 | 日期选择器 |

### 用量表格 (Usage Table)
| 英文 | 中文 | 说明 |
|------|------|------|
| Date | 日期 | 表头 |
| Job ID | 任务ID | 表头 |
| File Name | 文件名 | 表头 |
| Model | 模型 | 表头 |
| Pages | 页数 | 表头 |
| Duration | 耗时 | 表头 |
| Cost | 花费 | 表头 |
| Status | 状态 | 表头 |
| Type | 类型 | 表头 |
| No results. | 暂无数据 | 空状态 |
| Previous | 上一页 | 分页 |
| Next | 下一页 | 分页 |
| {selected} of {total} row(s) selected. | 已选择 {selected} / {total} 行 | 选中状态 |
| Done | 完成 | 状态 |
| Failed | 失败 | 状态 |
| Running | 进行中 | 状态 |
| Pending | 排队中 | 状态 |
| Waiting File | 等待上传 | 状态 |
| Base | 基础版 | 模型 |
| Advanced | 高级版 | 模型 |
| pts | 积分 | 单位 |
| Download | 下载 | 操作 |
| Result URL | 结果链接 | 表头 |
| Rows per page | 每页行数 | 分页 |
| Total: {total} | 共 {total} 条 | 总数 |

### API Keys 页面
| 英文 | 中文 | 说明 |
|------|------|------|
| API Keys | API Keys | 页面标题 |
| Manage your API access keys | 管理您的API访问密钥 | 描述 |
| Create API Key | 创建API Key | 按钮 |
| Search API Keys... | 搜索API Keys... | 搜索框占位符 |
| No matching API keys found | 未找到匹配的API Keys | 搜索空状态 |
| No API keys yet | 还没有API Keys | 初始空状态 |
| Try adjusting your search terms | 尝试调整搜索条件 | 搜索空状态描述 |
| Create your first API key to get started | 创建您的第一个API Key开始使用 | 初始空状态描述 |
| API Key created successfully | API Key创建成功 | 成功提示 |
| Failed to create API Key | 创建API Key失败 | 错误提示 |
| API Key copied to clipboard | API Key已复制到剪贴板 | 复制成功 |
| Copy failed | 复制失败 | 复制失败 |
| API Key revoked | API Key已撤销 | 撤销成功 |
| Failed to revoke API Key | 撤销API Key失败 | 撤销失败 |
| API Key status updated | API Key状态已更新 | 状态更新成功 |
| Failed to update API Key status | 更新API Key状态失败 | 状态更新失败 |
| Create New API Key | 创建新的API Key | 对话框标题 |
| Create a new API access key. Please keep your key secure. | 创建一个新的API访问密钥。请妥善保管您的密钥。 | 对话框描述 |
| Name | 名称 | 表单标签 |
| e.g. Production | 例如：生产环境 | 名称占位符 |
| Expiration | 过期时间 | 表单标签 |
| Select expiration | 选择过期时间 | 下拉框占位符 |
| 1 Day | 1天 | 过期选项 |
| 7 Days | 1周 | 过期选项 |
| 30 Days | 1个月 | 过期选项 |
| 1 Year | 1年 | 过期选项 |
| Never | 永不过期 | 过期选项 |
| Cancel | 取消 | 按钮 |
| Creating... | 创建中... | 加载状态 |
| Create | 创建 | 按钮 |
| API Key | API Key | 表头 |
| Status | 状态 | 表头 |
| Created | 创建时间 | 表头 |
| Last Used | 最后使用 | 表头 |
| Actions | 操作 | 表头 |
| Active | 活跃 | 状态 |
| Disabled | 禁用 | 状态 |
| Never used | 从未使用 | 使用状态 |
| Never | 永不过期 | 过期状态 |
| Please copy and save your API Key securely. For security reasons, we will not show the full key again. | 请复制并安全保存您的API Key。出于安全考虑，我们不会再次显示完整密钥。 | 成功提示 |
| Your API Key | 您的API Key | 密钥显示标签 |
| ⚠️ Please copy and save this API Key immediately, you will not be able to see the full key again after closing this dialog. | ⚠️ 请立即复制并安全保存此API Key，关闭此对话框后将无法再次查看完整密钥。 | 安全警告 |
| I have saved it | 我已保存 | 按钮 |
| Delete API Key | 删除 API Key | 删除确认标题 |
| This action cannot be undone. This will permanently delete the API key and any applications using it will stop working. | 此操作无法撤销。这将永久删除该 API Key，使用该 Key 的任何应用将无法访问。 | 删除确认描述 |
| Delete | 删除 | 按钮 |
| Confirm Disable API Key? | 确认禁用 API Key？ | 禁用确认标题 |
| Disabling this key will prevent any applications using it from accessing the API. You can enable it again at any time. | 禁用后，使用此 Key 的应用将无法访问 API。您随时可以再次启用它。 | 禁用确认描述 |
| Confirm Disable | 确认禁用 | 按钮 |

### Webhooks 密钥页面
| 英文 | 中文 | 说明 |
|------|------|------|
| Webhook Secrets | Webhook 密钥 | 页面标题 |
| Manage webhook secrets for securing webhook endpoints | 管理用于保护 webhook 端点的密钥 | 描述 |
| Create Secret | 创建密钥 | 按钮 |
| Search by endpoint URL... | 搜索端点 URL... | 搜索占位符 |
| All | 全部 | 筛选 |
| Active | 活跃 | 筛选 |
| Revoked | 已撤销 | 筛选 |
| No webhook secrets yet | 还没有 webhook 密钥 | 空状态 |
| Create your first webhook secret to secure your webhook endpoints | 创建您的第一个 webhook 密钥来保护您的 webhook 端点 | 空状态描述 |
| No webhook secrets found | 未找到 webhook 密钥 | 搜索空状态 |
| Try adjusting your search or filter settings | 尝试调整搜索或筛选条件 | 搜索空状态描述 |
| Webhook Secrets | Webhook 密钥 | 密钥列表标题 |
| Manage your webhook endpoint secrets | 管理您的 webhook 端点密钥 | 密钥列表描述 |
| Secret | 密钥 | 表头 |
| Endpoint URL | 端点 URL | 表头 |
| Created At | 创建时间 | 表头 |
| Page | 第 | 分页 |
| of | 页,共 | 分页 |
| Create a new webhook secret. Leave endpoint empty for account-level default secret. | 创建新的 webhook 密钥。留空端点将创建账户级别的默认密钥。 | 创建描述 |
| https://example.com/webhook | https://example.com/webhook | 端点占位符 |
| Optional. Leave empty for a default account-level secret. | 可选。留空将创建账户级别的默认密钥。 | 端点提示 |
| Creating... | 创建中... | 加载状态 |
| Webhook Secret Created | Webhook 密钥已创建 | 成功标题 |
| Your webhook secret has been created successfully. Please copy and save it now. | 您的 webhook 密钥已成功创建。请立即复制并保存。 | 成功描述 |
| Copy secret | 复制密钥 | 按钮 |
| Save this secret now | 立即保存此密钥 | 安全提示 |
| You won't be able to see it again. Make sure to copy and securely store this secret. | 关闭后将无法再次查看。请务必复制并安全保存此密钥。 | 安全描述 |
| I have saved it | 我已保存 | 按钮 |
| Secret copied to clipboard | 密钥已复制到剪贴板 | 复制成功 |
| Failed to copy secret | 复制失败 | 复制失败 |
| Revoke Webhook Secret | 撤销 Webhook 密钥 | 撤销标题 |
| This action cannot be undone. This will permanently revoke the webhook secret. | 此操作无法撤销。这将永久撤销该 webhook 密钥。 | 撤销描述 |
| Revoke | 撤销 | 按钮 |
| Revoking... | 撤销中... | 加载状态 |
| Webhook secret revoked successfully | Webhook 密钥已成功撤销 | 撤销成功 |
| Failed to revoke webhook secret | 撤销 webhook 密钥失败 | 撤销失败 |
| Failed to create webhook secret | 创建 webhook 密钥失败 | 创建失败 |
| A secret for this endpoint already exists | 该端点已存在密钥 | 重复错误 |

### 计费页面 (Billing Page)
| 英文 | 中文 | 说明 |
|------|------|------|
| Billing & Plans | 账单与套餐 | 页面标题 |
| Current Plan | 当前套餐 | 套餐信息 |
| Free Plan | 免费使用 | 免费套餐 |
| Subscribe to {name} | 订阅 {name} | 订阅按钮 |
| Processing... | 处理中... | 加载状态 |
| You are already subscribed to this plan | 您当前已订阅此套餐 | 已订阅提示 |
| Free plan requires no subscription | 免费套餐无需订阅 | 免费套餐说明 |
| Subscribed successfully | 订阅成功 | 订阅成功 |
| Subscription failed, please try again later | 订阅失败，请稍后重试 | 订阅失败 |
| Failed to get payment link | 获取支付链接失败 | 支付链接失败 |
| Recommended | 推荐 | 推荐标签 |
| Free | 免费 | 免费标签 |
| Failed to create payment, please try again | 创建支付失败，请重试 | 支付失败 |
| Buy Credits Package | 购买Credits量包 | 量包按钮 |
| One-time purchase of Credits, valid for 30 days. Subscription credits are consumed first. | 一次性购买Credits，30天内有效。先消耗订阅赠送的Credits，再消耗量包Credits。 | 量包描述 |
| Pricing Rules | 定价规则 | 定价规则 |
| Minimum purchase is {amount} Credits | 最少需要购买 {amount} Credits | 最小购买 |
| Successfully purchased {amount} Credits! | 成功购买 {amount} Credits! | 购买成功 |
| Credits Amount | Credits数量 | 数量标签 |
| Quick Select | 快捷选择 | 快捷选择 |
| Purchase Quantity | 购买数量 | 购买数量 |
| Amount Due | 应付金额 | 应付金额 |
| Buy Now {amount} | 立即购买 {amount} | 购买按钮 |
| Valid for 30 days, effective immediately after purchase | 量包有效期为30天，购买后立即生效 | 有效期 |
| approx. ¥{price}/Credit | 即 ¥{price}/Credit | 单价 |
| 100 Credits = ¥2 | 100 积分 = ¥2 | 汇率 |
| Credits/month | 积分/月 | 月积分 |

### 设置页面 (Settings)
| 英文 | 中文 | 说明 |
|------|------|------|
| Settings | 设置 | 页面标题 |
| Manage your account settings and preferences | 管理您的账户设置和偏好 | 描述 |
| Profile | 个人资料 | 标签页 |
| Account | 账户 | 标签页 |
| Appearance | 外观 | 标签页 |
| Notifications | 通知 | 标签页 |
| Username | 用户名 | 表单标签 |
| Email | 邮箱 | 表单标签 |
| Save Changes | 保存更改 | 按钮 |
| Username must be at least 2 characters | 用户名至少需要2个字符 | 验证错误 |
| Please enter a valid email address | 请输入有效的邮箱地址 | 邮箱验证 |
| Failed to load user profile | 加载用户资料失败 | 加载失败 |
| Profile updated successfully | 个人资料已更新 | 更新成功 |
| Failed to update profile | 更新个人资料失败 | 更新失败 |
| Password | 密码 | 密码标签 |
| Current Password | 当前密码 | 当前密码 |
| New Password | 新密码 | 新密码 |
| Confirm Password | 确认密码 | 确认密码 |
| Password must be at least 6 characters | 当前密码至少需要6个字符 | 密码验证 |
| New password must be at least 8 characters | 新密码至少需要8个字符 | 新密码验证 |
| General | 常规 | 分类 |
| Security | 安全 | 分类 |
| Preferences | 偏好设置 | 分类 |
| Interface Settings | 界面设置 | 界面设置 |
| Customize your interface experience | 自定义您的界面体验 | 界面描述 |
| Dark Mode | 深色模式 | 主题 |
| Use dark theme | 使用深色主题界面 | 主题描述 |
| Language | 语言 | 语言设置 |
| Timezone | 时区 | 时区设置 |
| Saving... | 保存中... | 保存状态 |
| Sending... | 发送中... | 发送状态 |
| Update your personal information | 更新您的个人信息 | 个人资料描述 |
| Password Settings | 密码设置 | 密码设置 |
| Update your password | 更新您的登录密码 | 密码设置描述 |
| Update Password | 更新密码 | 更新密码 |
| Updating... | 更新中... | 更新状态 |
| Two-factor Authentication | 双因素认证 | 2FA |
| Add extra security to your account | 为您的账户添加额外的安全保护 | 2FA 描述 |
| Use an authenticator app to generate verification codes | 使用手机应用生成验证码 | 2FA 应用 |
| Coming soon | 此功能即将推出 | 即将推出 |
| Password updated successfully | 密码已更新 | 密码更新成功 |
| Failed to update password | 更新密码失败 | 密码更新失败 |
| Account Information | 账户信息 | 账户信息 |
| Your account details | 您的账户详细信息 | 账户信息描述 |
| User ID | 用户ID | 用户ID |
| Account Type | 账户类型 | 账户类型 |
| Registration Time | 注册时间 | 注册时间 |
| Account Status | 账户状态 | 账户状态 |
| Active | 活跃 | 活跃状态 |
| Disabled | 已禁用 | 禁用状态 |
| Standard | 标准 | 标准账户 |
| Simplified Chinese | 简体中文 | 语言 |
| English | English | 语言 |
| Beijing Time | 北京时间 | 时区 |
| Timezone updated | 时区已更新 | 时区更新 |
| No changes to save | 没有需要保存的更改 | 无更改 |
| Verification email sent, please check your inbox | 验证邮件已发送，请检查您的邮箱 | 验证邮件发送 |
| Email Status | 邮箱状态 | 邮箱状态 |
| Verified | 已验证 | 已验证 |
| Unverified | 未验证 | 未验证 |
| Resend verification email | 重新发送验证邮件 | 重发按钮 |
| Resend in {seconds}s | {seconds}秒后可重发 | 冷却时间 |
| Verification email sent! Please check your inbox. | 验证邮件已发送!请查收邮箱。 | 验证邮件发送成功 |
| Check your spam folder if you don't see it. | 如果没有收到,请检查垃圾邮件文件夹。 | 垃圾邮件提示 |
| Too many requests. Please try again later. | 请求过于频繁,请稍后再试。 | 频率限制 |
| Your email is already verified. | 您的邮箱已经验证过了。 | 已验证提示 |
| Failed to send verification email. Please try again. | 发送验证邮件失败,请重试。 | 发送失败 |
| Managed by {provider} | 由 {provider} 管理 | OAuth 管理 |

### 时区列表
| 英文 | 中文 |
|------|------|
| UTC | UTC (协调世界时) |
| Beijing Time (Shanghai) | 北京时间 (上海) |
| Tokyo | 东京时间 |
| Singapore | 新加坡时间 |
| Seoul | 首尔时间 |
| Dubai | 迪拜时间 |
| Kolkata | 加尔各答时间 (印度) |
| London | 伦敦时间 |
| Paris | 巴黎时间 |
| Berlin | 柏林时间 |
| Moscow | 莫斯科时间 |
| Rome | 罗马时间 |
| Madrid | 马德里时间 |
| New York | 纽约时间 |
| Chicago | 芝加哥时间 |
| Denver | 丹佛时间 |
| Los Angeles | 洛杉矶时间 |
| Toronto | 多伦多时间 |
| Vancouver | 温哥华时间 |
| Sao Paulo | 圣保罗时间 |
| Sydney | 悉尼时间 |
| Melbourne | 墨尔本时间 |
| Auckland | 奥克兰时间 |

---

## 📦 其他模块

### 产品对比页面 (Comparison)
| 英文 | 中文 | 说明 |
|------|------|------|
| Comparison Not Found | 未找到对比 | 404 页面 |

### 对比页面 (Versus)
| 英文 | 中文 | 说明 |
|------|------|------|
| Not Found | 未找到 | 404 页面 |

---

## 🔧 配置文件

### 环境变量 (Environment Variables)

#### 服务器端变量
| 变量名 | 说明 | 示例 |
|--------|------|------|
| BETTER_AUTH_SECRET | Better Auth 密钥 (至少32字符) | `your-secure-random-secret-key` |
| BETTER_AUTH_URL | Better Auth URL | `http://localhost:3000` |
| GA_MEASUREMENT_ID | Google Analytics ID | `G-XXXXXXXXXX` |
| GITHUB_CLIENT_ID | GitHub OAuth Client ID | `gh_client_id` |
| GITHUB_CLIENT_SECRET | GitHub OAuth Client Secret | `gh_client_secret` |
| GOOGLE_CLIENT_ID | Google OAuth Client ID | `google_client_id` |
| GOOGLE_CLIENT_SECRET | Google OAuth Client Secret | `google_client_secret` |
| RESEND_API_KEY | Resend API 密钥 | `$KNOWHERE_API_KEY` |
| RESEND_FROM | Resend 发件人邮箱 | `onboarding@resend.dev` |
| NODE_ENV | 环境 | `development` / `production` |
| HTTPS_PROXY | HTTPS 代理 (可选) | - |
| HTTP_PROXY | HTTP 代理 (可选) | - |

#### 客户端变量 (NEXT_PUBLIC_*)
| 变量名 | 说明 | 示例 |
|--------|------|------|
| NEXT_PUBLIC_API_URL | 后端 API 地址 | `http://218.17.187.47:5005/api` |
| NEXT_PUBLIC_AUTH_BASE_URL | 认证 API 路径 | `/api/auth` |
| NEXT_PUBLIC_APP_URL | 应用 URL | `http://localhost:3000` |
| NEXT_PUBLIC_POSTHOG_KEY | PostHog 公钥 (可选) | `phc_xxx` |
| NEXT_PUBLIC_POSTHOG_HOST | PostHog 主机 | `https://app.posthog.com` |
| NEXT_PUBLIC_DEFAULT_API_PASSWORD | 默认 API 密码 | `DefaultPass123!@#` |

---

## 📝 代码注释

### 组件注释 (Component Comments)

#### 通用组件
- `EmptyState` - 空状态组件
- `ErrorBoundary` - 错误边界组件
- `LoadingSpinner` - 加载旋转器组件

#### UI 组件 (shadcn/ui)
- `Accordion` - 手风琴组件
- `AlertDialog` - 对话框组件
- `Alert` - 警告组件
- `AspectRatio` - 宽高比组件
- `Avatar` - 头像组件
- `Badge` - 徽章组件
- `Breadcrumb` - 面包屑组件
- `ButtonGroup` - 按钮组组件
- `Calendar` - 日历组件
- `Card` - 卡片组件
- `Carousel` - 轮播组件
- `Chart` - 图表组件
- `Checkbox` - 复选框组件
- `Collapsible` - 折叠组件
- `Command` - 命令面板组件
- `ContextMenu` - 上下文菜单组件
- `Dialog` - 对话框组件
- `Drawer` - 抽屉组件
- `DropdownMenu` - 下拉菜单组件
- `Empty` - 空组件
- `Field` - 字段组件
- `Form` - 表单组件
- `HoverCard` - 悬停卡片组件
- `InputGroup` - 输入组组件
- `InputOTP` - OTP 输入组件
- `Input` - 输入框组件
- `Item` - 项目组件
- `Kbd` - 键盘按键组件
- `Label` - 标签组件
- `Menubar` - 菜单栏组件
- `NavigationMenu` - 导航菜单组件
- `Pagination` - 分页组件
- `Popover` - 弹出框组件
- `Progress` - 进度组件
- `RadioGroup` - 单选组组件
- `Resizable` - 可调整大小组件
- `ScrollArea` - 滚动区域组件
- `Select` - 选择组件
- `Separator` - 分隔符组件
- `Sheet` - 电子表格组件
- `Sidebar` - 侧边栏组件
- `Skeleton` - 骨架屏组件
- `Slider` - 滑块组件
- `Sonner` - 提示组件
- `Spinner` - 旋转器组件
- `Switch` - 开关组件
- `Table` - 表格组件
- `Tabs` - 标签页组件
- `Textarea` - 多行文本组件
- `ToggleGroup` - 切换组组件
- `Toggle` - 切换组件
- `Tooltip` - 工具提示组件

#### 功能组件
- `LanguageSwitcher` - 语言切换组件
- `ThemeProvider` - 主题提供者组件
- `ThemeToggle` - 主题切换按钮组件

#### 布局组件
- `Navbar` - 导航栏组件
- `Footer` - 页脚组件
- `HeroSection` - 首屏区域组件
- `ScrollProgressBar` - 滚动进度条组件

#### 产品对比组件
- `ProductComparison` - 产品对比组件
- `ComparisonTabs` - 对比标签页组件
- `ComparisonCardStack` - 对比卡片堆叠组件
- `ComparisonCoverflow` - 对比流媒体组件
- `ComparisonGrid` - 对比网格组件
- `ComparisonSlider` - 对比滑块组件

#### 数据可视化组件
- `DataTransformationViz` - 数据转换可视化组件
- `EnhancedCapabilities` - 增强功能组件
- `SupportedFormats` - 支持格式组件
- `CodeDemo` - 代码演示组件
- `OpenClawPluginSection` - OpenClaw 插件区域组件

#### 营销组件
- `CTASection` - 行动号召区域组件
- `PricingSection` - 定价区域组件
- `CommunitySection` - 社区区域组件
- `TrustIndicators` - 信任指标组件
- `AdvantageDescription` - 优势描述组件

---

## 📊 项目统计

### 页面数量
- **认证页面**: 6 个
- **仪表板页面**: 7 个
- **营销页面**: 5 个
- **API 路由**: 3 个

### 组件数量
- **UI 组件**: 40+ 个
- **功能组件**: 10+ 个
- **布局组件**: 6 个

### 支持语言
- **英语**: en
- **中文**: zh

### 时区支持
- **总计**: 23 个时区

---

## 📖 使用说明

### 添加新文案
1. 在 `i18n/locales/en.json` 中添加英文文案
2. 在 `i18n/locales/zh.json` 中添加对应的中文文案
3. 使用 `useTranslations` Hook 在组件中引用

### 示例
```tsx
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("MySection");
  
  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

### 国际化配置
- 配置文件: `i18n/request.ts`
- 路由配置: `i18n/routing.ts`
- 语言切换: `providers/config-provider.tsx`

---

## 🎨 设计系统

### 像素风格 (Pixel Art)
- **背景色**: `--pixel-bg`
- **前景色**: `--pixel-fg`
- **边框色**: `--pixel-border`
- **阴影**: `--pixel-shadow`
- **强调色**: `--pixel-green`
- ** muted色**: `--pixel-muted`

### 字体
- **主字体**: Inter
- **像素字体**: Press Start 2P
- **代码字体**: ui-monospace

---

## 📚 相关文档

- [Next.js Architecture](docs/nextjs-architecture.md)
- [README](README.md)
- [Production Deployment Guide](README.md#生产环境部署指南-production-deployment-guide)

---

**最后更新**: 2026-04-13
