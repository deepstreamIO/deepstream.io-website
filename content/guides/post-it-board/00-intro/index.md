---
title: Collaborative Post-It Board
description: Creating a Retrospective Board with deepstream
tags: [Javascript, lists, records]
redirectFrom: [/guides/post-it-board/]
---

With more and more teams working remotely, tools have sprung up everywhere, shifting online processes. The fun part behind retrospective planning poker and other methods was always the interactivity, seeing cards move around and identifying barely readable scribbles.
As such, let’s take a look at how we can use data-sync to create a real-time retrospective board. It will look something like this:

![board pic](../board.png)

In the spirit of agile approaches, let’s start by breaking down our requirements. Our retrospective board needs to allow us to:

- Add, edit and move cards

- Allow everyone with access to the board to see live updates

In case you decide to make the application public, let’s throw in a few security requirements:

- Only let people access the board with a username and password

- Only let cards be edited by their creator