/* --- static/js/archive.js --- */

// 等待 HTML 加载完成后再执行 JS (这是关键修复！！！)
document.addEventListener('DOMContentLoaded', function() {
    
    console.log("Archive.js: 页面加载完成，脚本启动...");

    /* --- 1. 文档数据源 --- */
    const documents = [
        {
            title: "Makefile 构建指南",
            category: "LINUX",
            desc: "深入理解 Makefile 编译原理、规则、伪目标及常用函数。",
            tags: ["Makefile", "GCC"],
            icon: "fas fa-file-code",
            link: "linux/Makefile学习.html"
        },
        {
            title: "STM32 HAL库开发",
            category: "STM32",
            desc: "基于 STM32H7 的外设驱动开发。",
            tags: ["Embedded", "ARM"],
            icon: "fas fa-microchip",
            link: "stm32/index.html"
        },
        {
            title: "C语言指针详解",
            category: "C/C++",
            desc: "深度解析指针数组与内存管理。",
            tags: ["C/C++", "Memory"],
            icon: "fas fa-code",
            link: "lang/pointer.html"
        }
    ];

    /* --- 2. 获取 DOM 元素 --- */
    const listContainer = document.getElementById('document-list');
    const countLabel = document.getElementById('doc-count');
    const searchInput = document.getElementById('search-input');
    const catBtns = document.querySelectorAll('.cat-btn');

    // 调试：检查是否找到了按钮
    if (catBtns.length === 0) {
        console.error("严重错误：JS 没有找到 class 为 'cat-btn' 的按钮！请检查 archive.html 的写法。");
        return; // 找不到按钮就停止运行
    } else {
        console.log(`成功找到 ${catBtns.length} 个分类按钮。`);
    }

    // 全局状态变量
    let currentCategory = 'all';
    let currentSearch = '';

    /* --- 3. 渲染函数 --- */
    function renderList(data) {
        listContainer.innerHTML = ''; // 清空
        
        if (data.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; color:#64748b; padding:2rem;">未找到相关文档 / No Data</div>`;
            if(countLabel) countLabel.innerText = 0;
            return;
        }

        if(countLabel) countLabel.innerText = data.length;

        data.forEach((doc, index) => {
            const card = document.createElement('a');
            card.href = doc.link;
            card.className = 'doc-item';
            // 简单的淡入动画
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
        console.log(`执行筛选 -> 分类: [${currentCategory}] | 关键词: [${currentSearch}]`);

        const filtered = documents.filter(doc => {
            const matchCat = (currentCategory === 'all') || (doc.category === currentCategory);
            const term = currentSearch.toLowerCase().trim();
            const matchSearch = doc.title.toLowerCase().includes(term) || 
                                doc.desc.toLowerCase().includes(term);
            return matchCat && matchSearch;
        });

        renderList(filtered);
    }

    /* --- 5. 事件监听绑定 --- */
    
    // 按钮点击事件
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log("按钮被点击:", this.innerText);

            // 1. 移除所有 active
            catBtns.forEach(b => b.classList.remove('active'));
            // 2. 激活当前
            this.classList.add('active');
            
            // 3. 更新状态
            currentCategory = this.getAttribute('data-category');
            
            // 4. 重新筛选
            filterDocuments();
        });
    });

    // 搜索框输入事件
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            filterDocuments();
        });
    }

    // 注入动画 CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleSheet);

    /* --- 6. 初始化 (处理 URL 参数) --- */
    const urlParams = new URLSearchParams(window.location.search);
    const targetCategory = urlParams.get('cat');

    if (targetCategory && targetCategory !== 'all') {
        console.log("检测到 URL 参数:", targetCategory);
        currentCategory = targetCategory;
        // 同步按钮高亮
        catBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === targetCategory) {
                btn.classList.add('active');
            }
        });
    }

    // 首次渲染
    filterDocuments();
});
