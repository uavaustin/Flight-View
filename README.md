Flight&nbsp;View
==

[![Build Status](
    https://travis-ci.org/uavaustin/Flight-View.svg?branch=master)](
    https://travis-ci.org/uavaustin/Flight-View)
[![Code Climate](
    https://codeclimate.com/github/uavaustin/Flight-View/badges/gpa.svg)](
    https://codeclimate.com/github/uavaustin/Flight-View)
[![Test Coverage](
    https://codeclimate.com/github/uavaustin/Flight-View/badges/coverage.svg)](
    https://codeclimate.com/github/uavaustin/Flight-View/coverage)

> Unmanned Aerial Vehicle Team | UT Austin

Main GUI used to display telemetry and other flight information built on
[Electron](http://electron.atom.io) by GitHub.

Installation
--
Ensure you have [Git](https://git-scm.com/downloads) installed on your system
first in order to clone the repository. Alternatively, the files may be simply
downloaded from GitHub for installation.

Node.js and npm are needed to install and run Flight&nbsp;View. Install
[Node.js](https://nodejs.org/en/download/) (the package manager npm is
included with it as well).

Navigate to the directory where you want to install Flight&nbsp;View and run
the following to clone the repository and install all needed dependencies:

```
git clone https://github.com/uavaustin/Flight-View.git
cd Flight-View
npm install
```

Usage
--
To run the program, navigate to the Flight&nbsp;View and run the following:
```
npm start
```

AUVSI&nbsp;SUAS Competition Server
--
Flight&nbsp;View can connect to the
[AUVSI&nbsp;SUAS Competition Server](https://github.com/auvsi-suas/interop) to
upload telemetry, upload targets, download mission data, etc.

The server is released as a Docker image. To run the server, install
[Docker](https://docs.docker.com/engine/installation/) and then run the
following to have the server run in the Docker daemon:
```
docker run -itd -p 8000:80 --name interop-server auvsisuas/interop-server
```
The following can be used to start and stop the server:
```
docker start interop-server
docker stop interop-server
```

The default server username and password combinations are:
- `testuser` and `testpass`
- `testadmin` and `testpass`

Repository Contents
--
The program is divided into two processes: the main and renderer processes.

The main process handles creating the main window and window events, server and
client connections to other programs, and managing the database,
etc.

The renderer process runs in the Chromium browser and manages the GUI
accessible to the user. An IPC connection between the main and renderer process
connects the two processes.

- `/flight-view`: Files for the renderer process.
- `/core`: Files for the main process.
- `/util`: Files shared by both the renderer and main processes.
- `/scripts`: Scripts needed for installation, building, etc.
- `/tests`: Tests for various files.
- `/LICENSE`: The license for this repository.
