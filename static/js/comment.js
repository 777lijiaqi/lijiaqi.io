/* --- static/js/comment.js --- */
/* 自动挂载 Giscus 评论区 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Comment.js: 正在尝试加载评论区...");

    // 1. 寻找挂载点：文章页面的 <article> 标签
    const article = document.querySelector('article');
    
    // 如果没找到 article 标签，说明不是文章页，直接退出
    if (!article) {
        console.log("Comment.js: 未检测到 <article> 标签，停止加载。");
        return;
    }

    // 2. 创建评论区容器
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comments-section';
    commentDiv.style.marginTop = '4rem'; // 增加一些间距
    commentDiv.style.paddingTop = '2rem';
    commentDiv.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
    
    // 添加标题
    commentDiv.innerHTML = `<h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 1rem;"><i class="fas fa-comments"></i> Discussion</h3>`;
    // 3. 创建 Giscus 脚本
    const script = document.createElement('script');
    script.src = "https://giscus.app/client.js";
    
    // --- 👇👇👇 请在这里填入您在 Giscus 官网获取的真实数据 👇👇👇 ---
    script.setAttribute("data-repo", "777lijiaqi/lijiaqi.io"); 
    script.setAttribute("data-repo-id", "R_kgDOQeiAAA"); 
    script.setAttribute("data-category", "General"); // 或者您选择的其他分类
    script.setAttribute("data-category-id", "DIC_kwDOQeiAAM4CzRrj"); 
    // -----------------------------------------------------------------

    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "transparent_dark"); // 适配您的赛博朋克风
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    // 4. 处理加载错误
    script.onerror = function() {
        console.error("Comment.js: Giscus 脚本加载失败，请检查网络或配置。");
        commentDiv.innerHTML += `<p style="color:red">评论区加载失败 (Network Error)</p>`;
    };

    // 5. 插入到页面
    commentDiv.appendChild(script);
    article.appendChild(commentDiv);
    
    console.log("Comment.js: 评论区挂载成功！");
});
