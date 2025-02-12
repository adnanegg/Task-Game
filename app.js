// Hardcoded configuration
const config = {
  tasks: [
    { name: "Book", xp: 10, category: "Tasks", penalty: 5 }, // Penalty for not completing this task
    { name: "Quran", xp: 10, category: "Tasks", penalty: 5 },
    { name: "Sport", xp: 10, category: "Tasks", penalty: 5 },
    { name: "Prayer At The Mosque", xp: 10, category: "Tasks", penalty: 5 },
  ],
  xpThresholds: [100, 300, 600, 1000], // XP required for each rank
  rankingNames: ["Warrior", "Master", "Grand Master", "Epic", "Legend", "Mythic"], // Rank names
  rankImages: {
    1: "assets/rank-warrior.png",
    2: "assets/rank-master.png",
    3: "assets/rank-grandmaster.png",
    4: "assets/rank-epic.png",
    5: "assets/rank-legend.png",
    6: "assets/rank-mythic.png",
  },
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

// Load tasks and completed tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [...config.tasks];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

// DOM Elements
const profileImage = document.getElementById('profile-image');
const profileName = document.getElementById('profile-name');
const profileRank = document.getElementById('profile-rank');
const rankImage = document.getElementById('rank-image');
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
  tasks.forEach((task, index) => {
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
  rankImage.src = config.rankImages[xpData.level] || "assets/rank-beginner.png"; // Update rank image
  updateXPBar();
}

// Update Profile
function updateProfile() {
  const newName = document.getElementById('new-name').value;
  const profilePhotoInput = document.getElementById('profile-photo');

  if (newName) {
    userProfile.name = newName;
  }

  if (profilePhotoInput.files && profilePhotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      userProfile.photo = e.target.result;
      localStorage.setItem('USER_PROFILE', JSON.stringify(userProfile));
      loadProfile(); // Reload profile to reflect changes

      // Clear input fields after photo is uploaded
      document.getElementById('new-name').value = ''; // Clear name input
      profilePhotoInput.value = ''; // Clear file input

      // Show success message using SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        confirmButtonText: 'OK',
      });
    };
    reader.readAsDataURL(profilePhotoInput.files[0]);
  } else {
    localStorage.setItem('USER_PROFILE', JSON.stringify(userProfile));
    loadProfile(); // Reload profile to reflect changes

    // Clear input fields even if no photo is uploaded
    document.getElementById('new-name').value = ''; // Clear name input
    profilePhotoInput.value = ''; // Clear file input

    // Show success message using SweetAlert
    Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: 'Your profile has been updated successfully.',
      confirmButtonText: 'OK',
    });
  }
}

// Complete Task
function completeTask(index) {
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
    Swal.fire({
      icon: 'success',
      title: 'Level Up!',
      text: `You are now Level ${xpData.level}`,
      confirmButtonText: 'OK',
    });
  }

  // Save to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('xp', JSON.stringify(xpData));

  // Reload UI
  loadTasks();
  loadCompletedTasks();
  updateXPBar();
}

// Undo Task
function undoTask(index) {
  const task = completedTasks[index];
  tasks.push(task);
  completedTasks.splice(index, 1);

  // Update XP
  const xpData = JSON.parse(localStorage.getItem('xp'));
  xpData.current -= task.xp;
  if (xpData.current < 0) xpData.current = 0;

  // Save to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('xp', JSON.stringify(xpData));

  // Reload UI
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
    // Apply penalties for uncompleted tasks
    const xpData = JSON.parse(localStorage.getItem('xp')) || { current: 0, level: 1 };
    tasks.forEach(task => {
      xpData.current -= task.penalty; // Deduct XP for uncompleted tasks
      if (xpData.current < 0) xpData.current = 0;
    });

    // Reset tasks and completed tasks
    tasks = [...config.tasks]; // Reset tasks to initial state
    completedTasks = []; // Clear completed tasks

    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('xp', JSON.stringify(xpData));
    localStorage.setItem('lastReset', nextReset.toISOString()); // Save the reset time

    // Reload UI
    loadTasks();
    loadCompletedTasks();
    updateXPBar();
  }

  // Schedule the next reset
  const timeUntilReset = nextReset - now;
  setTimeout(() => {
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