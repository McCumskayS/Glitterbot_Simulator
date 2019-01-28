# Glitterbot_Simulator
Glitterbot is a 2nd yeargroup project which is a web-based simulation. It consists of 2 robots collaborating to collect litter from a park. The drone flies through the park scanning for potential litter and obstacles, sends the location back to the server, which in turn will send a path to the rover. The rover will then process this path and go to collect the litter, using a pathing algorithm to avoid any obstacles such as rocks or water. This is all visualised through a 2D grid system which represents the map, a red dot which respresents the drone and a blue square that represents the rover.
## Documentation
* [Google Drive](https://drive.google.com/open?id=1AVRqvaEoW0lo5PRXyDMAQ6pkdIHL36RG) - Diagrams/Designs/MeetingDoc/GanttChart
## Prerequisites
Install Node.js (latest version)
* [Node.js](https://nodejs.org/it/)
## Getting Started
In order to install the project follow the following steps:
* Pull it from the master and then move into the root folder ("Glitterbot_Simulator")
* On the terminal run the following command :
```
npm install
```
* Wait for all the modules to be installed (a new folder called "node_modules" should appear in the root folder)
* Move into src/server folder and run this command on the terminal :
```
node index.js
```
this will initialize the application and it will listen to a port
* Go to a browser and go to the following link: [localhost](http://localhost:3000)

For now the application just displays the socket connections working (two small dots will move based on a path sent from the backend)
There are other features being built but they're not merged yet i.e. still in development.

## Currently in development
* Branch Classes - backend classes for rover and drove - Yichun Yuan, Xinyang Zhang (Currently put aside)
* Branch GUI - User interface for the website - Zain Ali
* Branch Litter - Adding digital litter on the map in order for the drone and rover to interact with it - Asad Mahmood, Zain Ali
* Branch Pathfinding - Working on the pathfinding system for the rover - Scott McCumskays, William Connors
* Branch grid_system - Setting the map on the website and the basic foundation of the project, including the socket connection - Zain Ali, Asad Mahmood
* Branch scanPath - the path that the drone should take when he goes to scan an area - Xinyang Zhang, Yichun Yuan
* Branch diagonalMovement - test


## Authors
Zain Ali, Asad Mahmood, Scott McCumskays, Yichun Yuan, Xinyang Zhang, William Connors
