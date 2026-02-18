# GitHub 提交代码指南

由于您的终端环境似乎暂时无法识别 `git` 命令，最简单的方法是直接使用编辑器（Trae/VS Code）自带的图形化界面来提交代码。

## 方法一：使用编辑器左侧的“源代码管理” (推荐)

这是最快捷的方式，不需要输入任何命令。

1.  **打开源代码管理面板**
    *   查看编辑器最左侧的图标栏。
    *   点击 **“源代码管理” (Source Control)** 图标（通常是一个分叉的树枝图标 <svg viewBox="0 0 16 16" width="16" height="16" style="display:inline-block;vertical-align:middle"><path fill="currentColor" d="M9.5 9a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM7 9a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"></path></svg>）。
    *   或者使用快捷键 `Ctrl + Shift + G`。

2.  **暂存更改 (Stage Changes)**
    *   在面板中，您会看到 **“更改” (Changes)** 列表，其中包含我为您修改的文件（如 `vite.config.ts`, `src/services/ai.ts` 等）。
    *   将鼠标悬停在 **“更改”** 标题栏上，点击右侧出现的 **`+`** 号（**暂存所有更改**）。
    *   或者逐个点击文件旁边的 `+` 号。

3.  **提交 (Commit)**
    *   在面板顶部的输入框中，输入提交信息，例如：
        > 修复 DeepSeek API 配置，增加生产环境代理，重置存储配置
    *   点击输入框上方的 **“提交” (Commit)** 按钮（通常是一个打钩 `√` 图标或直接叫“提交”）。

4.  **推送 (Push)**
    *   提交完成后，您会看到一个 **“同步更改” (Sync Changes)** 按钮（通常是蓝色的）。
    *   点击它，确认推送。
    *   或者点击面板右上角的三个点 `...`，选择 **“推送” (Push)**。

---

## 方法二：使用 GitHub Desktop (如果您已安装)

如果您电脑上安装了 [GitHub Desktop](https://desktop.github.com/)：

1.  打开 **GitHub Desktop**。
2.  确保当前仓库已选中 `resumai` (或您的项目名)。
3.  您会在左侧看到所有修改过的文件。
4.  在左下角的输入框中填写 **Summary**（例如“Fix API Config”）。
5.  点击蓝色的 **Commit to main** 按钮。
6.  点击顶部工具栏的 **Push origin**。

---

## 下一步

完成推送后：

1.  前往 **Vercel 控制台** (vercel.com)，您应该能看到一个新的部署 (Deployment) 正在构建中。
2.  等待构建完成（状态变为 Ready）。
3.  再次访问您的网站 `https://www.resumai.xin`。
4.  **强制刷新页面** (Ctrl + F5) 以确保加载最新代码。
5.  再次尝试“一键优化”功能，问题应该已解决。
