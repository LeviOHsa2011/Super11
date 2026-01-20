let tabIdCounter = 0;
const urlInput = document.getElementById('url-input');
const contentWrapper = document.getElementById('content-wrapper');
const tabBar = document.getElementById('tab-bar');

function createNewTab() {
    tabIdCounter++;
    const id = `tab-${tabIdCounter}`;

    // Tab Button
    const tabBtn = document.createElement('div');
    tabBtn.className = 'tab';
    tabBtn.id = `btn-${id}`;
    tabBtn.onclick = () => switchTab(id);
    tabBtn.innerHTML = `
        <span>Neuer Tab</span>
        <span class="close-btn" onclick="event.stopPropagation(); removeTab('${id}')">×</span>
    `;
    tabBar.insertBefore(tabBtn, document.getElementById('add-tab'));

    // View Container
    const container = document.createElement('div');
    container.className = 'view-container';
    container.id = `view-${id}`;
    container.innerHTML = `
        <div class="startpage" id="home-${id}">
            <h1 class="hero-title">SUPER11</h1>
            <input type="text" class="search-box" placeholder="Was willst du entdecken?" 
                   onkeypress="if(event.key === 'Enter') navigate('${id}', this.value)">
        </div>
        <iframe class="browser-frame" id="frame-${id}"></iframe>
    `;
    contentWrapper.appendChild(container);

    switchTab(id);
}

function switchTab(id) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));

    const activeBtn = document.getElementById(`btn-${id}`);
    const activeView = document.getElementById(`view-${id}`);
    
    if(activeBtn && activeView) {
        activeBtn.classList.add('active');
        activeView.classList.add('active');
        const frame = document.getElementById(`frame-${id}`);
        urlInput.value = (frame.style.display === 'block') ? frame.src : "";
    }
}

function navigate(id, query) {
    const home = document.getElementById(`home-${id}`);
    const frame = document.getElementById(`frame-${id}`);
    const tabBtnText = document.querySelector(`#btn-${id} span`);
    let url = query.trim();
    
    if (!url.includes('.') && !url.startsWith('http')) {
        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    } else if (!url.startsWith('http')) {
        url = 'https://' + url;
    }

    home.style.display = 'none';
    frame.style.display = 'block';
    frame.src = url;
    urlInput.value = url;
    tabBtnText.innerText = query.substring(0, 12) + (query.length > 12 ? '...' : '');
}

function removeTab(id) {
    const btn = document.getElementById(`btn-${id}`);
    const view = document.getElementById(`view-${id}`);
    
    if (btn.classList.contains('active')) {
        const next = btn.previousElementSibling || btn.nextElementSibling;
        if (next && next.id !== 'add-tab') switchTab(next.id.replace('btn-', ''));
    }
    
    btn.remove();
    view.remove();
    if (document.querySelectorAll('.tab').length === 0) createNewTab();
}

// Controls
function reloadPage() {
    const activeView = document.querySelector('.view-container.active .browser-frame');
    if (activeView) activeView.src = activeView.src;
}

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const activeContainer = document.querySelector('.view-container.active');
        if (activeContainer) {
            const id = activeContainer.id.replace('view-', '');
            navigate(id, urlInput.value);
        }
    }
});

// Init
createNewTab();