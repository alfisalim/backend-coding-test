# Riders Management System

This project is a requirement to become a Backend Developer at Kanggo. The Goal of the project is to create a system that can manage data of the riders using node js and sqlite3. there are several of the services in the project such as add and get data like starting point endpoint, riders data, etc.

## Table Of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Service](#service)
* [Authors](#Authors)

### Installation

the installation tutorial in this documentation is only on windows

* Install node on your operating system, ensure `node > 8.6` and `npm` installed. You can find the installer on (https://nodejs.org/en/download/).
	- Follow instruction to install node untill finish.
	- check whether the node is installed successfully or not by write command `node -v` and `npm -v` in your console.
	- if they are installed successfully, the output will show their version. 
<br />

* Install all the required tools and configurations using Microsoft's windows-build-tools
	- option 1 : Using `npm install --global windows-build-tools` from console (run as Administrator).
	- option 2 : Install Visual C++ Build Environment :  Visual Studio Build Tools (using "Visual C++ build tools" workload) or Visual Studio 2017 Community (using the "Desktop development with C++" workload). and then launch using command `npm config set msvs_version 2017` in your console 
<br />

* Change directory to this project directory using command `cd /path/to/<name of thi project>` and then Install all the required module in this project by write command `npm install` in your console


### Usage

1. Change directory to this project directory using command 
	`cd /path/to/<name of thi project>`
 
2. Run command `npm start` in your console to starting server

3. Open new console to running all of service in the project. In general, command format to access service is `curl -X <HTTP METHOD> [OPTIONS] <URL>`
	
	- for access service home, using command `curl -X GET localhost:8010/health`

		The Response is :
		```
		{
			"code":1,
			"message":"ok",
			"data":null
		}
		```

	- for access service insert riders data, using command `curl -X POST -H "Content-Type:application/json" -d "<DATA>" localhost:8010/rides` <br />
		for example :
		```
		curl -X POST -H "Content-Type:application/json" -d "{\"start_lat\":7.123923,\"start_long\":23.23948,\"end_lat\":50.34508,\"end_long\":67.23423,\"rider_name\":\"Alfi Salim\",\"driver_name\":\"Alfi\",\"driver_vehicle\":\"bike\"}" http://localhost:8010/rides/
		```

		The Response is :
		```
		{
			"rideID":3,
			"startLat":7.123923,
			"startLong":23.23948,
			"endLat":50.34508,
			"endLong":67.23423,
			"riderName":"Alfi Salim",
			"driverName":"Alfi",
			"driverVehicle":"bike",
			"created":"2020-12-20 10:31:28"
		}
		```
		##### Visit [Service](#service) part for detail about request body in this service.

	- for access service get riders data, using command `curl -X GET localhost:8010/rides`

		The Response is :
		```
		[
			{
				"rideID":1,
				"startLat":7.123923,
				"startLong":23.23948,
				"endLat":50.34508,
				"endLong":67.23423,
				"riderName":"Alfi Salim",
				"driverName":"Alfi",
				"driverVehicle":"bike",
				"created":"2020-12-20 06:53:49"
			},
			{
				"rideID":2,
				"startLat":7.123923,
				"startLong":23.23948,
				"endLat":50.34508,
				"endLong":67.23423,
				"riderName":"Alfi Salim",
				"driverName":"Alfi",
				"driverVehicle":"bike",
				"created":"2020-12-20 10:11:38"
			},
			{
				"rideID":3,
				"startLat":7.123923,
				"startLong":23.23948,
				"endLat":50.34508,
				"endLong":67.23423,
				"riderName":"Alfi Salim",
				"driverName":"Alfi",
				"driverVehicle":"bike",
				"created":"2020-12-20 10:31:28"
			}
		]
		```

	- for access service get certain riders data, using command `curl -X GET localhost:8010/rides:<id>` <br />
		for example : 
		```
		curl -X GET localhost:8010/rides:1
		```

		The Response is :
		```
		{
			"rideID":1,
			"startLat":7.123923,
			"startLong":23.23948,
			"endLat":50.34508,
			"endLong":67.23423,
			"riderName":"Alfi Salim",
			"driverName":"Alfi",
			"driverVehicle":"bike",
			"created":"2020-12-20 06:53:49"
		}
		```


### Service

| Endpoint | HTTP Method | Body | Param | Definition
| --- | --- | --- | --- | --- |
| /health | GET | - | - | Get some information that indicate the server was running successfully  |
| /rides | POST | * start_lat (required, numeric between -75 to 75 degree) <br /> * start_long (required, numeric between -195 to 195 degree) <br /> * end_lat (required, numeric between -75 to 75 degree) <br /> * end_long (required, numeric between -195 to 195 degree) <br /> * rider_name (required, string) <br /> * driver_name (required, string) <br /> * driver_vehicle (required, string) <br /> | - | Insert new data into table Riders  |
| /health | GET | - | - | Get some information that indicate the server was running successfully  |
| /health | GET | - | - | Get some information that indicate the server was running successfully  |


## Authors

* **Alfi Salim** - *Initial work* - [alfisalim](https://github.com/alfisalim)