// Load existing configuration from localStorage
let config = JSON.parse(localStorage.getItem('ADMIN_CONFIG')) || {
    tasks: [],
    xpThresholds: [],
    rankingNames: [],
    badges: [],
  };
  
  // DOM Elements
  const taskList = document.getElementById('task-list');
  const xpThresholds = document.getElementById('xp-thresholds');
  const rankingNames = document.getElementById('ranking-names');
  const badgeList = document.getElementById('badge-list');
  
  // Load existing data
  loadTasks();
  loadXPThresholds();
  loadRankingNames();
  loadBadges();
  
  function loadTasks() {
    taskList.innerHTML = '';
    config.tasks.forEach((task, index) => {
      const taskItem = document.createElement('div');
      taskItem.className = 'flex justify-between items-center p-2 border-b';
      taskItem.innerHTML = `
        <span>${task.name} (${task.xp} XP, ${task.category})</span>
        <button onclick="deleteTask(${index})" class="p-1 bg-red-500 text-white rounded">Delete</button>
      `;
      taskList.appendChild(taskItem);
    });
  }
  
  function loadXPThresholds() {
    xpThresholds.innerHTML = '';
    config.xpThresholds.forEach((threshold, index) => {
      const thresholdItem = document.createElement('div');
      thresholdItem.className = 'flex justify-between items-center p-2 border-b';
      thresholdItem.innerHTML = `
        <span>Level ${index + 1}: ${threshold} XP</span>
        <button onclick="deleteXPThreshold(${index})" class="p-1 bg-red-500 text-white rounded">Delete</button>
      `;
      xpThresholds.appendChild(thresholdItem);
    });
  }
  
  function loadRankingNames() {
    rankingNames.innerHTML = '';
    config.rankingNames.forEach((name, index) => {
      const nameItem = document.createElement('div');
      nameItem.className = 'flex justify-between items-center p-2 border-b';
      nameItem.innerHTML = `
        <span>Rank ${index + 1}: ${name}</span>
        <button onclick="deleteRankingName(${index})" class="p-1 bg-red-500 text-white rounded">Delete</button>
      `;
      rankingNames.appendChild(nameItem);
    });
  }
  
  function loadBadges() {
    badgeList.innerHTML = '';
    config.badges.forEach((badge, index) => {
      const badgeItem = document.createElement('div');
      badgeItem.className = 'flex justify-between items-center p-2 border-b';
      badgeItem.innerHTML = `
        <span>${badge.name} (${badge.condition})</span>
        <button onclick="deleteBadge(${index})" class="p-1 bg-red-500 text-white rounded">Delete</button>
      `;
      badgeList.appendChild(badgeItem);
    });
  }
  
  // Add Task
  function addTask() {
    const taskName = document.getElementById('task-name').value;
    const taskXP = parseInt(document.getElementById('task-xp').value);
    const taskCategory = document.getElementById('task-category').value;
  
    if (taskName && !isNaN(taskXP)) {
      config.tasks.push({ name: taskName, xp: taskXP, category: taskCategory });
      loadTasks();
    }
  }
  
  // Add XP Threshold
  function addXPThreshold() {
    const threshold = parseInt(document.getElementById('new-xp-threshold').value);
    if (!isNaN(threshold)) {
      config.xpThresholds.push(threshold);
      loadXPThresholds();
    }
  }
  
  // Add Ranking Name
  function addRankingName() {
    const name = document.getElementById('new-ranking-name').value;
    if (name) {
      config.rankingNames.push(name);
      loadRankingNames();
    }
  }
  
  // Add Badge
  function addBadge() {
    const badgeName = document.getElementById('badge-name').value;
    const badgeCondition = document.getElementById('badge-condition').value;
    if (badgeName && badgeCondition) {
      config.badges.push({ name: badgeName, condition: badgeCondition });
      loadBadges();
    }
  }
  
  // Delete Functions
  function deleteTask(index) {
    config.tasks.splice(index, 1);
    loadTasks();
  }
  
  function deleteXPThreshold(index) {
    config.xpThresholds.splice(index, 1);
    loadXPThresholds();
  }
  
  function deleteRankingName(index) {
    config.rankingNames.splice(index, 1);
    loadRankingNames();
  }
  
  function deleteBadge(index) {
    config.badges.splice(index, 1);
    loadBadges();
  }
  
  // Save Configuration
  function saveConfig() {
    localStorage.setItem('ADMIN_CONFIG', JSON.stringify(config));
    alert('Configuration saved!');
  }