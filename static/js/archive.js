/* --- static/js/archive.js --- */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Archive.js: System Online.");

    /* --- 1. 文档数据源 --- */
    // 【修改点】：link 字段只写纯净路径，不要带参数，参数由 JS 动态生成
    const documents = [
        {
            title: "Makefile 构建指南",
            category: "linux", 
            desc: "深入理解 Makefile 编译原理、规则、伪目标及常用函数。",
            tags: ["Makefile", "GCC"],
            icon: "fas fa-file-code",
            link: "linux/Makefile学习.html" // 纯净路径
        },
        {
            title: "STM32 HAL库开发",
            category: "stm32",
            desc: "基于 STM32H7 的外设驱动开发。",
            tags: ["Embedded", "ARM"],
            icon: "fas fa-microchip",
            link: "stm32/index.html"
        },
        {
            title: "C语言指针详解",
            category: "c/cpp", // 对应 c/cpp
            desc: "深度解析指针数组与内存管理。",
            tags: ["C/C++", "Memory"],
            icon: "fas fa-code",
            link: "lang/pointer.html"
        },
        {
            title: "Altium Designer 实战",
            category: "hardware",
            desc: "PCB 多层板设计技巧。",
            tags: ["PCB", "Hardware"],
            icon: "fas fa-layer-group",
            link: "hardware/pcb.html"
        }
    ];

    /* --- 2. 获取 DOM 元素 --- */
    const listContainer = document.getElementById('document-list');
    const countLabel = document.getElementById('doc-count');
    const searchInput = document.getElementById('search-input');
    const catBtns = document.querySelectorAll('.cat-btn');

    let currentCategory = 'all';
    let currentSearch = '';

    /* --- 3. 渲染函数 (动态生成 from 参数) --- */
    function renderList(data) {
        listContainer.innerHTML = '';
        
        if (data.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; color:#64748b; padding:2rem; font-family:'Fira Code'">SYSTEM: No Data Found.</div>`;
            if(countLabel) countLabel.innerText = 0;
            return;
        }

        if(countLabel) countLabel.innerText = data.length;

        data.forEach((doc, index) => {
            const card = document.createElement('a');
            
            // 【核心修改逻辑】：动态拼接 from 参数
            // 如果当前在 "all" 分类下，就传 from=all
            // 如果当前在 "linux" 分类下，就传 from=linux
            // encodeURIComponent 用于处理 c/cpp 这种特殊字符
            const dynamicLink = `${doc.link}?from=${encodeURIComponent(currentCategory)}`;
            
            card.href = dynamicLink;
            card.className = 'doc-item';
            card.style.opacity = '0';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;

            const tagsHtml = doc.tags.map(tag => `<span class="doc-tag">#${tag}</span>`).join('');

            card.innerHTML = `
                <div class="doc-icon"><i class="${doc.icon}"></i></div>
                <div class="doc-content">
                    <div class="doc-title">${doc.title}</div>
                    <div class="doc-desc">${doc.desc}</div>
                    <div class="doc-tags">${tagsHtml}</div>
                </div>
                <div class="doc-arrow"><i class="fas fa-chevron-right"></i></div>
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

        // 筛选完数据后，重新渲染列表 (此时 renderList 会使用最新的 currentCategory 生成链接)
        renderList(filtered);
    }

    /* --- 5. 更新浏览器地址栏 (不刷新页面) --- */
    function updateUrl(cat) {
        // 使用 HTML5 History API 修改 URL
        if (history.pushState) {
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?cat=${encodeURIComponent(cat)}`;
            window.history.pushState({path:newUrl},'',newUrl);
        }
    }

    /* --- 6. 事件监听 --- */
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            catBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新当前分类变量
            currentCategory = this.getAttribute('data-category');
            
            // 1. 改变地址栏参数 (解决您的问题：点击按钮 URL 没变)
            updateUrl(currentCategory);
            
            // 2. 重新筛选并渲染列表 (解决您的问题：卡片链接根据当前筛选状态生成)
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
