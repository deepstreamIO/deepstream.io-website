---
title: Class LoginResult
description: An object containing information about the last login attempt
category: class
navLabel: LoginResult
body_class: dark
---

The result of a login, indicating if it was successful and providing clientData

## Methods

### boolean loggedIn()

Whether or not the login completed successfully

### Object getData()

Return the data associated with login. If login was successful, this would be the user associated  clientData. Otherwise data explaining the reason why it wasn&apos;t.

### Object getErrorEvent()

The error message the server sent to explain why the client couldn&apos;t log in.
