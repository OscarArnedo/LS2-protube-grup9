# PROTUBE BACKEND

## Description
This is the backend of the project. 
It is a REST API that provides the data for the frontend. 
It is built with SpringBoot in Java21, and PostgreSQL.

## How to run on DEV environment

1. Clone the repository
2. Open the project in your favorite IDE
3. Create a PostgreSQL database
4. Configure the IDE:
   1. Create a new Java Application Run Configuration
   2. Add VM options: `-Dspring.profiles.active=dev`
   3. Configure the following environment variables:
       - `ENV_PROTUBE_DB`: The name of the database. For example: *protube*
       - `ENV_PROTUBE_DB_USER`: The username of the database. For example: *admin*
       - `ENV_PROTUBE_DB_PWD`: The password of the database. For example: *admin1234*
       - `ENV_PROTUBE_STORE_DIR`: The directory where the files are stored. For example: *C:/protube/store/*
5. Run the application

> [!IMPORTANT] 
> The `ENV_PROTUBE_STORE_DIR` must end with a slash `/`

> [!NOTE]
> Database must be active before running backend.

> [!NOTE]
> If you want to see some video examples run the tooling/videoGrabber script and set the path of the videos to the ENV variable `ENV_PROTUBE_STORE_DIR`.  
> Be aware that the all the users created in the database will have by default the same password `password123`.