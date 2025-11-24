# productivity_app
Productivity app to use when doing deep work. Main objective is to easily keep track of time and tasks while doing deep work.

## My current work flow : 
When doing deep work i set a chrono with the pomodoro technique (25 min work, 5 min break). And I also have a task of my tasks that I have to do, usually tasks and subtasks. I start my session by adding the time slots i will work in for example if I know I do deep work from 9am to 12am I will have the following in a txt file: 
- 9:05 - 9:30 -> 
- 9:35 - 10:00 ->
- 10:05 - 10:30 ->
- 10:35 - 11:00 ->
- 11:05 - 11:30 ->
- 11:35 - 12:00 ->

I will also have a TODO list for instance : 
- Task 1
  - Subtask 
  - Subtask 
- Task 2
  - Subtask 
  - Subtask 
- Task 3
- Task 4

And when I finish a timeslot I will write next to -> what i did during that time slot (which one of the tasks). This helps me visualise what I need to do with the tasks and seeing what has been done in the sessions helps me keep track of how much work I have been doing and whether I am productive. 

## App design: 
Now my goal with this project is to create an app that takes care of that. Let's see how I want it to be : 

When I am starting a deep work session : I want to start planning the session, the session duration can only be a multiple of 30 minutes - 5 minutes. and I will enter the session duration before starting the session : i enter a start time and then select one of the possible end times for example. 
Then I want to be able to add some tasks and sutasks. This should be displayed as a simple list and each list element title shoudl be Task(/Subtask) I put the subtask in parenthesis because it is not necessary. Then I should be able to add a description of the task next to the title. When starting the session and listing my tasks I want to be able to add tasks from a previous session, if adding them they should be added manually through some kind of interface. but I dont want them to automatically be added. 

Once I am within a session I want to have the following things displayed : 
on the top left a chrono displaying if i am in a break or work and the time left. 
on the top right a history of the current session similar to what I do in my txt file. with a delimitation at where we currently are and the possibility to add stuff to previous tim eslots or the current one (stuff that has been done or is beeing dnoe to keep track of progress).
On the bottom a list of tasks and subtasks with the possibility to edit them add one move them to add the most important ones at the top. Delete them or mark them as done. When marked as done they should be at the bottom in another section of done tasks. 

I want to be able to stop the session at any time and all sessions should automatically be saved (done tasks and hisstory ect..) This way I will add future features to see the amount of deep work done each day and any other statistics. 

I woudl like to be able to easily modify the time slots if I need to take a longer break or stop earlier ect... I am not sure how to implement this yet but my idea is that the time slot window shoudl be editable at any time during the session. and I should be able to add tasks in the past and change the time slots as needed. 

I would also like to have a notification system to remind me when a work or break session starts or ends. I would like to only have pop up screen notifications and not sound notifications.

## Features
### Main
- Timer for deep work sessions : Pomodoro technique (25 min work, 5 min break)
- Task management: Add, edit, delete tasks
- Subtasks: Break down tasks into smaller, manageable parts
- Easy proiritization: Drag and drop tasks to reorder them
- work sesssion history: Log of completed time slots with associated tasks
- work sesssion planning : visualisation of all pomodoro time slots in a session with possibility to edit them

### secondary
- Statistics: Track your productivity over time with charts and graphs
- Notifications: Reminders to start/stop work sessions
- 


