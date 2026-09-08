# Linux 驱动导师 Agent Skill (linux-driver-mentor)

本目录存储了经过工程验证的嵌入式 Linux 设备驱动进阶导师 AI 智能体扩展技能包（Skill），采用 7-Zip (`.7z`) 高压缩比格式打包。支持各类支持 Agent Skills 规范的 AI Coding 编程助手（如 Google Antigravity、Claude Code 等）。

---

## 📦 技能包下载

- **下载文件**：[`linux-driver-mentor.7z`](./linux-driver-mentor.7z)
- **文件大小**：~6.2 KB
- **核心能力**：
  - 深度指导 Linux 总线模型（Platform、I2C、SPI、Input 子系统等）；
  - Linux 4.1.15 / 现代内核 API 零截断逐行源码拆解与参数解析；
  - 并发保护（自旋锁/互斥锁/原子操作）、工作队列与定时器消抖防御性编码审查；
  - 知识总结与学习讲义生成。

---

## 🚀 解压与部署指引

### 全局安装（推荐）

将下载的 `linux-driver-mentor.7z` 解压至个人主目录下的 `.agents/skills` 目录中：

```bash
# 确保全局技能目录存在
mkdir -p ~/.agents/skills

# 解压技能包
7z x linux-driver-mentor.7z -o~/.agents/skills/
```

解压后目录结构如下：
```text
~/.agents/skills/linux-driver-mentor/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── curriculum.md
    ├── progress-schema.md
    └── review-rubric.md
```

### 项目工作区安装

如果仅在特定驱动开发仓库中使用：

```bash
cd /path/to/your/driver-project
mkdir -p .agents/skills
7z x /path/to/linux-driver-mentor.7z -o.agents/skills/
```

---

## 🔍 唤起验证

在支持 Agent Skills 的 AI 交互环境中输入：

```text
请使用 linux-driver-mentor 技能指导我开发 Platform 按键驱动
```
