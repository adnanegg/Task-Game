// Hardcoded configuration
const config = {
  tasks: [
    { name: "Book", xp: 10, category: "Tasks" },
    { name: "Quran", xp: 10, category: "Tasks" },
    { name: "Sport", xp: 10, category: "Tasks" },
    { name: "Prayer At The Mosque", xp: 10, category: "Tasks" },
  ],
  xpThresholds: [100, 300, 600, 1000], // XP required for each rank
  rankingNames: ["Master", "Grand Master", "Epic", "Legend", "Mythic"], // Rank names
  badges: [
    { name: "Book Master", section: "Book", completed: false },
    { name: "Quran Master", section: "Quran", completed: false },
    { name: "Sport Master", section: "Sport", completed: false },
    { name: "Prayer Master", section: "Prayer", completed: false },
  ],
};

// Load user profile from localStorage
let userProfile = JSON.parse(localStorage.getItem('USER_PROFILE')) || {
  name: "User",
  photo: "assets/default-profile.png",
};

// DOM Elements
const profileImage = document.getElementById('profile-image');
const profileName = document.getElementById('profile-name');
const profileRank = document.getElementById('profile-rank');
const xpBar = document.getElementById('xp-bar');
const xpText = document.getElementById('xp-text');
const taskList = document.getElementById('task-list');
const completedTaskList = document.getElementById('completed-task-list');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Load profile and tasks
loadProfile();
loadTasks();
loadCompletedTasks();
setupDailyReset();

// Load Tasks
function loadTasks() {
  taskList.innerHTML = '';
  config.tasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'flex justify-between items-center p-2 border-b';
    taskItem.innerHTML = `
      <span>${task.name} (${task.xp} XP, ${task.category})</span>
      <button onclick="completeTask(${index})" class="p-1 bg-green-500 text-white rounded">Complete</button>
    `;
    taskList.appendChild(taskItem);
  });
}

// Load Completed Tasks
function loadCompletedTasks() {
  const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
  completedTaskList.innerHTML = '';
  completedTasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'flex justify-between items-center p-2 border-b';
    taskItem.innerHTML = `
      <span>${task.name} (${task.xp} XP)</span>
      <button onclick="undoTask(${index})" class="p-1 bg-red-500 text-white rounded">Undo</button>
    `;
    completedTaskList.appendChild(taskItem);
  });
}

// Load Profile
function loadProfile() {
  const xpData = JSON.parse(localStorage.getItem('xp')) || { current: 0, level: 1 };
  profileName.textContent = userProfile.name;
  profileImage.src = userProfile.photo;
  profileRank.textContent = config.rankingNames[xpData.level - 1] || "Beginner";
  updateXPBar();
}

// Complete Task
function completeTask(index) {
  const tasks = config.tasks;
  const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

  // Move the correct task to the completed list
  const completedTask = tasks[index];
  completedTasks.push(completedTask);
  tasks.splice(index, 1);

  // Update XP
  const xpData = JSON.parse(localStorage.getItem('xp')) || { current: 0, level: 1 };
  xpData.current += completedTask.xp;

  // Check if user leveled up
  const xpThreshold = config.xpThresholds[xpData.level - 1] || 100;
  if (xpData.current >= xpThreshold) {
    xpData.level += 1;
    xpData.current = 0;
    alert(`Level Up! You are now Level ${xpData.level}`);
  }

  // Save to localStorage
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('xp', JSON.stringify(xpData));

  // Reload UI
  loadProfile();
  loadTasks();
  loadCompletedTasks();
  updateXPBar();
}

// Undo Task
function undoTask(index) {
  const tasks = config.tasks;
  const completedTasks = JSON.parse(localStorage.getItem('completedTasks'));

  // Move task back to tasks list
  tasks.push(completedTasks[index]);
  completedTasks.splice(index, 1);

  // Update XP
  const xpData = JSON.parse(localStorage.getItem('xp'));
  xpData.current -= tasks[tasks.length - 1].xp;
  if (xpData.current < 0) xpData.current = 0;

  // Save to localStorage
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('xp', JSON.stringify(xpData));

  // Reload UI
  loadProfile();
  loadTasks();
  loadCompletedTasks();
  updateXPBar();
}

// Update XP Bar
function updateXPBar() {
  const xpData = JSON.parse(localStorage.getItem('xp')) || { current: 0, level: 1 };
  const xpThreshold = config.xpThresholds[xpData.level - 1] || 100;

  // Calculate XP percentage
  const xpPercentage = (xpData.current / xpThreshold) * 100;

  // Update XP bar width with animation
  xpBar.style.transition = 'width 0.5s ease-in-out';
  xpBar.style.width = `${xpPercentage}%`;

  // Update XP text
  xpText.textContent = `${xpData.current}/${xpThreshold} XP`;

  // Change bar color based on progress
  if (xpPercentage >= 75) {
    xpBar.classList.remove('bg-blue-500', 'bg-yellow-500');
    xpBar.classList.add('bg-green-500'); // Green for high progress
  } else if (xpPercentage >= 50) {
    xpBar.classList.remove('bg-blue-500', 'bg-green-500');
    xpBar.classList.add('bg-yellow-500'); // Yellow for medium progress
  } else {
    xpBar.classList.remove('bg-yellow-500', 'bg-green-500');
    xpBar.classList.add('bg-blue-500'); // Blue for low progress
  }
}

// Reset Completed Tasks
function resetCompletedTasks() {
  localStorage.setItem('completedTasks', JSON.stringify([])); // Clear completed tasks
  loadCompletedTasks(); // Reload the UI
  alert('Completed tasks have been reset!');
}

// Daily Reset Logic
function setupDailyReset() {
  const now = new Date();
  const lastReset = localStorage.getItem('lastReset') ? new Date(localStorage.getItem('lastReset')) : null;

  // Calculate the next reset time (5 AM of the next day)
  const nextReset = new Date(now);
  nextReset.setHours(5, 0, 0, 0); // Set to 5 AM
  if (now >= nextReset) {
    nextReset.setDate(nextReset.getDate() + 1); // Move to the next day
  }

  // Check if it's time to reset
  if (!lastReset || now >= nextReset) {
    localStorage.setItem('completedTasks', JSON.stringify([])); // Clear completed tasks
    localStorage.setItem('lastReset', nextReset.toISOString()); // Save the reset time
  }

  // Schedule the next reset
  const timeUntilReset = nextReset - now;
  setTimeout(() => {
    localStorage.setItem('completedTasks', JSON.stringify([])); // Clear completed tasks
    localStorage.setItem('lastReset', nextReset.toISOString()); // Save the reset time
    loadCompletedTasks(); // Reload the UI
    setupDailyReset(); // Schedule the next reset
  }, timeUntilReset);
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}