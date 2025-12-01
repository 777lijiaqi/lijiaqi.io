/* --- static/js/archive.js --- */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Archive.js: System Online.");

    /* --- 1. 文档数据源 (Database) --- */
    // 关键修改：category 字段全部改为小写，C/C++ 改为 cpp
    const documents = [
        {
            title: "Makefile 构建指南",
            category: "linux",
            desc: "深入理解 Makefile 编译原理、规则、伪目标及常用函数。",
            tags: ["Makefile", "GCC"],
            icon: "fas fa-file-code",
            link: "../archive/linux/Makefile学习.html" // 注意：这里通常需要相对 archive.html 的路径，或者绝对路径
        },
        {
            title: "STM32 HAL库开发",
            category: "stm32",
            desc: "基于 STM32H7 的外设驱动开发。",
            tags: ["Embedded", "ARM"],
            icon: "fas fa-microchip",
            link: "../archive/stm32/index.html"
        },
        {
            title: "C语言指针详解",
            category: "cpp",
            desc: "深度解析指针数组与内存管理。",
            tags: ["C/C++", "Memory"],
            icon: "fas fa-code",
            link: "../archive/lang/pointer.html"
        }
        // 您可以在此继续添加更多...
    ];

    /* --- 2. 获取 DOM 元素 --- */
    const listContainer = document.getElementById('document-list');
    const countLabel = document.getElementById('doc-count');
    const searchInput = document.getElementById('search-input');
    const catBtns = document.querySelectorAll('.cat-btn');

    // 全局状态
    let currentCategory = 'all';
    let currentSearch = '';

    /* --- 3. 渲染函数 --- */
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
            // 修正链接逻辑：如果 doc.link 是相对路径，确保它能正确跳转
            card.href = doc.link; 
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
            // 统一转小写比较，确保匹配
            const docCat = doc.category.toLowerCase();
            const curCat = currentCategory.toLowerCase();
            
            // 匹配分类
            const matchCat = (curCat === 'all') || (docCat === curCat);
            
            // 匹配搜索
            const term = currentSearch.toLowerCase().trim();
            const matchSearch = doc.title.toLowerCase().includes(term) || 
                                doc.desc.toLowerCase().includes(term);
            
            return matchCat && matchSearch;
        });

        renderList(filtered);
    }

    /* --- 5. 事件监听 --- */
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // UI 更新
            catBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 状态更新 (获取 HTML 里的 data-category)
            currentCategory = this.getAttribute('data-category');
            
            // 触发筛选
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

    /* --- 6. 初始化 (处理 URL 参数) --- */
    const urlParams = new URLSearchParams(window.location.search);
    // 获取参数并转小写
    const targetCategory = urlParams.get('cat') ? urlParams.get('cat').toLowerCase() : 'all';

    console.log("初始化筛选参数:", targetCategory);

    // 设置当前分类
    currentCategory = targetCategory;

    // 高亮对应按钮
    catBtns.forEach(btn => {
        btn.classList.remove('active');
        // 比较 data-category (转小写后比较)
        if (btn.getAttribute('data-category').toLowerCase() === targetCategory) {
            btn.classList.add('active');
        }
    });

    // 执行首次渲染
    filterDocuments();
});
