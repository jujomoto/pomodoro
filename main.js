let tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

const badd = document.querySelector('#bAdd');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');
const divTime = document.querySelector('#time #value');

renderTime();
renderTasks();

form.addEventListener('submit', e => {
	e.preventDefault();
	if (itTask.value) {
		createTask(itTask.value);
		itTask.value = '';
		renderTasks();
	}
});

function createTask (value) {
	const newTask = {
		id: (Math.random()*100).toString(36).slice(3),
		title: value, 
		completed: false
	};
	tasks.unshift(newTask);
}

function renderTasks () {
	let html = tasks.map(task => {
		return `
			<div class="task">
				<button class="delete" data-id="${task.id}"> Delete</button>
				<div class="completed">${task.completed ? `<span class="done">Done</span>` : `<button class="start-button" data-id="${task.id}"> Start </button>`}</div>
				<div class="title">${task.title}</div>
			</div>
		`;
	}).join('');
	document.querySelector('#tasks').innerHTML = html;

	//get the button collection and set a click event to each one
	const startButtons = document.querySelectorAll('.task .start-button');
	startButtons.forEach(button => {
		button.addEventListener('click', e => {
			if (!timer) {
				const id = button.getAttribute('data-id');
				startButtonHandler(id);
				button.textContent = 'In progress...'
			}	
		});
	});

	//get delete buttons and set click event
	let deleteButtons = document.querySelectorAll('.task .delete');
	deleteButtons.forEach(task => {
		task.addEventListener('click', e => {
			let id = task.getAttribute('data-id');
			tasks = tasks.filter(task => task.id !== id);
			renderTasks();
		});
	});
	

}

//calc the remainning time, starting in 25 minutes
function startButtonHandler (id) {
	time = 25 * 60, // calc 25 minutes to seconds
	current = id;
	const taskIndex = tasks.findIndex(task => task.id === id);
	taskName.textContent = tasks[taskIndex].title;

	renderTime();
	timer = setInterval(()=>{
		time--;
		renderTime();
		if (time === 0) {
			clearInterval(timer);
			// current = null;
			// taskName.textContent = '';
			markCompleted(id);
			renderTasks();
			startBreak();
		}
	},1000);
}

function startBreak () {
	time = 5 * 60;
	taskName.textContent = 'Break';

	renderTime();
	timerBreak = setInterval(()=>{
		time--;
		renderTime();
		if (time === 0) {
			current = null;
			taskName.textContent = '';
			timer = null;

			clearInterval(timerBreak);
			renderTasks();
		}
	}, 1000);
}

function renderTime () {
	let minutes = parseInt(time / 60),
			seconds = parseInt(time % 60);
	divTime.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function markCompleted (id) {
	let index = tasks.findIndex(task => task.id === id);
	tasks[index].completed = true;
}
