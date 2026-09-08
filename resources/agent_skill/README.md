# Agent Skills 智能体技能包仓库

本目录存储了经过精心设计与工程验证的 AI 智能体扩展技能包（Skills），采用 7-Zip (`.7z`) 高压缩比格式打包。支持各大主流具备 Agent Skills 规范的 AI Coding 编程助手（如 Google Antigravity、Claude Code、Agentic Workspaces 等）。

---

## 📦 技能包清单与下载

| 技能名称 | 压缩包文件名 | 描述与核心能力 | 压缩包大小 |
| :--- | :--- | :--- | :--- |
| **Linux 驱动导师** | [`linux-driver-mentor.7z`](./linux-driver-mentor.7z) | 嵌入式 Linux 设备驱动进阶导师，支持总线模型解析、API 零截断源码拆解、并发/电源管理防御性编码审查及学习讲义生成。 | ~6.2 KB |
| **HWPOD 节点管理** | [`hwpod-node-skill.7z`](./hwpod-node-skill.7z) | HWPOD-NODE 硬件测试与边缘节点管理，支持节点注册、交叉编译、固件远程下载、串口通信与诊断排错。 | ~1.3 KB |
| **全技能整合包** | [`agent-skills-bundle.7z`](./agent-skills-bundle.7z) | 包含上述全部 Agent Skills 的整合归档包，支持一键部署至个人全局或工作区技能库。 | ~7.1 KB |

---

## 🚀 安装与部署指引

### 方法一：全局安装（推荐）

将下载的 `.7z` 压缩包解压至用户主目录下的 `.agents/skills` 目录中：

```bash
# 1. 确保全局技能目录存在
mkdir -p ~/.agents/skills

# 2. 解压技能包（以 linux-driver-mentor 为例）
7z x linux-driver-mentor.7z -o~/.agents/skills/

# 或者直接解压全集包：
7z x agent-skills-bundle.7z -o~/.agents/skills/
```

### 方法二：项目工作区安装

如果仅希望在特定工程或仓库中使用该技能，可直接解压至项目根目录的 `.agents/skills` 路径：

```bash
cd /path/to/your/project
mkdir -p .agents/skills
7z x /path/to/linux-driver-mentor.7z -o.agents/skills/
```

---

## 🔍 验证生效

部署完成后，在支持 Agent Skills 的 AI 终端中输入或询问：

```text
请列出当前已加载的 Agent Skills
```

或直接唤起技能：
- 唤起驱动导师：`请使用 linux-driver-mentor 技能指导我开发 Platform 驱动`
- 唤起节点管理：`请使用 hwpod-node-skill 技能检查我的 HWPOD-NODE 运行状态`
