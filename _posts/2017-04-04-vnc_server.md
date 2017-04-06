---
layout: post
title: "Set up vnc server for multiple users with centos-7 x86_64 vps"
description: ""
category: 
tags: ["centos7", "linux", "vnc", "tigervnc", "remote" ]
---

# Starting point


	# df
	Filesystem     1K-blocks   Used Available Use% Mounted on
	/dev/simfs      83886080 746624  83139456   1% /
	devtmpfs         1048576      0   1048576   0% /dev
	tmpfs            1048576      0   1048576   0% /dev/shm
	tmpfs            1048576     96   1048480   1% /run
	tmpfs            1048576      0   1048576   0% /sys/fs/cgroup
	tmpfs             209716      0    209716   0% /run/user/0
	# free
		      total        used        free      shared  buff/cache   available
	Mem:        2097152       17352     1450968        2664      628832     1896630
	# cat /etc/centos-release
	CentOS Linux release 7.3.1611 (Core)

# Reference documentation

* [Digital Ocean: CentOS 7 vnc server setup](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-vnc-remote-access-for-the-gnome-desktop-on-centos-7)
* [Install MATE desktop in CentOS 7](http://browncoati.com/posts/centos_7_with_mate.html)


# Set up user access to server


Add non-root user with sudo access

	# useradd -c "supersuperman" superman
	# usermod -a -G wheel superman
	# passwd superman

From fedora: create ssh key for our new user and push it to vnc server

	$ ssh-keygen -b 4096 -C 'superman from fedora' -N '' -f ~/.ssh/vncsuperman
	Generating public/private rsa key pair.
	Your identification has been saved in /home/superman/.ssh/vncsuperman.
	Your public key has been saved in /home/superman/.ssh/vncsuperman.pub.
	The key fingerprint is:
	SHA256:QODVOlZkFX0XcYQDGXBo9S6BYLWnxljnkcwLrZ85MIo superman from fedora
	The key's randomart image is:
	+---[RSA 4096]----+
	|    ..oo=o=*=+ ==|
	|   . o oo.oBoo+ o|
	|    . .o .= X..o |
	|      +. + B =   |
	|     . .S B + .  |
	|       . o + +   |
	|      E .   =    |
	|             .   |
	|                 |
	+----[SHA256]-----+

In file ~/.ssh/config add our server ip for fast access

	Host vncsuperman
	  HostName 2.2.2.2
	  User superman
	  Port 22
	  IdentityFile ~/.ssh/vncsuperman


Copy new ssh key to server:

	$ ssh-copy-id vncsuperman

Now superman may login to vnc server with

	$ ssh vncsuperman

# Install X11 and MATE desktop

	# yum install -y epel-release
	# yum install -y tigervnc-server
	# cp /lib/systemd/system/vncserver@.service /etc/systemd/system/vncserver@:4.service

Edit new service (unit) file

	# sed -i -e 's/<USER>/superman/' -e 's|/usr/bin/vncserver %i|/usr/bin/vncserver %i -geometry 1280x1024|' /etc/systemd/system/vncserver@:4.service

or

	# perl -lnp -i -e 's/<USER>/superman/; s|/usr/bin/vncserver %i\K| -geometry 1280x1024|;' /etc/systemd/system/vncserver@:4.service

Check the difference

	# diff -u /lib/systemd/system/vncserver@.service /etc/systemd/system/vncserver@:4.service
	--- /lib/systemd/system/vncserver@.service	2016-11-16 13:38:52.000000000 +0000
	+++ /etc/systemd/system/vncserver@:4.service	2017-04-04 20:47:09.702234038 +0000
	@@ -2,10 +2,10 @@
	 #
	 # Quick HowTo:
	 # 1. Copy this file to /etc/systemd/system/vncserver@.service
	-# 2. Edit /etc/systemd/system/vncserver@.service, replacing <USER>
	+# 2. Edit /etc/systemd/system/vncserver@.service, replacing superman
	 #    with the actual user name. Leave the remaining lines of the file unmodified
	-#    (ExecStart=/usr/sbin/runuser -l <USER> -c "/usr/bin/vncserver %i"
	-#     PIDFile=/home/<USER>/.vnc/%H%i.pid)
	+#    (ExecStart=/usr/sbin/runuser -l superman -c "/usr/bin/vncserver %i -geometry 1280x1024"
	+#     PIDFile=/home/superman/.vnc/%H%i.pid)
	 # 3. Run `systemctl daemon-reload`
	 # 4. Run `systemctl enable vncserver@:<display>.service`
	 #
	@@ -39,8 +39,8 @@
	 Type=forking
	 # Clean any existing files in /tmp/.X11-unix environment
	 ExecStartPre=/bin/sh -c '/usr/bin/vncserver -kill %i > /dev/null 2>&1 || :'
	-ExecStart=/usr/sbin/runuser -l <USER> -c "/usr/bin/vncserver %i"
	-PIDFile=/home/<USER>/.vnc/%H%i.pid
	+ExecStart=/usr/sbin/runuser -l superman -c "/usr/bin/vncserver %i -geometry 1280x1024"
	+PIDFile=/home/superman/.vnc/%H%i.pid
	 ExecStop=/bin/sh -c '/usr/bin/vncserver -kill %i > /dev/null 2>&1 || :'
	 
	 [Install]


Make systemd reload unit files 

	# systemctl daemon-reload

Login as regular user and create vnc password

	$ ssh vncsuperman
	$ vncpasswd 
	Password:
	Verify:
	$ logout

Here you should enter password to connect to vnc server. This password may (and should) differ from password you login with.

Install netstat

	# yum install -y net-tools

Enable vnc service

	## systemctl status vncserver@:4.service
	● vncserver@:4.service - Remote desktop service (VNC)
	   Loaded: loaded (/etc/systemd/system/vncserver@:4.service; disabled; vendor preset: disabled)
	   Active: inactive (dead)
	# systemctl enable vncserver@:4.service
	Created symlink from /etc/systemd/system/multi-user.target.wants/vncserver@:4.service to /etc/systemd/system/vncserver@:4.service.
	# systemctl status vncserver@:4.service
	● vncserver@:4.service - Remote desktop service (VNC)
	   Loaded: loaded (/etc/systemd/system/vncserver@:4.service; enabled; vendor preset: disabled)
	   Active: inactive (dead)
	# systemctl start vncserver@:4.service


Check if vnc service started

	# # netstat -autnp | grep vnc
	tcp        0      0 0.0.0.0:5904            0.0.0.0:*               LISTEN      1720/Xvnc
	tcp        0      0 0.0.0.0:6004            0.0.0.0:*               LISTEN      1720/Xvnc
	tcp6       0      0 :::5904                 :::*                    LISTEN      1720/Xvnc
	tcp6       0      0 :::6004                 :::*                    LISTEN      1720/Xvnc



# Connecting from Fedora 22 workstation to our new CentOS 7 vnc server

Install tigervnc

	$ sudo dnf install -y tigervnc

Go to fedora Desktop menu (i use MATE) Applications->Internet->Tiger VNC Viewer

Enter server address 2.2.2.2:4 (replace 2.2.2.2 with your server ip or hostname)

Result: graphical screen with no panel, just vnc settings. 


# Optional: disable extra network services

See what is started
	
	# systemctl list-unit-files | grep enabled
	autovt@.service                        enabled
	crond.service                          enabled
	getty@.service                         enabled
	httpd.service                          enabled
	iptables.service                       enabled
	quotaon.service                        enabled
	rsyslog.service                        enabled

	saslauthd.service                      enabled
	sendmail.service                       enabled
	sm-client.service                      enabled
	sshd.service                           enabled
	systemd-readahead-collect.service      enabled
	systemd-readahead-drop.service         enabled
	systemd-readahead-replay.service       enabled
	vncserver@:4.service                   enabled
	vzfifo.service                         enabled
	xinetd.service                         enabled
	rpcbind.socket                         enabled
	default.target                         enabled
	multi-user.target                      enabled
	remote-fs.target                       enabled
	runlevel2.target                       enabled
	runlevel3.target                       enabled
	runlevel4.target                       enabled

See what listening for network connections

	# netstat -autnp | grep -v ESTABLISHED | grep -v TIME_WAIT
	Active Internet connections (servers and established)
	Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
	tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      1/systemd
	tcp        0      0 0.0.0.0:5904            0.0.0.0:*               LISTEN      1720/Xvnc
	tcp        0      0 0.0.0.0:6004            0.0.0.0:*               LISTEN      1720/Xvnc
	tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      900/sshd
	tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      171/sendmail: accep
	tcp6       0      0 :::111                  :::*                    LISTEN      1013/rpcbind
	tcp6       0      0 :::5904                 :::*                    LISTEN      1720/Xvnc
	tcp6       0      0 :::80                   :::*                    LISTEN      1269/httpd
	tcp6       0      0 :::6004                 :::*                    LISTEN      1720/Xvnc
	tcp6       0      0 :::22                   :::*                    LISTEN      900/sshd
	udp        0      0 0.0.0.0:111             0.0.0.0:*                           1013/rpcbind
	udp        0      0 0.0.0.0:764             0.0.0.0:*                           1013/rpcbind
	udp6       0      0 :::111                  :::*                                1013/rpcbind
	udp6       0      0 :::764                  :::*                                1013/rpcbind


Disabling and stopping services

	# systemctl disable httpd.service
	Removed symlink /etc/systemd/system/multi-user.target.wants/httpd.service.
	systemctl stop httpd.service

Stop them all

	# systemctl disable rpcbind.socket
	# systemctl stop rpcbind.socket
	# for srv in 'rpcbind xinetd remote-fs httpd sendmail saslauthd' ;do systemctl disable $srv.service; systemctl stop $srv.service; done

Now we have this output from netstat

	# netstat -autnp | grep -v ESTABLISHED | grep -v TIME_WAIT
	Active Internet connections (servers and established)
	Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
	tcp        0      0 0.0.0.0:5904            0.0.0.0:*               LISTEN      1720/Xvnc
	tcp        0      0 0.0.0.0:6004            0.0.0.0:*               LISTEN      1720/Xvnc
	tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      900/sshd
	tcp6       0      0 :::5904                 :::*                    LISTEN      1720/Xvnc
	tcp6       0      0 :::6004                 :::*                    LISTEN      1720/Xvnc
	tcp6       0      0 :::22                   :::*                    LISTEN      900/sshd


# Make firewall great again


See what rules we have by default

	# iptables -L -v -n
	Chain INPUT (policy ACCEPT 1349 packets, 77575 bytes)
	 pkts bytes target     prot opt in     out     source               destination
	43038   49M ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
	    4   128 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0
	    0     0 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0
	   26  1532 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:22

	Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
	 pkts bytes target     prot opt in     out     source               destination
	    0     0 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            reject-with icmp-host-prohibited

	Chain OUTPUT (policy ACCEPT 24858 packets, 2686K bytes)
	 pkts bytes target     prot opt in     out     source               destination


Drop unknown incoming connections

	# iptables -P INPUT DROP

Save this configuration after reboot

	# service iptables save
	iptables: Saving firewall rules to /etc/sysconfig/iptables:[  OK  ]

Now we only may reach our server via ssh at port 22.

# SSH tunnel to our VNC service

Run locally (in fedora or OSX)

	$ ssh -L 5904:127.0.0.1:5904 vncsuperman -N

Now you should be able to connect with Tiger VNC viewer to address

	127.0.0.1:5904

To make ssh tunnel persistent install autossh

	$ sudo dnf install autossh -y

And start ssh as

	$ autossh -M 20000 -L 5904:127.0.0.1:5904 vncsuperman -N

Here 20000 is a randomly selected port used by autossh to monitor connection availability.
Check for -f option which makes autossh go background

	$ autossh -f -M 20000 -L 5904:127.0.0.1:5904 vncsuperman -N

autossh writes to syslog

	$ sudo tail -f /var/log/messages | grep autossh

# What we have now

	# df
	Filesystem     1K-blocks    Used Available Use% Mounted on
	/dev/simfs      83886080 1000620  82885460   2% /
	devtmpfs         1048576       0   1048576   0% /dev
	tmpfs            1048576       0   1048576   0% /dev/shm
	tmpfs            1048576     148   1048428   1% /run
	tmpfs            1048576       0   1048576   0% /sys/fs/cgroup
	tmpfs             209716       0    209716   0% /run/user/0
	tmpfs             209716       0    209716   0% /run/user/1000
	# df -i
	Filesystem      Inodes IUsed   IFree IUse% Mounted on
	/dev/simfs     1600000 26658 1573342    2% /
	devtmpfs        262144    57  262087    1% /dev
	tmpfs           262144     1  262143    1% /dev/shm
	tmpfs           262144   147  261997    1% /run
	tmpfs           262144    10  262134    1% /sys/fs/cgroup
	tmpfs           262144     1  262143    1% /run/user/0
	tmpfs           262144     1  262143    1% /run/user/1000

