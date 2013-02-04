![Jukebox Logo](http://coderead.files.wordpress.com/2013/02/logo.png?w=320)

A Node.js jukebox for playing music on Linux (or the Raspberry Pi).

A .NET version of this project is available [here](https://github.com/richorama/Jukebox).

## How it works

When the script starts it scans the file system for all MP3 files.

Users can browse the music collection and queue tracks up for playing.

Tracks in the queue are played on the machine running the web server.

## Installation

Installing Node.js (Ubuntu)
```
sudo apt-get install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs npm
```

Installing Node.js (Raspbian "wheezy")
```
apt-get install python g++ make
mkdir ~/nodejs && cd $_
wget -N http://nodejs.org/dist/node-latest.tar.gz
tar xzvf node-latest.tar.gz && cd `ls -rd node-v*`
./configure
make install
```
For more installation instructions, see here: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager


Installing the Jukebox
```
sudo apt-get install mpg123 git
git clone git://github.com/richorama/NodeJukebox.git
cd NodeJukebox
sudo npm install
```

Starting the Jukebox
```
node server
```

The Jukebox will be started on port 1337 by default: [http://localhost:1337](http://localhost:1337)



