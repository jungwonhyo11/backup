/**
 * JungWon Agency Dashboard Extension
 * Paperclip + Hermes + Ganma4 통합 대시보드 UI
 */

class JungwonAgencyDashboard {
    constructor() {
        this.apiBase = 'http://127.0.0.1:3200/api';
        this.agencyStatus = {};
        this.taskQueue = [];
        this.metrics = {};
        this.init();
    }

    async init() {
        console.log('[JungWon Agency] Initializing dashboard...');
        this.createDashboardPanel();
        this.setupEventListeners();
        this.startStatusPolling();
    }

    createDashboardPanel() {
        const dashboardHTML = `
            <div id="jungwon-dashboard" class="jungwon-panel">
                <div class="jungwon-header">
                    <h2>🤖 JungWon Self-Improving AI Agency</h2>
                    <span class="close-btn">&times;</span>
                </div>
                
                <div class="jungwon-content">
                    <!-- 시스템 상태 -->
                    <div class="section health-section">
                        <h3>System Health</h3>
                        <div class="health-grid">
                            <div class="health-item">
                                <span class="label">Paperclip</span>
                                <span class="status" id="paperclip-status">●</span>
                            </div>
                            <div class="health-item">
                                <span class="label">Hermes</span>
                                <span class="status" id="hermes-status">●</span>
                            </div>
                            <div class="health-item">
                                <span class="label">Ganma4</span>
                                <span class="status" id="ganma4-status">●</span>
                            </div>
                        </div>
                    </div>

                    <!-- 에이전시 통계 -->
                    <div class="section stats-section">
                        <h3>Agency Statistics</h3>
                        <div class="stats-grid">
                            <div class="stat-box">
                                <div class="stat-value" id="total-tasks">0</div>
                                <div class="stat-label">Total Tasks</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-value" id="success-rate">0%</div>
                                <div class="stat-label">Success Rate</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-value" id="active-roles">0</div>
                                <div class="stat-label">Active Roles</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-value" id="knowledge-items">0</div>
                                <div class="stat-label">Knowledge Items</div>
                            </div>
                        </div>
                    </div>

                    <!-- 역할 관리 -->
                    <div class="section roles-section">
                        <h3>Agent Roles</h3>
                        <div id="roles-list" class="roles-list">
                            <!-- Dynamic content -->
                        </div>
                    </div>

                    <!-- 확장 기능 -->
                    <div class="section extensions-section">
                        <h3>Extensions</h3>
                        <div id="extensions-list" class="extensions-list">
                            <!-- Dynamic content -->
                        </div>
                    </div>

                    <!-- 작업 큐 -->
                    <div class="section tasks-section">
                        <h3>Task Queue</h3>
                        <div class="task-input">
                            <textarea id="task-input" placeholder="Enter new task description..."></textarea>
                            <select id="task-priority">
                                <option value="low">Low Priority</option>
                                <option value="normal" selected>Normal Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <button id="dispatch-task-btn">Dispatch Task</button>
                        </div>
                        <div id="task-queue" class="task-queue">
                            <!-- Dynamic content -->
                        </div>
                    </div>

                    <!-- 성과 분석 -->
                    <div class="section analysis-section">
                        <h3>Performance Analysis</h3>
                        <button id="analyze-btn" class="btn-analyze">Analyze Performance</button>
                        <div id="analysis-result" class="analysis-result">
                            <!-- Dynamic content -->
                        </div>
                    </div>

                    <!-- 자동 학습 루프 -->
                    <div class="section autolearn-section">
                        <h3>Self-Improvement Loop</h3>
                        <div class="loop-control">
                            <button id="start-loop-btn" class="btn-control btn-start">▶ Start Loop</button>
                            <button id="stop-loop-btn" class="btn-control btn-stop" disabled>⏹ Stop Loop</button>
                            <span id="loop-status" class="loop-status">Stopped</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const styleHTML = `
            <style>
                #jungwon-dashboard {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 500px;
                    max-height: 800px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    color: white;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    overflow: hidden;
                    z-index: 10000;
                }

                .jungwon-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    background: rgba(0,0,0,0.2);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .jungwon-header h2 {
                    margin: 0;
                    font-size: 16px;
                }

                .close-btn {
                    cursor: pointer;
                    font-size: 24px;
                    color: rgba(255,255,255,0.7);
                    transition: color 0.3s;
                }

                .close-btn:hover {
                    color: white;
                }

                .jungwon-content {
                    overflow-y: auto;
                    max-height: 750px;
                    padding: 20px;
                }

                .section {
                    margin-bottom: 20px;
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 8px;
                    backdrop-filter: blur(10px);
                }

                .section h3 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    text-transform: uppercase;
                    opacity: 0.8;
                }

                .health-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }

                .health-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 4px;
                    font-size: 12px;
                }

                .status {
                    font-size: 14px;
                    animation: pulse 2s infinite;
                }

                .status.online {
                    color: #4ade80;
                }

                .status.offline {
                    color: #ef4444;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }

                .stat-box {
                    background: rgba(0,0,0,0.3);
                    padding: 12px;
                    border-radius: 4px;
                    text-align: center;
                }

                .stat-value {
                    font-size: 20px;
                    font-weight: bold;
                }

                .stat-label {
                    font-size: 11px;
                    opacity: 0.7;
                    margin-top: 5px;
                }

                .roles-list, .extensions-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .role-item, .extension-item {
                    padding: 10px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 4px;
                    font-size: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .role-title {
                    font-weight: 600;
                }

                .task-input {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 10px;
                }

                textarea, select {
                    padding: 8px;
                    border: none;
                    border-radius: 4px;
                    font-family: inherit;
                    font-size: 12px;
                }

                textarea {
                    min-height: 60px;
                    resize: vertical;
                }

                button {
                    padding: 8px 12px;
                    border: none;
                    border-radius: 4px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.3s;
                }

                button:hover {
                    background: rgba(255,255,255,0.3);
                }

                button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .btn-start {
                    background: #4ade80;
                    color: black;
                }

                .btn-stop {
                    background: #ef4444;
                }

                .task-queue {
                    max-height: 200px;
                    overflow-y: auto;
                }

                .task-item {
                    padding: 8px;
                    background: rgba(0,0,0,0.2);
                    border-left: 3px solid #4ade80;
                    margin-bottom: 5px;
                    font-size: 11px;
                    border-radius: 2px;
                }

                .loop-status {
                    margin-left: 10px;
                    font-size: 12px;
                }

                .analysis-result {
                    margin-top: 10px;
                    padding: 10px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 4px;
                    font-size: 11px;
                    white-space: pre-wrap;
                    word-break: break-word;
                    max-height: 200px;
                    overflow-y: auto;
                }
            </style>
        `;

        // DOM에 추가
        if (!document.getElementById('jungwon-dashboard')) {
            document.body.insertAdjacentHTML('beforeend', styleHTML + dashboardHTML);
        }
    }

    setupEventListeners() {
        // 닫기 버튼
        document.querySelector('.close-btn').addEventListener('click', () => {
            document.getElementById('jungwon-dashboard').style.display = 'none';
        });

        // 작업 분배
        document.getElementById('dispatch-task-btn').addEventListener('click', () => {
            const description = document.getElementById('task-input').value;
            const priority = document.getElementById('task-priority').value;
            if (description.trim()) {
                this.dispatchTask(description, priority);
            }
        });

        // 성과 분석
        document.getElementById('analyze-btn').addEventListener('click', () => {
            this.analyzePerformance();
        });

        // 자동 학습 루프
        document.getElementById('start-loop-btn').addEventListener('click', () => {
            this.startSelfImprovementLoop();
        });

        document.getElementById('stop-loop-btn').addEventListener('click', () => {
            this.stopSelfImprovementLoop();
        });
    }

    startStatusPolling() {
        setInterval(() => {
            this.fetchStatus();
        }, 5000); // 5초마다 갱신
    }

    async fetchStatus() {
        try {
            const response = await fetch(`${this.apiBase}/jungwon/status`);
            if (response.ok) {
                this.agencyStatus = await response.json();
                this.updateUI();
            }
        } catch (error) {
            console.error('[JungWon] Error fetching status:', error);
        }
    }

    updateUI() {
        // 시스템 상태 업데이트
        const health = this.agencyStatus.health || {};
        Object.entries({
            'paperclip': 'paperclip-status',
            'hermes': 'hermes-status',
            'ganma4': 'ganma4-status'
        }).forEach(([system, elementId]) => {
            const elem = document.getElementById(elementId);
            if (elem) {
                const online = Boolean(health[system]);
                elem.classList.toggle('online', online);
                elem.classList.toggle('offline', !online);
                elem.textContent = online ? `● Online` : `● Offline`;
            }
        });

        // 통계 업데이트
        document.getElementById('total-tasks').textContent = this.agencyStatus.total_tasks || 0;
        document.getElementById('active-roles').textContent = this.agencyStatus.roles || 0;
        document.getElementById('knowledge-items').textContent = this.agencyStatus.knowledge_items || 0;
        document.getElementById('success-rate').textContent = this.agencyStatus.success_rate ? `${Math.round(this.agencyStatus.success_rate * 100)}%` : '0%';

        // 역할 리스트 업데이트
        this.updateRolesList();
        this.updateExtensionsList();
    }

    updateRolesList() {
        const rolesList = document.getElementById('roles-list');
        if (!rolesList) return;
        
        const roles = Array.isArray(this.agencyStatus.roles_metadata) ? this.agencyStatus.roles_metadata : [];
        if (roles.length === 0) {
            rolesList.innerHTML = `<div class="role-item"><span class="role-title">No roles configured</span></div>`;
            return;
        }

        rolesList.innerHTML = roles.map(role => {
            const title = role.title || role.id || 'Unknown Role';
            const badge = role.capabilities ? role.capabilities.join(', ') : 'No capabilities';
            return `
                <div class="role-item">
                    <span class="role-title">${title}</span>
                    <span class="badge">${badge}</span>
                </div>
            `;
        }).join('');
    }

    updateExtensionsList() {
        const extList = document.getElementById('extensions-list');
        if (!extList) return;
        
        const extensions = Array.isArray(this.agencyStatus.extensions) ? this.agencyStatus.extensions : [];
        if (extensions.length === 0) {
            extList.innerHTML = `<div class="extension-item"><span>No extensions configured</span></div>`;
            return;
        }

        extList.innerHTML = extensions.map(ext => {
            const badgeClass = ext.enabled ? 'active' : 'inactive';
            const statusLabel = ext.enabled ? 'Active' : 'Disabled';
            return `
                <div class="extension-item">
                    <span>${ext.name || ext.id || 'Unnamed extension'}</span>
                    <span class="badge ${badgeClass}">${statusLabel}</span>
                </div>
            `;
        }).join('');
    }

    async dispatchTask(description, priority) {
        try {
            const response = await fetch(`${this.apiBase}/jungwon/dispatch-task`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    priority,
                    required_capabilities: []
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                document.getElementById('task-input').value = '';
                this.addTaskToQueue(description, priority);
                alert('✅ Task dispatched successfully!');
            }
        } catch (error) {
            console.error('[JungWon] Error dispatching task:', error);
            alert('❌ Failed to dispatch task');
        }
    }

    addTaskToQueue(description, priority) {
        const taskQueue = document.getElementById('task-queue');
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `<strong>[${priority.toUpperCase()}]</strong> ${description}`;
        taskQueue.insertBefore(taskItem, taskQueue.firstChild);
    }

    async analyzePerformance() {
        try {
            const response = await fetch(`${this.apiBase}/jungwon/analyze`);
            if (response.ok) {
                const analysis = await response.json();
                document.getElementById('analysis-result').textContent = 
                    JSON.stringify(analysis, null, 2);
            }
        } catch (error) {
            console.error('[JungWon] Error analyzing performance:', error);
        }
    }

    async startSelfImprovementLoop() {
        try {
            document.getElementById('start-loop-btn').disabled = true;
            document.getElementById('stop-loop-btn').disabled = false;
            document.getElementById('loop-status').textContent = 'Running...';
            
            // 백엔드에서 루프 시작
            await fetch(`${this.apiBase}/jungwon/start-loop`, { method: 'POST' });
        } catch (error) {
            console.error('[JungWon] Error starting loop:', error);
        }
    }

    async stopSelfImprovementLoop() {
        try {
            document.getElementById('start-loop-btn').disabled = false;
            document.getElementById('stop-loop-btn').disabled = true;
            document.getElementById('loop-status').textContent = 'Stopped';
            
            // 백엔드에서 루프 중지
            await fetch(`${this.apiBase}/jungwon/stop-loop`, { method: 'POST' });
        } catch (error) {
            console.error('[JungWon] Error stopping loop:', error);
        }
    }
}

// 페이지 로드 시 대시보드 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.jungwonDashboard = new JungwonAgencyDashboard();
    });
} else {
    window.jungwonDashboard = new JungwonAgencyDashboard();
}
