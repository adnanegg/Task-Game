// Hardcoded configuration
const config = {
  tasks: [
    { name: "Book", xp: 50, points: 10, category: "Task", penalty: 5 },
    { name: "Quran", xp: 50, points: 10, category: "Task", penalty: 5 },
    { name: "Sport", xp: 50, points: 10, category: "Task", penalty: 5 },
    { name: "Prayer At The Mosque", xp: 50, points: 10, category: "Task", penalty: 5 },
    { name: "listen to quoran", xp: 50, points: 10, category: "Task", penalty: 5 },
    { name: "15 Min Improvement", xp: 50, points: 10, category: "Task", penalty: 5 },
    { name: "Wake up early", xp: 50, points: 10, category: "Task", penalty: 5 }, 
    { name: "الشفع و الوتر", xp: 100, points: 40, category: "Bonus", penalty: 5 },
    { name: "Presentation", xp: 200, points: 50, category: "Bonus", penalty: 5 },
    { name: "One day no social Media", xp: 100, points: 30, category: "Bonus", penalty: 5 },
    { name: "ختم القرأن", xp: 200, points: 30, category: "Bonus", penalty: 5 },
    { name: "Attend the Weekly meeting", xp: 30, points: 10, category: "Bonus", penalty: 5 },
    { name: "Quran Exception", xp: 25, points: 5, category: "Task", penalty: 5 },
    { name: "Book Exception", xp: 25, points: 5, category: "Task", penalty: 5 },
    { name: "Prayer Exception", xp: 25, points: 5, category: "Task", penalty: 5 },
  ],
  xpThresholds: [2000, 6000, 12000, 18000,30000,50000],
  rankingNames: ["Warrior", "Master", "Grand Master", "Epic", "Legend", "Mythic"],
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
//Important functions the program rely on 

//Function to update the tasks and bonuses when clicking reset at the profile section 
//condition : there should be no task or bonus in the completed tasks section 


function updateTasksInLocalStorage() {
  // Update localStorage with the latest config.tasks
  localStorage.setItem('tasks', JSON.stringify(config.tasks));
}

//function to reset completed tasks and points Bar without affecting the XP
function resetCompletedTasks() {
  const xpData = JSON.parse(localStorage.getItem('xp')) || { current: 0, level: 1 };
  const pointsData = JSON.parse(localStorage.getItem('points')) || { current: 0, total: 100 };

  // Move all completed tasks back to the tasks list
  completedTasks.forEach(task => {
    tasks.push(task);
  });

  // Clear the completed tasks
  completedTasks = [];

  // Save the updated tasks and completed tasks to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

  // Reload the tasks and completed tasks
  loadTasks();
  loadCompletedTasks();

  // Show a success message
  Swal.fire({
    icon: 'success',
    title: 'Tasks Reset!',
    text: 'All completed tasks have been reset without deducting XP.',
    confirmButtonText: 'OK',
  });
}
//Function to reset PointsBar Progress 
function resetPointsBar() {
  // Reset points data to 0
  const pointsData = { current: 0, total: 100 }; // You can adjust the total if needed

  // Save the reset points data to localStorage
  localStorage.setItem('points', JSON.stringify(pointsData));

  // Update the points bar display
  updatePointsBar();

  // Show a success message
  Swal.fire({
    icon: 'success',
    title: 'Points Bar Reset!',
    text: 'The points bar has been reset to 0.',
    confirmButtonText: 'OK',
  });
}
//Function to reset PointsBar Progress 
function resetMonthlyPointsBar() {
  // Reset points data to 0
  const MpointsData = { current: 0, total: 3000 }; // You can adjust the total if needed

  // Save the reset points data to localStorage
  localStorage.setItem('Mpoints', JSON.stringify(MpointsData));

  // Update the points bar display
  updateMonthlyPointsBar();

  // Show a success message
  Swal.fire({
    icon: 'success',
    title: 'Monthly Points Bar Reset!',
    text: 'The Monthly points bar has been reset to 0.',
    confirmButtonText: 'OK',
  });
}

// Load user profile from localStorage
let userProfile = JSON.parse(localStorage.getItem('USER_PROFILE')) || {
  name: "User",
  photo: "assets/default-profile.png",
};
// Initialize tasks in localStorage if not already set
if (!localStorage.getItem('tasks')) {
  localStorage.setItem('tasks', JSON.stringify(config.tasks));
}
// Load tasks and completed tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks'));
// Load tasks and completed tasks from localStorage

let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
let pointsData = JSON.parse(localStorage.getItem('points')) || { current: 0, total: 1000 };
let MpointsData = JSON.parse(localStorage.getItem('Mpoints'))|| { current: 0, total: 3000 };

// DOM Elements
const profileImage = document.getElementById('profile-image');
const profileName = document.getElementById('profile-name');
const profileRank = document.getElementById('profile-rank');
const rankImage = document.getElementById('rank-image');
const xpBar = document.getElementById('xp-bar');
const xpText = document.getElementById('xp-text');
const taskList = document.getElementById('task-list');
const bonusTaskList = document.getElementById('bonus-task-list'); // Add this line
const completedTaskList = document.getElementById('completed-task-list');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const pointsBar = document.getElementById('points-bar');
const pointsText = document.getElementById('points-text');
const M_pointsBar = document.getElementById('M-points-bar');
const M_pointsText = document.getElementById('M-points-text');

// Toggle sidebar and buttons
// const menuToggle = document.getElementById('menu-toggle');
// const closeMenu = document.getElementById('close-menu');
// const sidebar = document.getElementById('sidebar');
// const mainContent = document.querySelector('.main-content');

// menuToggle.addEventListener('click', () => {
//   console.log('Menu Toggle Clicked');
//   sidebar.classList.remove('-translate-x-full'); // Show sidebar
//   sidebar.classList.add('translate-x-0');
//   menuToggle.classList.add('hidden'); // Hide menu button
//   closeMenu.classList.remove('hidden'); // Show close button
//   mainContent.classList.add('sidebar-open');
// });

// closeMenu.addEventListener('click', () => {
//   console.log('Close Menu Clicked');;
//   sidebar.classList.remove('translate-x-0'); // Hide sidebar
//   sidebar.classList.add('-translate-x-full');
//   closeMenu.classList.add('hidden'); // Hide close button
//   menuToggle.classList.remove('hidden'); // Show menu button
//   mainContent.classList.remove('sidebar-open');
// });

// Load profile and tasks
loadProfile();
loadTasks();
loadCompletedTasks();
setupDailyReset();
updatePointsBar();
updateMonthlyPointsBar();

// Load Tasks
function loadTasks() {
  taskList.innerHTML = '';
  bonusTaskList.innerHTML = ''; // Clear bonus tasks

  tasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'flex justify-between items-center p-2 border-b';


    taskItem.innerHTML = `
      <span class="text-1xl font-bold" style="color: black;"><span style="color:brown;">${task.name}</span>(<span class="xp">${task.xp}XP</span>, ${task.points} Points)</span>
      <button onclick="completeTask(${index})" class="p-1 bg-green-500 text-white rounded">Complete</button>
    `;
    taskList.appendChild(taskItem);
  // Add to the appropriate section based on the category
    if (task.category === "Task") {
      taskList.appendChild(taskItem); // Add to Daily Tasks
    } else if (task.category === "Bonus") {
      bonusTaskList.appendChild(taskItem); // Add to Bonus Tasks
    }
  });
}

// Load Completed Tasks
function loadCompletedTasks() {
  completedTaskList.innerHTML = '';
  completedTasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'flex justify-between items-center p-2 border-b';
    taskItem.innerHTML = `
      <span class="text-1xl font-bold" style="color: brown;">${task.name} (${task.xp} XP, ${task.points} Points)</span>
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

  profileRank.textContent = config.rankingNames[xpData.level - 1] || "Warrior";
  rankImage.src = config.rankImages[xpData.level] || "assets/rank-warrior.png";
  
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
      loadProfile();

      document.getElementById('new-name').value = '';
      profilePhotoInput.value = '';

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
    loadProfile();

    document.getElementById('new-name').value = '';
    profilePhotoInput.value = '';

    Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: 'Your profile has been updated successfully.',
      confirmButtonText: 'OK',
    });
  }
}


function completeTask(index) {
  const completedTask = tasks[index];
  completedTasks.push(completedTask);
  tasks.splice(index, 1);

  const xpData = JSON.parse(localStorage.getItem('xp')) || { current: 0, level: 1 };
  xpData.current += completedTask.xp;
  
  
  pointsData.current += completedTask.points;
  if (pointsData.current > pointsData.total) pointsData.total = pointsData.current;

  MpointsData.current += completedTask.points;
  if (MpointsData.current > MpointsData.total) MpointsData.total = MpointsData.current;
  

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

  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('xp', JSON.stringify(xpData));
  localStorage.setItem('points', JSON.stringify(pointsData));
  localStorage.setItem('Mpoints',JSON.stringify(MpointsData));
  console.log(pointsData.current)

  loadTasks();
  loadCompletedTasks();
  updateXPBar();
  updatePointsBar();
  updateMonthlyPointsBar();
  loadProfile();
}

// Undo Task
function undoTask(index) {
  const task = completedTasks[index];
  tasks.push(task);
  completedTasks.splice(index, 1);

  const xpData = JSON.parse(localStorage.getItem('xp'));
  xpData.current -= task.xp;
  if (xpData.current < 0) xpData.current = 0;

  // Update Points
  pointsData.current -= task.points || 0;
  if (pointsData.current < 0) pointsData.current = 0;
  localStorage.setItem('points', JSON.stringify(pointsData));

  MpointsData.current -= task.points || 0;
  if (MpointsData.current < 0) MpointsData.current = 0;
  localStorage.setItem('Mpoints', JSON.stringify(MpointsData));
  

  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('xp', JSON.stringify(xpData));

  loadTasks();
  loadCompletedTasks();
  updateXPBar();
  updatePointsBar();
  updateMonthlyPointsBar();
}

// Update XP Bar
function updateXPBar() {
  const xpData = JSON.parse(localStorage.getItem('xp')) || { current: 0, level: 1 };
  const xpThreshold = config.xpThresholds[xpData.level - 1] || 100;

  const xpPercentage = (xpData.current / xpThreshold) * 100;

  xpBar.style.transition = 'width 0.5s ease-in-out';
  xpBar.style.width = `${xpPercentage}%`;

  xpText.textContent = `${xpData.current}/${xpThreshold} XP`;

  if (xpPercentage >= 75) {
    xpBar.classList.remove('bg-blue-500', 'bg-yellow-500');
    xpBar.classList.add('bg-green-500');
  } else if (xpPercentage >= 50) {
    xpBar.classList.remove('bg-blue-500', 'bg-green-500');
    xpBar.classList.add('bg-yellow-500');
  } else {
    xpBar.classList.remove('bg-yellow-500', 'bg-green-500');
    xpBar.classList.add('bg-blue-500');
  }
}

// Update Points Bar
function updatePointsBar() {

  pointsData = JSON.parse(localStorage.getItem('points')) || { current: 0, total: 1000 };
 
  const pointsPercentage = (pointsData.current / pointsData.total) * 100;

  pointsBar.style.transition = 'width 0.5s ease-in-out';
  pointsBar.style.width = `${pointsPercentage}%`;
  pointsText.textContent = `${pointsData.current} pts`;

 

  if (pointsPercentage >= 75) {
    pointsBar.classList.remove('bg-blue-500', 'bg-yellow-500');
    pointsBar.classList.add('bg-green-500');
  } else if (pointsPercentage >= 50) {
    pointsBar.classList.remove('bg-blue-500', 'bg-green-500');
    pointsBar.classList.add('bg-yellow-500');
  } else {
    pointsBar.classList.remove('bg-yellow-500', 'bg-green-500');
    pointsBar.classList.add('bg-blue-500');
  }
}
function updateMonthlyPointsBar() {

  MpointsData = JSON.parse(localStorage.getItem('Mpoints')) || { current: 0, total: 3000 };
 
  const MpointsPercentage = (MpointsData.current / MpointsData.total) * 100;

  

  M_pointsBar.style.transition = 'width 0.5s ease-in-out';
  M_pointsBar.style.width = `${MpointsPercentage}%`;
  M_pointsText.textContent = `${MpointsData.current} pts`;

  if (MpointsPercentage >= 75) {
    M_pointsBar.classList.remove('bg-blue-500', 'bg-yellow-500');
    M_pointsBar.classList.add('bg-green-500');
  } else if (MpointsPercentage >= 50) {
    M_pointsBar.classList.remove('bg-blue-500', 'bg-green-500');
    M_pointsBar.classList.add('bg-yellow-500');
  } else {
    M_pointsBar.classList.remove('bg-yellow-500', 'bg-green-500');
    M_pointsBar.classList.add('bg-blue-500');
  }
  console.log("mine is working")
}

// Daily Reset Logic
function setupDailyReset() {
  const now = new Date();
  const lastReset = localStorage.getItem('lastReset') ? new Date(localStorage.getItem('lastReset')) : null;

  const nextReset = new Date(now);
  nextReset.setHours(5, 0, 0, 0);
  if (now >= nextReset) {
    nextReset.setDate(nextReset.getDate() + 1);
  }

  if (!lastReset || now >= nextReset) {
    const xpData = JSON.parse(localStorage.getItem('xp')) || { current: 0, level: 1 };
    tasks.forEach(task => {
      xpData.current -= task.penalty;
      if (xpData.current < 0) xpData.current = 0;
    });

    tasks = [...config.tasks];
    completedTasks = [];

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('xp', JSON.stringify(xpData));
    localStorage.setItem('lastReset', nextReset.toISOString());

    loadTasks();
    loadCompletedTasks();
    updateXPBar();
  }

  const timeUntilReset = nextReset - now;
  setTimeout(() => {
    setupDailyReset();
  }, timeUntilReset);
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}
