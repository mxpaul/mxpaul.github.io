---
layout: post
title: "Install Fedora 22 and Centos 7 on Mac Mini mid 2011"
description: "OS X is shit, i want linux"
category: 
tags: ["centos", "fedora", "linux", "rEFInd" ]
---
{% include JB/setup %}

# Why

OS X is a piece of shit. I can tell thet after one year of using it on both Mac Mini and MacBooc air.

# What

I want to keep original OS X installation. Just in case i need to test on it or use
xcode or some other kind of silly things. I want CentOS 7 with some lightweight 
desktop manager (fuck GNOME 3) and i want to give a try to Fedora 22 (still fuck GNOME 3).
I will give about 30Gb to every linux distro and share the rest space between them as my 
home directory.

# How

My plan is:

  * Install [rEFInd](http://www.rodsbooks.com/refind/) boot manager
  * Resize OS X HFS partition 
  * Install Fedora 22 and/or CentoOS 7
  * Build linux drivers for fucking broadcom WiFi used in Mac Mini based on elrepo instructions

# Log

First of all i place my mac mini where i have a wire, so i will have internet access after 
installing Fedora ( booting with live CD proved there is no WiFi driver for Broadcom in Fedora) 

## Install rEFInd
rEFInd is a successor of rEFIt project since the last on is not mainained anymore. 

I download rEFInd as a binary zip archive at http://sourceforge.net/projects/refind/files/0.9.0/refind-bin-0.9.0.zip/download.
[This page](http://www.rodsbooks.com/refind/getting.html) links to sourceforge download page.

Command to ensure i have 64 bit arch on my OS X

    ioreg -l -p IODeviceTree | grep firmware-abi

Next, i mount my esp as described ar rEFInd "Manual OS X install" page

    mkdir /Volumes/esp
    mount -t msdos /dev/disk0s1 /Volumes/esp

I unpack  downloaded zip archive with funder (unzip, however, should do the job as well)
Change into unpacked directory and just run install.sh

    sh install.sh

I have some outut stating thet all went good. I reboot and a see boot loader screen with
OS X as the only option. 

## Resize partition

Go to launchpad, then Utilities and choose 'Disk utility'. In the opened window i see my 500Gb 
Toshiba drive and single disklabel (?) within. I click the disk and have some tabs in a main 
area. There is Disc Partition (i believe, through i have russian "Разделы диска"). Anyway, it
is the central tab of five, and there a can change partition size by dragging its picture with
the mouse, or enter desired size. After that a click Apply and after some warning word OS X
resizes partition. Well, i had to click the partition to select it in partition scheme before
resize button became active.

Now it's done and i have to install Fedora LXDE spin onto my mac mini. I have downloaded 
iso image yesterday and put it on a USB stick with dd command under my CentOS 6. I failed 
to do that on Mac Mini, but i believe that is possible.

Spent 2 hours trying to install fedora and have it boot. Guess what? It fucking replaced rEFInd
with grub2.

Trying to reinstall rEFInd under fedora, but just install rpm is not enougth.

Ok, i downloaded binary zip archive and followed manual linux install instructions. Now i have rEFInd
working and is able to boot OS X.

    unzip refind-bin-*.zip
    cd refind-bin*
    cp -r refind /boot/efi/EFI/
		cd /boot/efi/EFI/refind
    rm refind_ia32.efi
    rm -r drivers_ia32
    mv refind.conf-sample refind.conf
    efibootmgr -c -l \\EFI\\refind\\refind_x64.efi -L rEFInd

This last command was what rpm post install script complaining about. As it succeed i was able
to boot MacOs and Fedora 22 on the same Mac Mini. Make WiFi work is the next chellenge.

## Useful links

  * [elrepo instructions for akmod-wl](http://elrepo.org/tiki/wl-kmod)
  * [Chromium repo for Fedora](http://copr.fedoraproject.org/coprs/spot/chromium/)

## Install broadcom wifi in Fedora 22

    dnf install http://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-22.noarch.rpm
    dnf install http://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-22.noarch.rpm
    dnf install kmod-wl

