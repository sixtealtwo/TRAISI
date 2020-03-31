# Travel and Activity Internet Survey Interface

TRAISI is the new travel survey software developed by UTTRI. Its primary goal is the design and execution of individual and household travel surveys to aid in transportation planning and model development.

## Features

The project has the following feature goals:

* Survey Administration:
* Survey Design
* Administer (recruit respondents, manage interviewers and reviewers)
* Monitor
* Analyze
* Organize and Share

Survey Response:

* Various ways to access or be recruited (mail, email, phone, volunteer)
* Return and resume
* Be informed about the goals and terms
* Be accessible
* Easy access to assistance

## Dependencies

* Dotnet core 3.1
* PostgreSQL Server
* NodeJs 12 LTS
* Angular CLI
* Git Bash (on windows)

## Suggested IDEs

Visual Studio Code
JetBrains Rider

## Dev Env Setup

1. Install the requirements
2. Clone the repository to local project folder
3. Setup database users
    1. Username: `traisi` Password: `traisi`
    2. Username: `hangfire` Password: `hangfire`
    3. Ensure database is accessible from `localhost:5432`
4. run `./project_build_update.sh` at project root.
5. Set environment variable
    a. `ASPNETCORE_ENVIRONMENT=Development`
6. cd to src/TRAISI
7. Dotnet run

## TRAISI.TripDiary

If the TRAISI.TripDiary project is used (travel diary and travel mode questions), the git submodule must be initialized first.

```
git submodule update --init --recursive
```


## Project Structure

```
Project root/
├── docs – Project documents, right now just compodoc of Angular frontend
├── src
│   ├── TRAISI – Main project source folder
│   │   ├── Authorization
│   │   ├── ClientApp – Main angular frontend source
│   │   │   └── src
│   │   │       ├── admin-app
│   │   │       ├── admin-app-e2e
│   │   │       ├── shared
│   │   │       ├── survey-viewer-app
│   │   │       └── survey-viewer-app-e2e
│   │   ├── Controllers
│   │   ├── Helpers
│   │   ├── Properties
│   │   ├── Resources
│   │   ├── Services
│   │   │   ├── Geo
│   │   │   └── Interfaces
│   │   ├── ViewModels
│   │   ├── development
│   │   ├── extensions
│   │   └── wwwroot – Development server static root
│   ├── TRAISI.Data – Entity framework ORM definitions
│   │   ├── Binding
│   │   ├── Core
│   │   ├── Models
│   │   └── Repositories
│   ├── TRAISI.Extensions
│   ├── TRAISI.Questions – Code for different types of survey questions
│   │   └── src
│   └── TRAISI.SDK – Helper utilities for project
│       ├── Client
│       ├── Module
│       └── Server
└── test – unit test code
    ├── TRAISI.IntegrationTests
    └── TRAISI.UnitTests
```