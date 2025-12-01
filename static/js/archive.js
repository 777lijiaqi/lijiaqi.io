/* --- static/js/archive.js --- */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Archive.js: System Online.");

    /* --- 1. 文档数据源 --- */
    const documents = [
        {
            title: "Makefile 构建指南",
            category: "linux", 
            desc: "深入理解 Makefile 编译原理、规则、伪目标及常用函数。",
            tags: ["Makefile", "GCC"],
            icon: "fas fa-file-code",
            // 【关键修改】在链接后追加 ?from=linux，告诉详情页我是从 linux 分类来的
            link: "linux/Makefile学习.html?from=linux" 
        },
        {
            title: "STM32 HAL库开发",
            category: "stm32",
            desc: "基于 STM32H7 的外设驱动开发。",
            tags: ["Embedded", "ARM"],
            icon: "fas fa-microchip",
            link: "stm32/index.html?from=stm32"
        },
        {
            title: "C语言指针详解",
            category: "c/cpp", // 您指定的 c/cpp 参数
            desc: "深度解析指针数组与内存管理。",
            tags: ["C/C++", "Memory"],
            icon: "fas fa-code",
            link: "lang/pointer.html?from=c/cpp" // 注意这里传参
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
            listContainer.innerHTML = `<div style="text-align:center; color:#64748b; padding:2rem; font-family:'Fira Code'">SYSTEM: No Data Found.</div>`;
            if(countLabel) countLabel.innerText = 0;
            return;
        }

        if(countLabel) countLabel.innerText = data.length;

        data.forEach((doc, index) => {
            const card = document.createElement('a');
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

    /* --- 5. 更新 URL 地址栏 (不刷新页面) --- */
    function updateUrl(cat) {
        // 使用 encodeURIComponent 处理 c/cpp 这种含特殊字符的参数
        const newUrl = `${window.location.pathname}?cat=${encodeURIComponent(cat)}`;
        window.history.pushState({path: newUrl}, '', newUrl);
    }

    /* --- 6. 事件监听 --- */
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            catBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.getAttribute('data-category');
            
            // 立即筛选
            filterDocuments();
            // 立即更新 URL
            updateUrl(currentCategory);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            filterDocuments();
        });
    }

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(styleSheet);

    /* --- 7. 初始化 (处理 URL 参数) --- */
    const urlParams = new URLSearchParams(window.location.search);
    const targetCategory = urlParams.get('cat');

    // 注意：如果是 c/cpp，URL中可能是 c%2Fcpp，get会自动解码，所以这里不需要额外操作
    const safeCategory = targetCategory ? targetCategory.toLowerCase() : 'all';

    console.log("初始化筛选参数:", safeCategory);
    currentCategory = safeCategory;

    catBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category').toLowerCase() === safeCategory) {
            btn.classList.add('active');
        }
    });

    filterDocuments();
});
