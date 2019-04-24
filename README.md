# Glitterbot_Simulator
Glitterbot is a 2nd yeargroup project which consists of a mobile application and website. To summerize, the website has a frontend to visualise all of the robots and what they are currently doing, the backend is where all of the logic and calculations happen and the application is used to simulate an actual drone.
## Website:
The website consists of 2 robots collaborating to collect litter from a park. The drone flies through the park scanning for potential litter and obstacles using a pathing algorithm, sends the location back to the server, which in turn will send a path to the rover. The rover will then process this path and go to collect the litter, using a pathing algorithm to avoid any obstacles such as rocks or trees. This is all visualised through a 2D grid system which represents the map, a red dot which respresents the drone, a blue circle that represents the rover and a purple circle that represents the phone drone.

## Mobile Application:
The mobile application is an implementation of the drone part of the project, allowing a mobile phone to simulate the drone. The mobile phone application is connected to the backend of the website and sends its location to the server everytime it changes. It allows the user to specify the dimensions of the park that is displayed on the website using a start and end button to specify the top left corner of the park and the bottom right corner of the park respectively. It also allows the user, who is simulating a drone, to detect a litter and then send that litter location to the server. You can find the mobile appliication on the branch:
```
appDevelopment
```

## Documentation
* [Google Drive](https://drive.google.com/open?id=1AVRqvaEoW0lo5PRXyDMAQ6pkdIHL36RG) - Diagrams/Designs/MeetingDoc/GanttChart
## How to Install:
For infomation on how to install both the website and mobile application successfully follow the guide linked below:
* [User Manual](https://drive.google.com/open?id=12lIZ62dIeISMW-6cKP9SUp9c51RePznj)

## Main Branches
* Master - Main branch with all working changes.
* Development - Branch with features that are being tested before being merged into the Master.
* appDevelopment - Main application development branch with all working features.

## Authors
Zain Ali, Asad Mahmood, Scott McCumskays, Yichun Yuan, Xinyang Zhang, William Connors
