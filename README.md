# Glitterbot_Simulator
Glitterbot is a 2nd yeargroup project which is a web-based simulation. It consists of 2 robots collaborating to collect litter from a park.
The drone flies the sky scanning for potential litter, sends the location back to the server, which in turn will send a path to the rover
to the litter, that the rover will collect
## Documentation
* [Google Drive](https://drive.google.com/open?id=1AVRqvaEoW0lo5PRXyDMAQ6pkdIHL36RG) - Diagrams/Designs/MeetingDoc/GanttChart
## Prerequisist//TODO
Install Node.js (latest version)
* [Node.js](https://nodejs.org/it/)
## Getting Started
In order to install the project, pull it and then move into the root folder ("Glitterbot_Simulator")
on the terminal run the following command
```
npm install
```
wait for all the modules to be installed (a new folder called "node_modules" should appear in the root folder)
then move into src/server folder and run this command on the terminal
```
node index.js
```
this will initialize the application and it will listen to a port, go to a browser and go to the following link
* [localhost](http://localhost:3000)
For now the application just displays the socket connection working (two small dots will move based on a path sent from the backend)
the red dot is the "drone" and the blue dot is the "rover"
There are other features being built but they're not merged yet, still in development.

## Currently in development
* Branch Classes - backend classes for rover and drove - Yichun Yuan, Xinyang Zhang (Deprecated)
* Branch GUI - User interface for the website - Zain Ali
* Branch Litter - Adding digital litter on the map in order for the drone and rover to interact with it - Asad Mahmood
* Branch Pathfinding - Working on the pathfinding system for the rover - Scott McCumskays, William Connors
* Branch grid_system - Setting the map on the website and the basic foundation of the project, including the socket connection
                        - Zain Ali
* Branch scanPath - the path that the drone should take when he goes to scan an area - Xinyang Zhang, Yichun Yuan


## Authors
Zain Ali, Asad Mahmood, Scott McCumskays, Yichun Yuan, Xinyang Zhang, William Connors
