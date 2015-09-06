---
layout: post
title: "Configure LXDE in Fedora 22 to lock screen by pressing CTRL+ALT+L"
description: "And Win+L"
category: 
tags: ["fedora", "linux", "lxde", "openbox" ]
---
{% include JB/setup %}

# Problem

I am new to LXDE and Fedora. I want my screen been locked when i press CTRL+ALT+L.
This required some googling.

# Solution

Open file ~/.config/openbox/lxde-rc.xml for edit.

   vim ~/.config/openbox/lxde-rc.xml 

Find this lines:

    <keyboard>
      <chainQuitKey>C-g</chainQuitKey>

Add this lines 

    	<keybind key="C-A-L">
           <action name="Execute">
             <command>xscreensaver-command -lock</command>
           </action>
        </keybind>
        <keybind key="W-L">
          <action name="Execute">
            <command>xscreensaver-command -lock</command>
          </action>
        </keybind>

Save file and close the editor ( :wq<ENTER> in vim ). Then run

    openbox --reconfigure

You are done. Press CTRL+ALT+L or WIN+L to see locked screen.
