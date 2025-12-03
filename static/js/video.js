/* --- static/js/video.js --- */

document.addEventListener('DOMContentLoaded', function () {
    console.log("Video.js: System Online.");

    /* --- 1. 视频数据源 --- */
    // 这里可以添加您的视频数据
    const documents = [
        {
            title: "Shell 脚本自动化实战",
            category: "linux",
            desc: "演示如何编写一个自动备份系统的 Shell 脚本，包含定时任务设置。",
            tags: ["Shell", "Automation", "Demo"],
            icon: "fas fa-play-circle",
            link: "linux/shell_demo_video.html" // 指向具体的视频播放页
        },
        {
            title: "STM32 HAL库开发入门",
            category: "stm32",
            desc: "从零开始搭建 STM32CubeMX 工程，点亮第一个 LED。",
            tags: ["STM32", "HAL", "Tutorial"],
            icon: "fas fa-microchip",
            link: "stm32/hal_intro_video.html"
        }
    ];


    /* --- 2. 获取 DOM 元素 --- */
    const listContainer = document.getElementById('document-list');
    const countLabel = document.getElementById('doc-count');
    const searchInput = document.getElementById('search-input');
    const catBtns = document.querySelectorAll('.cat-btn');

    let currentCategory = 'all';
    let currentSearch = '';

    /* --- 3. 渲染函数 --- */
    function renderList(data) {
        listContainer.innerHTML = '';

        if (data.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; color:#64748b; padding:2rem; font-family:'Fira Code'">SYSTEM: No Video Found.</div>`;
            if (countLabel) countLabel.innerText = 0;
            return;
        }

        if (countLabel) countLabel.innerText = data.length;

        data.forEach((doc, index) => {
            const card = document.createElement('a');

            // 动态拼接参数
            const dynamicLink = `${doc.link}?from=${encodeURIComponent(currentCategory)}`;

            card.href = dynamicLink;
            card.className = 'doc-item'; // 复用 archive.css 的样式
            card.style.opacity = '0';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;

            const tagsHtml = doc.tags.map(tag => `<span class="doc-tag">#${tag}</span>`).join('');

            card.innerHTML = `
                <div class="doc-icon"><i class="${doc.icon}" style="color: var(--accent);"></i></div>
                <div class="doc-content">
                    <div class="doc-title">${doc.title}</div>
                    <div class="doc-desc">${doc.desc}</div>
                    <div class="doc-tags">${tagsHtml}</div>
                </div>
                <div class="doc-arrow"><i class="fas fa-play"></i></div>
            `;
            listContainer.appendChild(card);
        });
    }

    /* --- 4. 筛选核心逻辑 --- */
    function filterDocuments() {
        const filtered = documents.filter(doc => {
            const docCat = doc.category.toLowerCase();
            const curCat = currentCategory.toLowerCase();
            const matchCat = (curCat === 'all') || (docCat === curCat);

            const term = currentSearch.toLowerCase().trim();
            const matchSearch = doc.title.toLowerCase().includes(term) ||
                doc.desc.toLowerCase().includes(term);

            return matchCat && matchSearch;
        });

        renderList(filtered);
    }

    /* --- 5. 更新浏览器地址栏 --- */
    function updateUrl(cat) {
        if (history.pushState) {
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?cat=${encodeURIComponent(cat)}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    }

    /* --- 6. 事件监听 --- */
    catBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            catBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentCategory = this.getAttribute('data-category');
            updateUrl(currentCategory);
            filterDocuments();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            filterDocuments();
        });
    }

    // 注入动画 CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(styleSheet);

    /* --- 7. 初始化 --- */
    const urlParams = new URLSearchParams(window.location.search);
    const targetCategory = urlParams.get('cat') ? urlParams.get('cat').toLowerCase() : 'all';

    console.log("初始化筛选参数:", targetCategory);
    currentCategory = targetCategory;

    catBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category').toLowerCase() === targetCategory) {
            btn.classList.add('active');
        }
    });

    filterDocuments();
});
