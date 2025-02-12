// Admin Configuration (Modify as needed)
const ADMIN_CONFIG = {
    tasks: [
      { name: "Read Quran", xp: 20, category: "Tasks" },
      { name: "Exercise", xp: 15, category: "Tasks" },
      { name: "Learn something new", xp: 25, category: "Tasks" },
      { name: "Help someone", xp: 30, category: "Bonuses" },
    ],
    xpThresholds: [100, 300, 600, 1000], // XP required for each level
    rankingNames: ["Beginner", "Intermediate", "Advanced", "Expert"],
    badges: [
      { name: "Quran Master", condition: "Complete Quran tasks 50 times" },
      { name: "XP Collector", condition: "Reach 1000 XP" },
    ],
  };
  
  // Initialize localStorage
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(ADMIN_CONFIG.tasks));
  }
  if (!localStorage.getItem('xp')) {
    localStorage.setItem('xp', JSON.stringify({ current: 0, level: 1 }));
  }
  if (!localStorage.getItem('completedTasks')) {
    localStorage.setItem('completedTasks', JSON.stringify([]));
  }
  
  // DOM Elements
  const profileName = document.getElementById('profile-name');
  const profileRank = document.getElementById('profile-rank');
  const profileBadges = document.getElementById('profile-badges');
  const xpBar = document.getElementById('xp-bar');
  const xpText = document.getElementById('xp-text');
  const taskList = document.getElementById('task-list');
  const completedTaskList = document.getElementById('completed-task-list');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  // Constants
  const DAILY_RESET_TIME = 5; // 5 AM
  
  // Load profile and tasks
  loadProfile();
  loadTasks();
  loadCompletedTasks();
  
  // Dark Mode Toggle
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
  });
  
  // Check for saved dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
  
  // Rest of the code remains the same...