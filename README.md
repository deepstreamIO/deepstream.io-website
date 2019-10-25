<p align="center">
  <a href="https://deepstream.io">
    <img alt="Gatsby" src="https://deepstream.io/images/deepstream-elton-logo-startpage.svg" width="60" />
  </a>
</p>
<h1 align="center">
  deepstream.io website
</h1>

## 🚀 Quickest start without downloading

1. Go to the document you want to edit on deepstream.io (click on the github icon on each page)
2. Edit the file
3. Commit

## 🚀 Quick start for downloading

1.  git clone 
2.  npm i
3.  npm run develop
4.  Edit as you see fit
5.  Commit
6.  Raise PR

A quick look at the top-level files and directories you should care about:

    .
    ├── content
    ├── code-examples
    ├── markdown-templates
    └──src


1.  **`/content`**: This directory contains all the content markdown content on the website and is organized into 
the different routes on the application. Adding a document in most cases will automatically add it to the index pages and the navigation menus.

2.  **`/code-examples`**: This directory contains all the example code in the application (mostly guides and plugins).
It's useful to have them live here due to prettify and typescript validation.

4.  **`/markdown-templates`**: This directory contains all the snippets reused across the website (to the horror of search engines). Use and add to these sparingly.

4.  **`/src`**: This directory contains all the react components and styles to render the page. If you feel a component can be displayed better this is the place to be!


## 💫 Deploy

Website automatically gets deployed from master to https://deepstream.io and from staging to https://staging.deepstream.io