/* --- static/js/script.js --- */

/* --- 1. 配置区 --- */
const typingText = "Embedding intelligence into reality...";

/* --- 2. 核心逻辑 --- */

// --- 打字机效果 ---
const typeWriterElement = document.getElementById('typewriter');
let typeIndex = 0;

function typeWriter() {
    if (typeWriterElement && typeIndex < typingText.length) {
        typeWriterElement.innerHTML += typingText.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 100);
    }
}
window.addEventListener('load', typeWriter);

const article = document.querySelector('article');
    
    // 只有当页面存在 article 标签（即详情页）时才加载评论
    if (article) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comments-section';
        commentDiv.innerHTML = `<h3><i class="fas fa-comments"></i> Discussion</h3>`;
        
        const script = document.createElement('script');
        script.src = "https://giscus.app/client.js";
        script.setAttribute("data-repo", "777lijiaqi/lijiaqi.io");
        script.setAttribute("data-repo-id", "R_kgDOQeiAAA");
        script.setAttribute("data-category", "General");
        script.setAttribute("data-category-id", "DIC_kwDOQeiAAM4CzRrj");
        script.setAttribute("data-mapping", "pathname");
        script.setAttribute("data-strict", "0");
        script.setAttribute("data-reactions-enabled", "1");
        script.setAttribute("data-emit-metadata", "0");
        script.setAttribute("data-input-position", "top");
        script.setAttribute("data-theme", "transparent_dark"); // 赛博朋克风格
        script.setAttribute("data-lang", "zh-CN");
        script.setAttribute("data-loading", "lazy");
        script.setAttribute("crossorigin", "anonymous");
        script.async = true;

        commentDiv.appendChild(script);
        article.appendChild(commentDiv);
    }

// --- 页面跳转与滚动 (关键修改：增加 Hash 更新) ---
function scrollToSection(id) {
    const element = document.getElementById(id);
    if(element) {
        // 1. 平滑滚动
        const headerOffset = 80; // 导航栏高度补偿
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        // 2. 手动更新 URL 参数 (Hash)
        if(history.pushState) {
            history.pushState(null, null, '#' + id);
        }
    }
}

// --- 滚动监听 (Scroll Spy) & URL 自动更新 ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-btn');

window.addEventListener('scroll', () => {
    let current = '';
    
    // 遍历板块确定当前位置
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // -150 是为了提前一点触发
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    // 1. 导航栏高亮
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });

    // 2. 【核心新增】滚动时静默更新 URL Hash
    // 使用 replaceState 不会产生废弃的历史记录堆栈
    if (current && window.location.hash !== '#' + current) {
        if(history.replaceState) {
            history.replaceState(null, null, '#' + current);
        }
    }
});

// --- 页面加载时处理 Hash 定位 (解决导航栏遮挡问题) ---
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        const id = window.location.hash.substring(1); // 去掉 #
        setTimeout(() => {
            scrollToSection(id);
        }, 100); // 稍微延迟等待布局稳定
    }
});

// --- 滚动监听 (动画效果) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
