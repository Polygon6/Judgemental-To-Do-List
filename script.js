//debug text
console.log('js has began to execute');

/* -------------------------- declaring varialbles -------------------------- */

//elements
const addTaskF = document.getElementById('addTaskForm');
const addTaskB = document.getElementById('addTask');
const cancleTaskB = document.getElementById('cancleButton');
const doneTaskB = document.getElementById('doneButton');

const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');

const tasks = document.getElementById('taskDeadlinePairs');
const insults = document.getElementById('insults');

const dailyMotivation = document.getElementById('motivationText');

//cache object (stores how many tasks have been failed)
cache = 0;

//for cache-based insults
lastReminder = 0;

//task object
task = function task (text, deadline, id, restoreTag)
{
	this.text = text;
	this.deadline = new Date().getTime() + deadline*60*60*1000;
	this.incepted = new Date().getTime();

	this.expires = 1000*60*60*24; //this is a temporary value, it gets addded with the date once the task is complete
	this.id = id;

	this.status = 'idle';
	this.events = [false, false, false, false]; //each index (.events[2] .events[0] .events[9] ect) has it's corresponding event, wich is true for insulted already and false for uninsulte
	
	/*
	Events:
	0 - half time, task not completed
	1 - completed before half time 'too early you're not trying' or something
	2 - completed after half time 'too late' or something
	3 - failed
	*/
}

//insult object
insult = function insult (id, type)
{
	this.text = generateInsult(type);
	this.id = id;
	this.expires = id + 1000*60*60*72;
}

//task and insult arrays
var taskArray = [];
var insultArray = [];

//insults
var ins0 = 
[
    "No pressure, but half the time passed on your pathetic task and I know where you live", //0 

    "Good job on successfully procrastinating for half the time you had on your task. Now go do something you failure.", //1 

    "You made a task and half the time passed on the deadline. Remember that because I will and if you don't aim high I will aim for your head.", //2 

    "Because I see that you didn't complete your task in half the time, I will lead by example of not procrastinating by finally putting a bounty on your family unless you stop procrastinating first.", //3 

    "Half your time is over. Do your task or I will defenestrate your family.", //4 

    "You have gone halfway through your task's time and still haven't completed it so I think you need some motivation: I am holding your family hostage.", //5 

    "You are halfway to failing a task you absolute discombobulated, disorganized, disobedient, donkey.", //6 

    "Half your time is over. Choose between enjoying the task or enjoying the next 24 hours.", //7 

    "Half your task's time is up, a half is one of two equal parts of something. For example you seem to have half a brain and I'm not even sure that half is working which is why I'm explaining basic math to you, moron.", //8 

    "Defenestrate yourself now to prove you can at least do one thing right and in a reasonable timespan, unlike what you did with that task.", //9 

    "Half your task's time is over. My lawyer says making threats is illegal but I will bring a whole new meaning to that word if you keep failing.", //10 

    "Half the time on your task is up, less eating sand and more working you imbecile.", //11 

    "Try eating your shoes you incoherent idiot. Maybe you can do that in a reasonable timeframe unlike your task.", //12 

    "Hmm, I see you are postponing your task to eat more sand and Legos like the imbecilic infant you are. Maybe you should learn your abc instead so you can understand what I am saying you dysfunctional child.", //13 

    "Wow, half the time is over for your task and you don't care. You seem to have less interest in your task than in your savings account, which says a lot because there's no money in it because you're worthless.", //14 

    "Half your task's time is up. It seems you aren't in the right mindset but I conversely happen to be in your walls so do the task now.", //15 

    "Half the time on your task is up, and procrastinating is the first step to failing. So don't fail or I will find you.", //16 

    "You have gone halfway through your task's time and still haven't completed it so I think you need some motivation: I am holding your family hostage.", //17 

    "You made a task and half the time passed on the deadline. Remember that because I will and if you don't aim high I will aim for your head.", //18 

    "Wow, half the time is over for your task and you don't care. You seem to have less interest in your task than in your savings account, which says a lot because there's no money in it because you're worthless."  //19 
];

var ins1 = 
[
    "Good job, you needed less than half the time you had for that task, you were so fast your parents forgot to love you. " ,

    "You took less than half the time it should take you for that task, which means you must be quite fast. That should help you because I am rapidly approaching your location. " ,

    "If you really did that task in under half the time you had for it, you only needed to set that deadline for half its time. If you give yourself half the time for your next task, I might give you back half your family after I am done with them. " ,

    "You took half the time that task had to finish it, so half the effort. Since you have spare time left let’s use it to discuss what is faster: your iq approaching zero or me approaching your location. " ,

    "Half the time isn’t even over and you marked your task complete. You really dropped that task faster than your parents dropping you as a child. " ,

    "I see you completed a task in less than half it's time, so half the effort. I guess with a half complete brain you can only make a half complete effort you lazy degenerate. " ,

    "You still had half that task’s time left, but you checked it complete. If you remove another task after half the effort I will remove half your family. " ,

    "I see that you still have half your task’s time left, you may want to use it to get a life. " ,

    "That task took you less time than it should. I suggest you use the time leftover to board up your windows and tell your disappointed family you love them because I know where you are. " ,

    "I see you really took your time with that task. You must have gone to claim your Guiness world record for brain damage halfway through. "
];

var ins2 = 
[
    "You should have been able to finish that task in half the time it took you, but you seem to meet only half of the expectations, which is why I will kidnap half your family if you take as long on the next task." ,

    "That task took you so long that even somebody as mentally degenerate as you could start a business, get married, have grandchildren and leave a legacy on the world in that time – and I know for a fact you will never do any of those things even with such a needlessly large supply of time as you seem to think you have.", 

    "You took your time with that task, I’ve seen tortoises and grandmas faster than you. But I guess we all make an effort proportional to our ability and your only ability is disappointing." ,

    "That task took you so long you made me believe Dwayne the rock has more hair on top of his head than you have brain cells inside of your head." ,

    "You must have thought you were a big person making that task. But with how long it took you there are only three big things about you: your mouth, how long that task took you and your parent's disappointment." ,

    "You took very long on that task, you might think you have time, but just know: I am death and I have seen generations before die and I will see generations ahead dying. I am the permanent observer of the universe and you cannot kill me in a way that matters. I can understand things you cannot guess at. I have seen everything and the universal spiraling ouroboros pattern of entropy and math will consume you just like your ancestors. And your patterns you are foolish enough to consider consciousness will leave no imprinted patterns on the calculus of the cosmos. You differ to your ancestors by that fact only. You are the prime epitome of failure I have never predicted to see before and the one thing my immortal mind has not yet understood through your sheer lack of any wisdom at all. You are the most unique human to ever live because it is a shock that you have by some miracle, managed to live. So just know: you are nothing. Just know: you will die and leave no legacy. Just know: even if you were a joke, you would not be a good one, you would be forgotten. And you will be. " ,

    "That task took you longer than kidnapping your family would take me. ",

    "Fun fact: the German company Zeiss makes the smoothest mirrors on the planet so that the Dutch company ASML can make very accurate lasers to burn silicon and make processors. You can probably get a job there because judging by how long that task took you, your brain is probably smoother than the mirrors. " ,

    "In the amount of time that task took you, I could marry your parent or guardian, divorce them, take custody of you and disown you to an orphanage and I might do that. " ,

    "With the amount of time that task took you, you might have disproved natural selection. " 
];

var ins3 = 
[
    "You failed that task like how you failed your parents: quickly, and you proved you are worthless by doing it. The only difference here is that your parents were surprised by it. " ,

    "That task is just like your life. You messed it up miserably and now you're trying to convince yourself it’s ok but it’s clear it isn’t. " ,

    "Here’s a fun fact: the human brain is roughly 80% water, but yours seems more like 100%. " ,

    "Very good job failing that task like how you failed your parents. " ,

    "I’m not disappointed, just angry. " ,

    " It seems I need to repeat myself every time you fail, and since you fail far too often, here is a list of things to remember for the next time it happens: you have no talents, your parents don’t love you, you have no life, you have no friends, you will never accomplish anything besides failing and disappointing, you are a joke of a human being and you are utterly worthless." ,

    " The only thing about you that never disappoints is your ability to fail." ,

    " With how often you fail things, I’m surprised you manage to do simple things like laundry and cooking. But what do I know? Maybe you have another to-do list reminding you how to breathe and walk. I’m sure you probably fail those tasks tragically too." ,

    " Here’s a lesson in coding: JavaScript cookies can only be 4 kilobytes long, so I have a limited amount of text I can give you before it stops getting saved. When this website was being developed, nobody thought someone would be degenerate enough to reach that limit but with your performance we are approaching it rapidly." ,

    " The last time I saw someone fail so bad was when a fish swam into a shark’s mouth on Discovery Channel. And with how you are performing recently that fish probably had its life more on-track than you." 


];

//less common insults
ins4 =
[
"I told you already, you failed that task like how you failed your parents, it dosen't matter you check it half complete now. The only half complete thing here is your brain.", //0
"You may lie you completed that task even after the deadline, but I know very well that deep down you know you failed too, just like how I know where you live.", //1
"You may be able to tell yourself that you completed that task after the deadline, but I am in your walls.", //2
"In case you got false confidence from marking that task half-complete, just know that task is as much of a faileour as you are.", //3
"If you think that task is complete, think again. The deadline has passed by now, the only thing you ever completed in your life is dissapointing your parents."  //4
]

ins5 =
[
'You have failed [INSERT CACHE] tasks so far, maybe your next task can be "get a life".', //0
"You have made and then failed [INSERT CACHE] tasks so far, maybe you should have reasonable goals, like learning to read the deadline. You probably can't do that and it would really help you.", //1
'You failed [INSERT CACHE] tasks to date, try to aim for your level, maybe your next task can be "eat crayons".', //2
"You just failed [INSERT CACHE] tasks, but don't be discouraged, some other people might have for instance made [INSERT CACHE] new friends, learned [INSERT CACHE] new things or made €[INSERT CACHE]0. Imagine how horrible that would be! But thankfully you are fully incapable of doing someething like that.", //3
'You failed [INSERT CACHE] tasks by now, I would make a remark but I ran out of those by now, surprising me with your brainrot seems to be your only achievement.'  //4
]

//daily motivation texts
var motivation =
[
'Fun fact: Many people consider Sunday a resting day, but you seem to think every day is a resting day so you can do away with that and actually do something for once.', //0 Sun
"Motivation of the day: Another Monday is another week to fail, and I'm sure you will.", //1 Mon
'Motivation of the day: One day you will get far in life, I hope you stay there.', //2 Tue
'Fun fact: The term "Salery" comes from ancient Roman times. It was an allowance for soliders to buy salt. This is what the term "Worth his/her salt means". Even today when salt is not traded for gold, I would say you are not worth a grain of it.', //3 Wed
'Motivation of the day: When you think you are completely useless or you are a faileour, remember that you are.', //4 Thu
'Motivation of the day: No.', //5 Fri
'Motivation of the day: Remember that even if you are a stain on humanity and you cannot do anything. It is at least really funney to watch you fail.'  //6 Sat
];

/* -------------------------- declaring frontend functions  -------------------------- */

//task form
function addTaskOpen () {
	addTaskF.style.visibility = 'visible';
}

function addTaskDone () {
	addTaskF.style.visibility = 'hidden';

	makeTask(taskInput.value, deadlineInput.value);
}

function addTaskCancle () {
	addTaskF.style.visibility = 'hidden';
}

//add task or insult
function makeTask (text, deadline) {
	let id = new Date().getTime();
	taskArray[taskArray.length] = new task(text, deadline, id);
	
	let work = document.createElement('div');
	work.className = 'taskDeadlinePair';
	work.id = `t[${id}]`;
	work.innerHTML =
	`
	<img class="taskStatus taskIdle"           src="images/Task-Idle.png"/>
	<img class="taskStatus taskFailed"         src="images/Task-Failed.png"/>
	<img class="taskStatus taskComplete"       src="images/Task-Complete.png"/>
	<img class="taskStatus taskFailedComplete" src="images/Task-Failed-Complete.png"/>
	<p class="task">${text}</p>
	<p class="time">${(new Date(new Date().getTime() + (parseInt(deadline)*1000*60*60)).toUTCString()).replace('GMT', '').replace('Mon', 'Monday').replace('Tue', 'Tuesday').replace('Wed', 'Wednesday').replace('Thu', 'Thursday').replace('Fri', 'Friday')}</p>
	<div class="taskTimePairDivider"></div>
	`;

	tasks.appendChild(work);

	//easter egg insult
	if (new Date(parseInt(deadline)) == 'Invalid Date') {
		makeInsult(4);
		taskArray[taskArray.length-1].status = 'failed'
		taskArray[taskArray.length-1].events[3] = true;
		taskArray[taskArray.length-1].expires = 0;
	}

	//add event listeners
	work.addEventListener('click', completeTask);
}

function makeInsult (type) {
	let id = new Date().getTime();
	insultArray[insultArray.length] = new insult(id, type);
	
	let work = document.createElement('p');
	work.className = 'insultText';
	work.id = `i[${id}]`;
	work.innerText = insultArray[insultArray.length-1].text;
	
	insults.appendChild(work);
}

//triggered when the task status icon is clicked
function completeTask(event)
{
	if ((getTask(event.target.parentElement.id).status == 'failed') || (getTask(event.target.parentElement.id).status == 'idle') || (getTask(event.target.parentElement.id).status == 'half-time'))
	{
		if (getTask(event.target.parentElement.id).events[3] == true) {
			event.target.parentElement.querySelector('.taskFailedComplete').style.opacity = 1;
			getTask(event.target.parentElement.id).status = 'failedComplete';
			makeInsult(5);
		}
		else {
			event.target.parentElement.querySelector('.taskComplete').style.opacity = 1;
			getTask(event.target.parentElement.id).status = 'complete';

			if (getTask(event.target.parentElement.id).events[0] == true) {
				getTask(event.target.parentElement.id).events[2] = true;
				makeInsult(2);
			}
			else {
				getTask(event.target.parentElement.id).events[1] = true;
				makeInsult(1);
			}
		}

		getTask(event.target.parentElement.id).expires = getTask(event.target.parentElement.id).expires + new Date().getTime();
	}
}

/* -------------------------- adding event listeners  -------------------------- */

//task form
addTaskB.addEventListener('click', addTaskOpen);
cancleTaskB.addEventListener('click', addTaskCancle);
doneTaskB.addEventListener('click', addTaskDone);

/* -------------------------- declaring backend functions -------------------------- */

//find task by id
function getTask (id) {
	for (var i = taskArray.length - 1; i >= 0; i--) {
		if (`t[${taskArray[i].id}]` == id) {
			return(taskArray[i]);
		}
	}
}

//generate Insults
function generateInsult (type) {
	if (type == 0) //halftime
	{
		return(ins0[Math.abs((Math.random()*20).toFixed(0)-1)]);
	}
	else if (type == 1) //before halftime
	{

		return(ins1[Math.abs((Math.random()*10).toFixed(0)-1)]);
	}
	else if (type == 2) //after halftime
	{
		if (cache > 2) {
			return(ins2[Math.abs((Math.random()*10).toFixed(0)-1)]);
		}
		else {
			return(ins2[Math.abs((Math.random()*5).toFixed(0)-1)]);
		}
	}
	else if (type == 3) //task failed
	{
		cache = cache + 1;

		if (cache > 2) {
			return(ins3[Math.abs((Math.random()*10).toFixed(0)-1)]);
		}
		else {
			return(ins3[Math.abs((Math.random()*5).toFixed(0)-1)]);
		}
		
	}
	else if (type == 4) { //wrong input
		return('Wow great start to productivity you dilapidating dinosour. You already failed before you even made a task by fumbling a form that even a three year old could understand. You are meant to insert a number for the deadline - it can be a decimal but it cannot be a braindead spasm like what you just wrote.');
	}
	else if (type == 5) { //halfcomplete
		return(ins4[Math.abs((Math.random()*5).toFixed(0)-1)]);
	}
	else if (type == 6) { //so far you failed X tasks
		return((ins5[Math.abs((Math.random()*5).toFixed(0)-1)]).replace('[INSERT CACHE]', cache));
	}
	else { //if type parameter is wrongly inputted
		return('bozo');
	}
}

//get cookies, a bit convoluted but it works ok
function getCookie (cookieName)
{
	const name = cookieName + "=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookieArray = decodedCookie.split(';');

	for (let i = 0; i < cookieArray.length; i++) {
		let cookie = cookieArray[i];

		while (cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}
}

//update document.cookie
function updateCookies () {
	document.cookie = `tasks=${JSON.stringify(taskArray)}; max-age=${1000*60*60*24*365}; sameSite=strict`;
	document.cookie = `insults=${JSON.stringify(insultArray)}; max-age=${1000*60*60*24*365}; sameSite=strict`;
	document.cookie = `cache=${JSON.stringify(cache)}; max-age=${1000*60*60*24*365}; sameSite=strict`;
}

//sets insults and tasks arrays with document.cookie
function loadCookies () {
	taskArray = JSON.parse(getCookie('tasks'));
	insultArray = JSON.parse(getCookie('insults'));
	cache = JSON.parse(getCookie('cache'));

	//updating lastrReminder
	lastReminder = cache;
}

//update tasks and insults
function update () {
	//update tasks
	for (var i = 0; i < taskArray.length; i++)
	{
		//setting a task to half-time status
		if ((taskArray[i].status == 'idle') && ((new Date().getTime()-taskArray[i].incepted) > ((taskArray[i].deadline-taskArray[i].incepted)/2)))
		{
			taskArray[i].events[0] = true;
			taskArray[i].status = 'half-time';
			makeInsult(0);
		}

		//setting a task to failed status
		if (((taskArray[i].status == 'half-time') || (taskArray[i].status == 'idle')) && (taskArray[i].deadline < new Date().getTime())){
			taskArray[i].status = 'failed';
			taskArray[i].events[3] = true;
			taskArray[i].expires = taskArray[i].expires + new Date().getTime();
			document.getElementById(`t[${taskArray[i].id}]`).querySelector('.taskFailed').style.opacity = 1;

			makeInsult(3);
		}

		//complete icon
		if (taskArray[i].status == 'complete') {
			document.getElementById(`t[${taskArray[i].id}]`).querySelector('.taskComplete').style.opacity = 1;
		}

		//failedComplete icon
		if (taskArray[i].status == 'failedComplete') {
			document.getElementById(`t[${taskArray[i].id}]`).querySelector('.taskFailedComplete').style.opacity = 1;
		}

		//failed icon
		if (taskArray[i].status == 'failed') {
			document.getElementById(`t[${taskArray[i].id}]`).querySelector('.taskFailed').style.opacity = 1;
		}

		//deleting task after deadline
		if ((taskArray[i].status !== 'half-time') && (taskArray[i].status !== 'idle') && (taskArray[i].expires < new Date().getTime())) {
			taskArray.splice(i, 1);
			i = i-1;
		}
	}
	
	//update insults
	for (var i = 0; i < insultArray.length; i++)
	{
		if (insultArray[i].expires < new Date().getTime()) {
			//deleting insult
			insultArray.splice(i);
		}
	}

	//update motivation
	dailyMotivation.innerText = motivation[new Date().getDay()];

	//just a reminder to the user
	if (((cache%3) == 0) && (cache !== lastReminder)) {
		makeInsult(6);
		lastReminder = cache;
	}

	//updating cookies
	updateCookies();
}

//loads tasks and insults from arrays to frontend
function loadFrontend () {
	for (var i = 0; i < taskArray.length; i++)
	{
		let text = taskArray[i].text;
		let id = taskArray[i].id;
	
		let work = document.createElement('div');
		work.className = 'taskDeadlinePair';
		work.id = `t[${id}]`;
		work.innerHTML =
		`
		<img class="taskStatus taskIdle"           src="images/Task-Idle.png"/>
		<img class="taskStatus taskFailed"         src="images/Task-Failed.png"/>
		<img class="taskStatus taskComplete"       src="images/Task-Complete.png"/>
		<img class="taskStatus taskFailedComplete" src="images/Task-Failed-Complete.png"/>
		<p class="task">${text}</p>
		<p class="time">${new Date(taskArray[i].deadline).toUTCString().replace('GMT', '').replace('Mon', 'Monday').replace('Tue', 'Tuesday').replace('Wed', 'Wednesday').replace('Thu', 'Thursday').replace('Fri', 'Friday')}</p>
		<div class="taskTimePairDivider"></div>
		`;
			
		tasks.appendChild(work);

		//add event listeners
		work.addEventListener('click', completeTask);
	}
	
	for (var i = 0; i < insultArray.length; i++)
	{
		let text = insultArray[i].text;
		let id = insultArray[i].id;
	
		let work = document.createElement('p');
		work.className = 'insultText';
		work.id = `i[${id}]`;
		work.innerText = text;
		
		insults.appendChild(work);
	}
}

/* -------------------------- calling backend functions -------------------------- */

if (document.cookie !== "") {
	loadCookies();
}
loadFrontend();

setInterval(update, 100);