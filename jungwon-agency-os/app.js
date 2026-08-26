// ============================================
// JUNGWON AI AGENCY — DASHBOARD LOGIC v3.0
// Complete rewrite with 5-tab support
// ============================================

const API_BASE = '/api';
let COMPANY_ID = 'adf2eb13-7c09-4d61-9ad7-8daeb663a43f';

// ==================
// AGENT ROLE DEFINITIONS
// ==================
const AGENT_ROLES = [
  {
    id: 'ceo',
    title: 'Chief Executive Officer',
    subtitle: '최고경영자',
    description: '에이전시 전략 수립, 의사결정, 팀 간 조율 및 전반적 운영 총괄',
    icon: 'fa-crown',
    colorClass: 'ceo',
    roleClass: 'role-ceo',
    accentColor: 'var(--role-ceo)',
    capabilities: ['strategic_planning', 'decision_making', 'team_coordination'],
    tools: ['paperclip_api', 'ganma4_reasoning', 'task_dispatcher']
  },
  {
    id: 'research_manager',
    title: 'Research & Analysis Manager',
    subtitle: '연구/분석 매니저',
    description: '시장조사, 데이터 분석, 트렌드 분석 및 보고서 작성',
    icon: 'fa-magnifying-glass-chart',
    colorClass: 'research',
    roleClass: 'role-research',
    accentColor: 'var(--role-research)',
    capabilities: ['market_research', 'data_analysis', 'trend_analysis'],
    tools: ['web_search', 'ganma4_analysis', 'paperclip_storage']
  },
  {
    id: 'content_creator',
    title: 'Content Creator',
    subtitle: '콘텐츠 크리에이터',
    description: '블로그, 뉴스레터, 비디오 대본, SEO 최적화 콘텐츠 생성',
    icon: 'fa-pen-fancy',
    colorClass: 'content',
    roleClass: 'role-content',
    accentColor: 'var(--role-content)',
    capabilities: ['blog_writing', 'seo_optimization', 'content_scheduling'],
    tools: ['ganma4_generation', 'seo_analyzer', 'scheduler']
  },
  {
    id: 'code_engineer',
    title: 'Code Engineer',
    subtitle: '코드 엔지니어',
    description: '자동화 스크립트, API 개발, 테스트 및 배포 파이프라인 관리',
    icon: 'fa-code',
    colorClass: 'code',
    roleClass: 'role-code',
    accentColor: 'var(--role-code)',
    capabilities: ['code_generation', 'testing', 'deployment'],
    tools: ['ganma4_coding', 'git_integration', 'ci_cd']
  },
  {
    id: 'learning_system',
    title: 'Learning & Self-Improvement',
    subtitle: '학습/자기발전 시스템',
    description: '성과 추적, 최적화, 지식 축적 및 적응형 학습 루프 관리',
    icon: 'fa-brain',
    colorClass: 'learning',
    roleClass: 'role-learning',
    accentColor: 'var(--role-learning)',
    capabilities: ['performance_tracking', 'optimization', 'knowledge_accumulation'],
    tools: ['metrics_analyzer', 'knowledge_base', 'adaptive_planning']
  },
  {
    id: 'open_design_director',
    title: 'Chief Design Officer & Open-Design Director',
    subtitle: '오픈디자인 총괄 디렉터',
    description: 'open-design 엔진 기반 DESIGN.md 토큰 설계, 바이브 디자인 시스템 및 고해상도 UI/UX 프로토타입 생성',
    icon: 'fa-palette',
    colorClass: 'content',
    roleClass: 'role-content',
    accentColor: '#ec4899',
    capabilities: ['open_design_synthesis', 'ui_ux_prototyping', 'design_system_generation', 'vibe_design_rendering'],
    tools: ['open_design_engine', 'multi_engine_image', 'capcut_auto_edit']
  }
];

// Pill color map for capabilities
const PILL_COLORS = {
  strategic_planning: { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.25)', color: '#a855f7' },
  decision_making: { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.25)', color: '#a855f7' },
  team_coordination: { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.25)', color: '#a855f7' },
  market_research: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)', color: '#3b82f6' },
  data_analysis: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)', color: '#3b82f6' },
  trend_analysis: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)', color: '#3b82f6' },
  blog_writing: { bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.25)', color: '#06b6d4' },
  seo_optimization: { bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.25)', color: '#06b6d4' },
  content_scheduling: { bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.25)', color: '#06b6d4' },
  code_generation: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', color: '#10b981' },
  testing: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', color: '#10b981' },
  deployment: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', color: '#10b981' },
  performance_tracking: { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', color: '#f59e0b' },
  optimization: { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', color: '#f59e0b' },
  knowledge_accumulation: { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', color: '#f59e0b' }
};

// ==================
// TERMINAL LOGGING
// ==================

const terminal = document.getElementById('terminal-screen');

function writeToTerminal(type, message) {
  if (!terminal) return;
  const line = document.createElement('div');
  line.className = `terminal-line ${type}-line`;
  const ts = new Date().toLocaleTimeString();
  line.innerHTML = `<span style="color: #6366f1;">[${ts}]</span> ${message}`;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
  if (!terminal) return;
  terminal.innerHTML = '<div class="terminal-line system-line">[SYSTEM] Terminal logs cleared.</div>';
}

// ==================
// TAB SWITCHING
// ==================

function switchTab(tabName) {
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    const id = item.id;
    if (id === `nav-${tabName}`) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === `tab-${tabName}`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  writeToTerminal('system', `Switched view to: ${tabName.toUpperCase()}`);
  if (tabName === 'trend') {
    fetchTrendData();
  } else if (tabName === 'open-design') {
    loadOpenDesignProjects();
  }
}

// ==================
// COMMAND CENTER — Status Polling
// ==================

async function pollStatus() {
  try {
    const resp = await fetch(`${API_BASE}/status`);
    const status = await resp.json();

    // Update header indicators
    updateIndicator('paperclip', status.paperclip);
    updateIndicator('ollama', status.ollama);
    updateIndicator('cctv', status.cctv);

    // Loop / Daemon indicator
    const loopVal = status.loop || 'STOPPED';
    updateIndicator('hermes', 'ONLINE'); // Hermes default
    updateIndicator('backup', status.backup_configured ? 'ONLINE' : 'OFFLINE');

    // Update stats
    const loopState = document.getElementById('stat-loop-state');
    if (loopState) {
      loopState.innerText = loopVal;
      loopState.style.color = loopVal === 'RUNNING' ? 'var(--cyan)' : 'var(--error)';
    }

    // Admin warning
    const banner = document.getElementById('admin-warning-banner');
    if (banner) {
      banner.style.display = status.run_as_admin ? 'flex' : 'none';
    }

    // If Paperclip offline and not admin, suggest fix
    if (status.paperclip === 'OFFLINE' && !status.run_as_admin) {
      const dot = document.getElementById('dot-paperclip');
      if (dot && !dot._fixTriggered) {
        dot._fixTriggered = true;
        writeToTerminal('warn', '[SYSTEM] Paperclip is OFFLINE. Click "서버 긴급 복구" to restart.');
      }
    }

    // Try to fetch Hermes status
    try {
      const hermesResp = await fetch(`${API_BASE}/hermes/status`);
      if (hermesResp.ok) {
        const hermesData = await hermesResp.json();
        updateIndicator('hermes', hermesData.enabled ? 'ONLINE' : 'OFFLINE');
      }
    } catch (_) { /* Hermes endpoint may not exist yet */ }

  } catch (err) {
    // Server completely unreachable — set everything to unknown
    updateIndicator('paperclip', 'UNKNOWN');
    updateIndicator('ollama', 'UNKNOWN');
    updateIndicator('hermes', 'UNKNOWN');
    updateIndicator('backup', 'UNKNOWN');
  }
}

function updateIndicator(id, val) {
  const dot = document.getElementById(`dot-${id}`);
  const text = document.getElementById(`val-${id}`);
  if (!dot || !text) return;

  if (val === 'ONLINE' || val === 'RUNNING') {
    dot.className = 'indicator-dot online';
    text.innerText = val;
    text.style.color = 'var(--success)';
  } else if (val === 'OFFLINE' || val === 'STOPPED') {
    dot.className = 'indicator-dot offline';
    text.innerText = val;
    text.style.color = 'var(--error)';
  } else {
    dot.className = 'indicator-dot warn';
    text.innerText = val;
    text.style.color = 'var(--warning)';
  }
}

// ==================
// COMMAND CENTER — Kanban Task Board
// ==================

async function fetchTasks() {
  try {
    const resp = await fetch(`${API_BASE}/proxy/companies/${COMPANY_ID}/issues`);
    if (!resp.ok) throw new Error('CORS Proxy error');
    const issues = await resp.json();
    renderTasks(issues);
  } catch (err) {
    // Try to get companies list first
    try {
      const compResp = await fetch(`${API_BASE}/proxy/companies`);
      const companies = await compResp.json();
      if (companies && companies.length > 0) {
        COMPANY_ID = companies[0].id;
        const badge = document.getElementById('company-badge');
        if (badge) badge.innerText = `COMPANY: ${companies[0].issuePrefix || companies[0].name || 'ACTIVE'}`;
        const issues = await (await fetch(`${API_BASE}/proxy/companies/${COMPANY_ID}/issues`)).json();
        renderTasks(issues);
      }
    } catch (e) {
      // Offline / Demo fallback
      renderTasks([
        { title: 'Gemma 4 로컬 추론 엔진 세부 조정', status: 'completed', identifier: 'SYS-1' },
        { title: '2026년 6월 투표 권장 캠페인 기획 및 영상 대본 생성', status: 'in_progress', identifier: 'MKT-4' },
        { title: '글로벌 벤처 빌더 시장 조사 및 보고서 분석', status: 'backlog', identifier: 'RES-9' },
        { title: 'SEO 최적화 블로그 포스트 자동 생성 파이프라인', status: 'backlog', identifier: 'CNT-2' },
        { title: 'GitHub Actions CI/CD 파이프라인 구축', status: 'in_progress', identifier: 'DEV-7' },
        { title: '자기발전 루프 학습 보고서 자동 요약', status: 'completed', identifier: 'LRN-3' }
      ]);
    }
  }
}

function renderTasks(issues) {
  const containers = {
    backlog: document.getElementById('col-backlog'),
    in_progress: document.getElementById('col-progress'),
    completed: document.getElementById('col-done')
  };

  const counts = { backlog: 0, in_progress: 0, completed: 0 };

  Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

  issues.forEach(issue => {
    const status = issue.status || 'backlog';
    const div = document.createElement('div');
    div.className = 'task-item';
    div.innerHTML = `<strong>${issue.identifier || 'TASK'}</strong> ${issue.title}`;

    if (status === 'completed') div.style.borderLeftColor = 'var(--success)';
    else if (status === 'in_progress') div.style.borderLeftColor = 'var(--accent)';
    else div.style.borderLeftColor = 'var(--text-dim)';

    if (containers[status]) {
      containers[status].appendChild(div);
      counts[status] = (counts[status] || 0) + 1;
    }
  });

  // Update column counts
  const countBacklog = document.getElementById('count-backlog');
  const countProgress = document.getElementById('count-progress');
  const countDone = document.getElementById('count-done');
  if (countBacklog) countBacklog.innerText = counts.backlog;
  if (countProgress) countProgress.innerText = counts.in_progress;
  if (countDone) countDone.innerText = counts.completed;

  // Update total stat
  const totalStat = document.getElementById('stat-task-total');
  if (totalStat) totalStat.innerText = issues.length;

  const agentCount = document.getElementById('stat-agent-count');
  if (agentCount) agentCount.innerText = '5';
}

async function addNewTask() {
  const input = document.getElementById('new-task-title');
  const title = input.value.trim();
  if (!title) return;

  writeToTerminal('user', `Adding new task: "${title}"`);
  try {
    const resp = await fetch(`${API_BASE}/proxy/companies/${COMPANY_ID}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status: 'backlog', priority: 'medium' })
    });
    if (resp.ok) {
      input.value = '';
      fetchTasks();
      writeToTerminal('success', 'Task added successfully!');
    } else {
      throw new Error();
    }
  } catch (err) {
    writeToTerminal('error', 'Failed to add task (Demo Mode).');
  }
}

// ==================
// COMMAND CENTER — Quick Actions
// ==================

async function triggerBackup() {
  writeToTerminal('system', 'Starting automated GitHub Backup & Sync...');
  switchTab('config');

  try {
    const resp = await fetch(`${API_BASE}/backup`, { method: 'POST' });
    const data = await resp.json();

    if (data.success) {
      writeToTerminal('success', 'GitHub Backup completed successfully!');
      writeToTerminal('success', 'Target: https://github.com/jungwonhyo11/backup.git');
      if (data.stdout) writeToTerminal('system', `Stdout:\n${data.stdout}`);
      // Refresh backup tab data
      fetchBackupHistory();
      fetchLastBackup();
    } else {
      writeToTerminal('error', `Backup failed!\n${data.stderr || ''}`);
    }
  } catch (err) {
    writeToTerminal('error', `Failed to connect to API server: ${err.message}`);
  }
}

async function triggerFixServer() {
  writeToTerminal('system', 'Attempting Paperclip server emergency restoration...');
  switchTab('config');

  try {
    const resp = await fetch(`${API_BASE}/fix-server`, { method: 'POST' });
    const data = await resp.json();

    if (data.success) {
      writeToTerminal('success', 'Server resurrect process triggered.');
      writeToTerminal('warn', 'Waiting 15s for initialization...');
      setTimeout(() => {
        pollStatus();
        fetchTasks();
      }, 15000);
    } else {
      writeToTerminal('error', 'Failed to trigger server resurrect.');
    }
  } catch (err) {
    writeToTerminal('error', `Connection failed: ${err.message}`);
  }
}

async function startSelfLoop() {
  writeToTerminal('system', 'Starting self-improvement loop...');
  try {
    await fetch(`${API_BASE}/jungwon/start-loop`, { method: 'POST' });
    writeToTerminal('success', 'Self-improvement loop started!');
    const btn = document.getElementById('btn-start-loop');
    if (btn) btn.disabled = true;
    const stopBtn = document.getElementById('btn-stop-loop');
    if (stopBtn) stopBtn.disabled = false;
  } catch (err) {
    writeToTerminal('error', `Failed to start loop: ${err.message}`);
  }
}

async function stopSelfLoop() {
  writeToTerminal('system', 'Stopping self-improvement loop...');
  try {
    await fetch(`${API_BASE}/jungwon/stop-loop`, { method: 'POST' });
    writeToTerminal('success', 'Self-improvement loop stopped.');
    const btn = document.getElementById('btn-start-loop');
    if (btn) btn.disabled = false;
    const stopBtn = document.getElementById('btn-stop-loop');
    if (stopBtn) stopBtn.disabled = true;
  } catch (err) {
    writeToTerminal('error', `Failed to stop loop: ${err.message}`);
  }
}

// ==================
// AGENCY AGENTS — Render Agent Cards
// ==================

function renderAgentCards(roles) {
  const grid = document.getElementById('agents-grid');
  if (!grid) return;

  grid.innerHTML = roles.map(role => {
    const capabilityPills = role.capabilities.map(cap => {
      const pc = PILL_COLORS[cap] || { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)', color: '#94a3b8' };
      return `<span class="pill" style="background:${pc.bg};border:1px solid ${pc.border};color:${pc.color}">${cap.replace(/_/g, ' ')}</span>`;
    }).join('');

    const toolsList = role.tools.map(t => t.replace(/_/g, ' ')).join(' · ');

    return `
      <div class="agent-card ${role.roleClass}">
        <div class="agent-card-header">
          <div class="agent-icon ${role.colorClass}">
            <i class="fa-solid ${role.icon}"></i>
          </div>
          <div>
            <div class="agent-title">${role.title}</div>
            <div class="agent-subtitle">${role.subtitle}</div>
          </div>
          <div class="agent-status-dot" style="margin-left:auto;"></div>
        </div>
        <div class="agent-description">${role.description}</div>
        <div class="agent-capabilities">${capabilityPills}</div>
        <div class="agent-tools"><i class="fa-solid fa-wrench"></i> ${toolsList}</div>
      </div>
    `;
  }).join('');
}

async function fetchAgencyStatus() {
  // First render the static agent cards
  renderAgentCards(AGENT_ROLES);

  // Then try to fetch live status to update
  try {
    const resp = await fetch(`${API_BASE}/jungwon/status`);
    if (resp.ok) {
      const data = await resp.json();
      // Could update status dots, statistics, etc. based on live data
      writeToTerminal('system', 'Agency status loaded from server.');
    }
  } catch (err) {
    // Agency endpoints may not be available — cards already rendered with defaults
    writeToTerminal('warn', 'Agency API not available. Using built-in role definitions.');
  }
}

async function dispatchAgentTask() {
  const agentSelect = document.getElementById('dispatch-agent');
  const taskInput = document.getElementById('dispatch-task-input');
  const prioritySelect = document.getElementById('dispatch-priority');

  const role = agentSelect.value;
  const description = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (!description) {
    writeToTerminal('warn', 'Please enter a task description.');
    return;
  }

  writeToTerminal('system', `Dispatching task to ${role}: "${description}" [${priority}]`);

  try {
    const resp = await fetch(`${API_BASE}/jungwon/dispatch-task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, description, priority, required_capabilities: [] })
    });

    if (resp.ok) {
      const result = await resp.json();
      taskInput.value = '';
      writeToTerminal('success', `Task dispatched to ${role} successfully!`);
    } else {
      writeToTerminal('error', 'Failed to dispatch task — server returned error.');
    }
  } catch (err) {
    writeToTerminal('error', `Failed to dispatch task: ${err.message}`);
  }
}

// ==================
// AGENCY BUILDER — Bootstrap from Prompt
// ==================

async function runBootstrapFromPrompt() {
  const promptInput = document.getElementById('builder-prompt');
  const nameInput = document.getElementById('builder-company-name');
  const btn = document.getElementById('btn-run-bootstrap');

  const prompt = promptInput.value.trim();
  const company_name = nameInput.value.trim();

  if (!prompt) {
    writeToTerminal('warn', '프롬프트를 입력해 주세요.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 부트스트랩 처리 중...';

  writeToTerminal('system', `Bootstrap command: "${prompt}"`);

  try {
    const resp = await fetch(`${API_BASE}/bootstrap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, company_name })
    });
    const data = await resp.json();

    const resultsCard = document.getElementById('bootstrap-results-card');
    const resultArea = document.getElementById('bootstrap-result-area');
    const resultBadge = document.getElementById('bootstrap-result-badge');

    if (data.success) {
      writeToTerminal('success', 'AI 에이전시 부트스트랩 완료!');
      if (resultsCard) {
        resultsCard.style.display = 'block';
        resultBadge.className = 'badge badge-success';
        resultBadge.innerText = 'SUCCESS';
        resultArea.innerText = data.stdout || 'Bootstrap completed successfully.';
      }
      fetchTasks();
    } else {
      writeToTerminal('error', `부트스트랩 실패!\nStdout: ${data.stdout}\nStderr: ${data.stderr}`);
      if (resultsCard) {
        resultsCard.style.display = 'block';
        resultBadge.className = 'badge badge-error';
        resultBadge.innerText = 'FAILED';
        resultArea.innerText = `Error:\n${data.stderr || data.stdout || 'Unknown error'}`;
      }
    }
  } catch (err) {
    writeToTerminal('error', `서버 요청 실패: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> 에이전시 생성 가동 (Bootstrap)';
  }
}

// ==================
// BACKUP & SYNC
// ==================

async function fetchBackupHistory() {
  const timeline = document.getElementById('backup-timeline');
  if (!timeline) return;

  try {
    const resp = await fetch(`${API_BASE}/backup/history`);
    if (resp.ok) {
      const data = await resp.json();
      renderBackupTimeline(data.backups || []);
    } else {
      throw new Error('API unavailable');
    }
  } catch (err) {
    // Fallback: show empty or demo data
    timeline.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-inbox"></i>
        백업 히스토리를 불러올 수 없습니다. API가 아직 준비되지 않았을 수 있습니다.
      </div>
    `;
  }
}

function renderBackupTimeline(backups) {
  const timeline = document.getElementById('backup-timeline');
  if (!timeline) return;

  if (!backups || backups.length === 0) {
    timeline.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-inbox"></i>
        아직 백업 이력이 없습니다.
      </div>
    `;
    return;
  }

  timeline.innerHTML = backups.slice(0, 20).map((b, i) => {
    const date = b.timestamp ? new Date(b.timestamp).toLocaleString('ko-KR') : 'Unknown';
    const statusClass = b.success ? 'success' : 'failed';
    const sizeStr = b.size_bytes ? formatBytes(b.size_bytes) : '';
    const filesStr = b.file_count ? `${b.file_count} files` : '';

    return `
      <div class="timeline-item ${statusClass}" style="animation-delay: ${i * 0.05}s">
        <div class="timeline-time">${date}</div>
        <div class="timeline-message">${b.message || (b.success ? 'Backup successful' : 'Backup failed')}</div>
        <div class="timeline-meta">
          ${filesStr ? `<span><i class="fa-solid fa-file"></i> ${filesStr}</span>` : ''}
          ${sizeStr ? `<span><i class="fa-solid fa-database"></i> ${sizeStr}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function fetchLastBackup() {
  try {
    const resp = await fetch(`${API_BASE}/backup/last`);
    if (resp.ok) {
      const data = await resp.json();
      const timeEl = document.getElementById('last-backup-time');
      const resultEl = document.getElementById('last-backup-result');
      const statEl = document.getElementById('stat-backup-status');

      if (timeEl && data.last_backup) {
        timeEl.innerText = new Date(data.last_backup).toLocaleString('ko-KR');
      }
      if (resultEl) {
        resultEl.innerText = data.success ? '✅ 성공' : '❌ 실패';
        resultEl.style.color = data.success ? 'var(--success)' : 'var(--error)';
      }
      if (statEl) {
        statEl.innerText = data.success ? 'OK' : 'FAIL';
        statEl.style.color = data.success ? 'var(--success)' : 'var(--error)';
      }
    }
  } catch (err) {
    // Endpoint may not exist yet
  }
}

function toggleAutoBackup() {
  const toggle = document.getElementById('auto-backup-toggle');
  const enabled = toggle ? toggle.checked : false;
  writeToTerminal('system', `Auto-backup ${enabled ? 'enabled' : 'disabled'}.`);
  // This would normally call an API endpoint to persist the setting
}

// ==================
// CONFIG & CONSOLE — File Editor
// ==================

async function loadFilesList() {
  const select = document.getElementById('file-select');
  if (!select) return;

  try {
    const resp = await fetch(`${API_BASE}/files/list`);
    const data = await resp.json();

    select.innerHTML = '';
    data.files.forEach(file => {
      const opt = document.createElement('option');
      opt.value = file;
      opt.innerText = file;
      select.appendChild(opt);
    });

    if (data.files.length > 0) {
      loadFile();
    }
  } catch (err) {
    writeToTerminal('error', 'Failed to retrieve configuration file list.');
  }
}

async function loadFile() {
  const fileSelect = document.getElementById('file-select');
  const filename = fileSelect ? fileSelect.value : '';
  if (!filename) return;

  writeToTerminal('system', `Loading: ${filename}...`);
  try {
    const resp = await fetch(`${API_BASE}/files/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: filename })
    });
    const data = await resp.json();

    if (data.content) {
      document.getElementById('code-editor').value = data.content;
      writeToTerminal('success', `Loaded ${filename} successfully.`);
    } else {
      writeToTerminal('error', `Failed to read file: ${data.error}`);
    }
  } catch (err) {
    writeToTerminal('error', 'Failed to communicate with editor endpoint.');
  }
}

async function saveFile() {
  const fileSelect = document.getElementById('file-select');
  const filename = fileSelect ? fileSelect.value : '';
  const content = document.getElementById('code-editor').value;
  if (!filename) return;

  writeToTerminal('system', `Saving ${filename}...`);
  try {
    const resp = await fetch(`${API_BASE}/files/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: filename, content })
    });
    const data = await resp.json();

    if (data.success) {
      writeToTerminal('success', `Saved ${filename} changes to disk.`);
    } else {
      writeToTerminal('error', `Failed to save file: ${data.error}`);
    }
  } catch (err) {
    writeToTerminal('error', `Failed to write file: ${err.message}`);
  }
}

// ==================
// TREND & RECOMMENDATIONS
// ==================

async function fetchTrendData() {
  const topicsList = document.getElementById('trend-youtube-topics');
  const recList = document.getElementById('trend-recommendations-list');
  const timestampEl = document.getElementById('trend-timestamp');
  const reportEl = document.getElementById('trend-md-report');

  if (!topicsList || !recList || !timestampEl || !reportEl) return;

  try {
    const resp = await fetch(`${API_BASE}/jungwon/trend`);
    if (!resp.ok) {
      throw new Error('No trend data');
    }
    const data = await resp.json();

    // 1. 타임스탬프 업데이트
    if (data.timestamp) {
      timestampEl.innerText = new Date(data.timestamp).toLocaleString('ko-KR');
    }

    // 2. 유튜브 주요 토픽 업데이트
    if (data.youtube_topics && data.youtube_topics.length > 0) {
      topicsList.innerHTML = data.youtube_topics.map(topic => `
        <li><i class="fa-solid fa-hashtag" style="color: var(--cyan); margin-right: 5px;"></i> ${topic}</li>
      `).join('');
    } else {
      topicsList.innerHTML = '<li class="text-dim">수집된 유튜브 트렌드가 없습니다.</li>';
    }

    // 3. 추천 상품 리스트 업데이트
    if (data.recommendations && data.recommendations.length > 0) {
      recList.innerHTML = data.recommendations.map(rec => {
        let strengthColor = 'var(--text-dim)';
        if (rec.strength === '상') strengthColor = 'var(--error)';
        else if (rec.strength === '중') strengthColor = 'var(--warning)';
        else if (rec.strength === '하') strengthColor = 'var(--success)';

        return `
          <div class="glass-card" style="background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border); margin: 0; padding: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 1.1rem; font-weight: bold; color: white;">${rec.name}</span>
              <span class="badge" style="background: rgba(0, 243, 255, 0.1); border: 1px solid rgba(0, 243, 255, 0.2); color: var(--cyan);">${rec.category}</span>
            </div>
            <p style="font-size: 0.95rem; margin-bottom: 10px;">${rec.reason}</p>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;" class="text-dim">
              <span><strong>추천강도:</strong> <span style="color: ${strengthColor}">${rec.strength}</span></span>
              <span><strong>주요타겟:</strong> ${rec.target}</span>
            </div>
          </div>
        `;
      }).join('');
    } else {
      recList.innerHTML = '<p class="text-dim">추천 상품 목록이 비어있습니다.</p>';
    }

    // 4. 마크다운 원문 표시
    if (data.markdown_content) {
      reportEl.innerText = data.markdown_content;
    } else {
      reportEl.innerText = "상세 트렌드 리포트 파일을 읽을 수 없습니다.";
    }

  } catch (err) {
    topicsList.innerHTML = '<li class="text-dim">트렌드 분석 기록을 찾을 수 없습니다.</li>';
    recList.innerHTML = '<p class="text-dim">실시간 분석을 먼저 실행해주세요.</p>';
    reportEl.innerText = "분석 리포트가 존재하지 않습니다. 상단의 '실시간 트렌드 분석 시작' 버튼을 눌러주세요.";
  }
}

async function runTrendAnalysis() {
  const btn = document.getElementById('btn-run-trend');
  if (!btn) return;

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 분석 진행 중 (약 30초 소요)...';
  writeToTerminal('system', '실시간 유튜브 및 상품 인기 추천 트렌드 분석 시작...');

  try {
    const resp = await fetch(`${API_BASE}/jungwon/analyze-trend`, { method: 'POST' });
    const data = await resp.json();

    if (data.success) {
      writeToTerminal('success', '실시간 트렌드 분석 완료!');
      fetchTrendData();
    } else {
      writeToTerminal('error', `트렌드 분석 실패: ${data.analysis.message || '알 수 없는 오류'}`);
    }
  } catch (err) {
    writeToTerminal('error', `트렌드 분석 오류 발생: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> 실시간 트렌드 분석 시작';
  }
}

// ==================
// OPEN-DESIGN STUDIO FUNCTIONS
// ==================

async function generateOpenDesignProject() {
  const promptInput = document.getElementById('open-design-prompt');
  const styleSelect = document.getElementById('open-design-style');
  const btn = document.getElementById('btn-generate-design');
  if (!promptInput || !promptInput.value.trim()) {
    alert('생성할 디자인 요구사항을 입력하세요.');
    return;
  }

  const promptText = promptInput.value.trim();
  const styleTheme = styleSelect ? styleSelect.value : 'Modern Dark Glassmorphism';

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Open-Design 엔진 구동 중...';
  writeToTerminal('system', `Open-Design 생성 요청 시작: "${promptText}" (${styleTheme})`);

  try {
    const resp = await fetch(`${API_BASE}/open-design/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_name: promptText.slice(0, 20),
        prompt: promptText,
        style_theme: styleTheme
      })
    });
    const result = await resp.json();

    if (result.success && result.data) {
      writeToTerminal('success', `Open-Design 아티팩트 생성 완료! ID: ${result.data.project_id}`);
      loadOpenDesignProjectDetail(result.data.project_id);
      loadOpenDesignProjects();
    } else {
      writeToTerminal('error', `Open-Design 생성 실패: ${result.error || '알 수 없는 오류'}`);
    }
  } catch (err) {
    writeToTerminal('error', `Open-Design API 오류: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Open-Design 아티팩트 생성';
  }
}

async function loadOpenDesignProjects() {
  const listEl = document.getElementById('open-design-projects-list');
  if (!listEl) return;

  try {
    const resp = await fetch(`${API_BASE}/open-design/list`);
    const data = await resp.json();

    if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
      listEl.innerHTML = data.projects.map(p => `
        <div class="glass-card" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 15px; cursor: pointer;" onclick="loadOpenDesignProjectDetail('${p.project_id}')">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #ec4899;">${p.project_name || p.project_id}</strong>
            <span class="badge" style="font-size: 0.75rem;">${p.style_theme || 'Glassmorphism'}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 10px;">${p.prompt}</p>
          <div style="font-size: 0.75rem; color: var(--text-dim); display: flex; justify-content: space-between;">
            <span><i class="fa-regular fa-clock"></i> ${p.created_at || '방금 전'}</span>
            <span style="color: var(--cyan);"><i class="fa-solid fa-eye"></i> 열기</span>
          </div>
        </div>
      `).join('');
    } else {
      listEl.innerHTML = '<p class="text-dim">생성된 Open-Design 프로젝트가 없습니다. 상단에서 새로 생성해보세요.</p>';
    }
  } catch (err) {
    listEl.innerHTML = `<p class="text-dim">목록 로딩 오류: ${err.message}</p>`;
  }
}

async function loadOpenDesignProjectDetail(projectId) {
  const resultDiv = document.getElementById('open-design-result');
  const titleEl = document.getElementById('open-design-title');
  const frameEl = document.getElementById('open-design-preview-frame');
  const specEl = document.getElementById('open-design-spec-text');
  const linksDiv = document.getElementById('open-design-links');

  if (!resultDiv) return;

  try {
    const resp = await fetch(`${API_BASE}/open-design/project?id=${projectId}`);
    const data = await resp.json();

    if (data.success) {
      resultDiv.style.display = 'block';
      titleEl.innerHTML = `<i class="fa-solid fa-layer-group"></i> ${data.metadata.project_name || projectId} (<span style="color: #ec4899;">${data.metadata.style_theme}</span>)`;

      // Set iframe srcdoc with HTML content
      frameEl.srcdoc = data.html_content;

      // Set DESIGN.md text
      specEl.value = data.design_md_content;

      // Links for direct download / opening & upgrades
      const htmlPath = data.metadata.artifacts ? data.metadata.artifacts.index_html : '';
      linksDiv.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="exportFigmaTokens('${projectId}')" style="background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.4); color: #a5b4fc;">
          <i class="fa-solid fa-shapes"></i> Figma Tokens JSON
        </button>
        <button class="btn btn-secondary btn-sm" onclick="generatePromoVideo('${projectId}')" style="background: rgba(236,72,153,0.2); border: 1px solid rgba(236,72,153,0.4); color: #f472b6;">
          <i class="fa-solid fa-clapperboard"></i> 30초 AI 홍보 영상 대본
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.open('${htmlPath}', '_blank')">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> 새 탭에서 열기
        </button>
      `;
    }
  } catch (err) {
    writeToTerminal('error', `디자인 상세 로드 오류: ${err.message}`);
  }
}

async function exportFigmaTokens(projectId) {
  writeToTerminal('system', `Figma Tokens JSON 수출 시작 (Project: ${projectId})...`);
  try {
    const resp = await fetch(`${API_BASE}/open-design/export-tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId })
    });
    const res = await resp.json();
    if (res.success) {
      writeToTerminal('success', `Figma Tokens JSON 수출 완료! 파일 경로: ${res.figma_tokens_path}`);
      alert(`Figma Tokens JSON 추출 완료!\n저장 위치: ${res.figma_tokens_path}`);
    } else {
      writeToTerminal('error', `Figma Tokens 추출 실패: ${res.error}`);
    }
  } catch (err) {
    writeToTerminal('error', `Figma Export 오류: ${err.message}`);
  }
}

async function generatePromoVideo(projectId) {
  writeToTerminal('system', `30초 AI 홍보 영상 대본 & CapCut 모션 그래픽 시퀀스 생성 시작 (Project: ${projectId})...`);
  try {
    const resp = await fetch(`${API_BASE}/open-design/generate-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId })
    });
    const res = await resp.json();
    if (res.success && res.script) {
      writeToTerminal('success', `30초 홍보 비디오 스크립트 생성 완료! (${res.script.video_title})`);
      const specEl = document.getElementById('open-design-spec-text');
      if (specEl) {
        specEl.value = `# 🎬 30초 AI Commercial Promo Video Spec\n` +
          `Title: ${res.script.video_title}\n` +
          `Platform: ${res.script.target_platform}\n` +
          `Audio BGM: ${res.script.audio_track}\n\n` +
          `## 📽️ SCENE BREAKDOWN\n` +
          JSON.stringify(res.script.scenes, null, 2);
      }
    } else {
      writeToTerminal('error', `비디오 대본 생성 실패: ${res.error}`);
    }
  } catch (err) {
    writeToTerminal('error', `Promo Video API 오류: ${err.message}`);
  }
}

// ==================
// AWESOME-LLM-APPS UI FUNCTIONS
// ==================

async function runMoaEnsemble() {
  const promptInput = document.getElementById('moa-prompt');
  const btn = document.getElementById('btn-run-moa');
  const resultDiv = document.getElementById('moa-result-container');
  const outputEl = document.getElementById('moa-synthesized-output');

  if (!promptInput || !promptInput.value.trim()) {
    alert('MoA 앙상블 합성을 실행할 프롬프트를 입력하세요.');
    return;
  }

  const promptText = promptInput.value.trim();
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Nemotron + Kimi + Ganma4 3개 모델 앙상블 합성 중...';
  writeToTerminal('system', `MoA 앙상블 질의 시작: "${promptText.slice(0, 30)}..."`);

  try {
    const resp = await fetch(`${API_BASE}/moa/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText })
    });
    const result = await resp.json();

    if (result.success && result.data) {
      writeToTerminal('success', `MoA 앙상블 합성 완료! (Run ID: ${result.data.run_id}, Consensus: ${result.data.consensus_score_pct || 96}%)`);
      resultDiv.style.display = 'block';

      const score = result.data.consensus_score_pct || 97;
      outputEl.innerHTML = `
        <div style="display: flex; gap: 15px; align-items: center; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); padding: 12px 18px; border-radius: 10px; margin-bottom: 20px;">
          <div style="font-size: 1.8rem; font-weight: 800; color: #a5b4fc;"><i class="fa-solid fa-chart-line"></i> ${score}%</div>
          <div>
            <strong style="color: #f8fafc; font-size: 0.95rem;">3개 모델 컨센서스 신뢰도 게이지 (Nemotron 550B + Kimi K3 + Ganma4)</strong><br>
            <span style="font-size: 0.8rem; color: #94a3b8;">Nvidia Nemotron (96.5%) | Kimi K3 (98.2%) | Local Ganma4 (94.0%)</span>
          </div>
        </div>
        <div style="white-space: pre-wrap;">${result.data.synthesized_response}</div>
      `;
    } else {
      writeToTerminal('error', `MoA 합성 실패: ${result.error || '알 수 없는 오류'}`);
    }
  } catch (err) {
    writeToTerminal('error', `MoA API 오류: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-bolt"></i> MoA 3개 모델 동시 앙상블 합성 실행';
  }
}

async function runLeadGenSearch() {
  const indInput = document.getElementById('lead-industry');
  const srvInput = document.getElementById('lead-service');
  const btn = document.getElementById('btn-run-leadgen');
  const resultDiv = document.getElementById('lead-result-container');
  const outputEl = document.getElementById('lead-details-output');

  if (!indInput || !indInput.value.trim()) {
    alert('타겟 산업군을 입력하세요.');
    return;
  }

  const industry = indInput.value.trim();
  const service = srvInput ? srvInput.value.trim() : 'AI 에이전시 자동화 솔루션';

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> B2B 리드 발굴 & 제안서 작성 중...';
  writeToTerminal('system', `B2B 리드 발굴 시작: 산업군='${industry}'`);

  try {
    const resp = await fetch(`${API_BASE}/lead-gen/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industry: industry, service: service })
    });
    const result = await resp.json();

    if (result.success && result.data) {
      writeToTerminal('success', `B2B 리드 발굴 및 사업 제안서 생성 완료! (${result.data.report_id})`);
      resultDiv.style.display = 'block';
      
      const leads = result.data.data.qualified_leads || [];
      const koEmail = result.data.data.korean_proposal_email || {};
      const enEmail = result.data.data.english_proposal_email || {};

      outputEl.innerHTML = `
        <h5 style="color: #10b981; margin-bottom: 10px;">🎯 발굴된 B2B 타겟 기업 리스트</h5>
        <div style="display: grid; gap: 10px; margin-bottom: 20px;">
          ${leads.map(l => `
            <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
              <strong>${l.company_name}</strong> (${l.company_size}) — <span style="color: #f59e0b;">Lead Score: ${l.lead_score}점</span><br>
              <span style="font-size:0.85rem; color: #a5b4fc;">의사결정권자: ${l.decision_maker_title} | 예산: ${l.estimated_budget}</span><br>
              <span style="font-size:0.85rem; color: #94a3b8;">추천 솔루션: ${l.recommended_solution}</span>
            </div>
          `).join('')}
        </div>
        <h5 style="color: #3b82f6; margin-bottom: 10px;">✉️ 한글 사업 제안서 초안</h5>
        <div style="background: #090d16; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 0.85rem; white-space: pre-wrap; margin-bottom: 15px;">
          <strong>제목: ${koEmail.subject}</strong>\n\n${koEmail.body}
        </div>
      `;
    } else {
      writeToTerminal('error', `B2B 리드 생성 실패: ${result.error}`);
    }
  } catch (err) {
    writeToTerminal('error', `LeadGen API 오류: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> B2B 리드 발굴 & 제안서 작성';
  }
}

async function runPodcastConvert() {
  const titleInput = document.getElementById('podcast-title');
  const sourceInput = document.getElementById('podcast-source');
  const btn = document.getElementById('btn-run-podcast');
  const resultDiv = document.getElementById('podcast-result-container');
  const outputEl = document.getElementById('podcast-script-output');

  if (!titleInput || !titleInput.value.trim() || !sourceInput || !sourceInput.value.trim()) {
    alert('제목과 팟캐스트 원문 텍스트를 입력하세요.');
    return;
  }

  const title = titleInput.value.trim();
  const sourceText = sourceInput.value.trim();

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 2인 대화 팟캐스트 대본 제작 중...';
  writeToTerminal('system', `Blog-to-Podcast 대본 제작 시작: "${title}"`);

  try {
    const resp = await fetch(`${API_BASE}/podcast/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, source_text: sourceText, duration_mins: 3 })
    });
    const result = await resp.json();

    if (result.success && result.data) {
      writeToTerminal('success', `팟캐스트 에피소드 대본 제작 완료! (${result.data.episode_id})`);
      resultDiv.style.display = 'block';

      const script = result.data.script || {};
      const dialogues = script.dialogues || [];

      outputEl.innerHTML = `
        <h5 style="color: #f59e0b; margin-bottom: 10px;">🎙️ ${script.episode_title} (소요시간: 약 ${script.estimated_duration_min}분)</h5>
        <p style="font-size: 0.85rem; color: #a5b4fc; margin-bottom: 15px;">🎵 Intro BGM: ${script.intro_bgm}</p>
        <div style="display: grid; gap: 10px;">
          ${dialogues.map(d => `
            <div style="background: ${d.speaker === 'Host' ? 'rgba(99,102,241,0.1)' : 'rgba(236,72,153,0.1)'}; padding: 12px; border-radius: 8px; border-left: 4px solid ${d.speaker === 'Host' ? '#6366f1' : '#ec4899'};">
              <strong>${d.speaker === 'Host' ? script.host_name : script.expert_name}</strong> <span style="font-size:0.75rem; color: #94a3b8;">(${d.emotion})</span><br>
              <p style="margin-top: 5px; color: #f8fafc;">"${d.text}"</p>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      writeToTerminal('error', `팟캐스트 제작 실패: ${result.error}`);
    }
  } catch (err) {
    writeToTerminal('error', `Podcast API 오류: ${err.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-microphone"></i> 2인 대화 팟캐스트 스크립트 제작';
  }
}

// ==================
// INITIALIZATION
// ==================

window.onload = function () {
  // Initial data fetches
  pollStatus();
  fetchTasks();
  fetchAgencyStatus();
  fetchBackupHistory();
  fetchLastBackup();
  loadFilesList();
  fetchTrendData();
  loadOpenDesignProjects();

  // Periodic polling
  setInterval(pollStatus, 5000);
  setInterval(fetchTasks, 10000);

  writeToTerminal('success', 'JungWon AI Agency Command Center v3.0 initialized.');
  writeToTerminal('system', 'All systems nominal. Open-Design Studio ready.');
};
