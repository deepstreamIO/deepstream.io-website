---
title: GitHub Integration using Java
description: Build a GitHub issue-tracker with Java
tags: [github, realtime, records, java, react]
deepstreamVersion: V3
---

In this post, we'll be building a simple GitHub issue tracker similar
to [waffle.io](http://waffle.io/). It will show active issues on a project 
with specific workflow labels, and it will update in real time as issues 
are created and updated on GitHub.

![Demo animation](./demo.gif)

This post will focus on building a connector using deepstream's Java API
and [Kohsuke Kawaguchi's GitHub API for Java](http://github-api.kohsuke.org/).
I will assume a basic understanding of Java. If you haven't already, take a
look at [Getting Started with Java](/tutorials/getting-started/java/). For
brevity, we won't cover how to build the React.js frontend, but feel free to
take a look at the one provided. If you'd like to read more about integrating
deepstream with React.js, read 
[getting started with React](/tutorials/getting-started/react/).

Setting Up
----------

If you'd like to follow along, you can clone 
[the completed project](http://github.com/deepstreamIO/ds-tutorial-github-board) 
on GitHub.

`markdown:setting-up-deepstream.md`

-   Create an application through the deepstream dashboard, and make a note
    of the corresponding application url.

-   Within the client directory,
    run `npm install` to install the client dependencies, then
    run `python -m SimpleHTTPServer` to start a test server. 
    You should then be able to view the client
    at [localhost:8000](http://localhost:8000/).

-   Create a [GitHub personal access token](http://github.com/settings/tokens/) 
    with repository access. Then create a file `~/.github` containing:

        oauth={your personal access token}

    It's also possible to put your GitHub credentials in this file to
    avoid this step — [see here](http://github-api.kohsuke.org//).

-   I recommend setting up a test GitHub repository with some issues,
    and labeling some of them with 'roadmap', 'ready', 'in progress',
    'awaiting review', or 'in review'. It's also a good idea to give
    those labels some nice colors — we'll be using those later on.

-   Install [ngrok](http://ngrok.com/) which will allow us to listen for
    external connections from the webhook we'll use later on. Start it
    using `ngrok http 8080`, and make note of the forwarding address.

-   We're using Gradle to manage dependencies.

## Project Setup

In our main method, we set the details of our local deepstream server,
the webhook URI given when you start ngrok, and the GitHub repository
that we're getting our issues from.

You'll need to update the `WEBHOOK_URI`, `DEEPSTREAM_URI` and `GITHUB_REPO`
environment variables in your build system to get the connector to run locally. 

```java
public static void main(String[] args) throws IOException {
  // Address of deepstream server e.g. "wss://xxx.deepstream.com?apiKey=xxxxx-xx-xxxxxx"
  String deepstreamURI = System.getenv("DEEPSTREAM_URI");

  // Our publicly accessible webhook server address (e.g. "https://13479bdf.ngrok.io")
  String webhookURI = System.getenv("WEBHOOK_URI");

  // The name of the GihHub repository that we wish to connect to.
  // The format is "$user/$repo" or "$org/$repo" if the repository is owned by an organization
  String repo = System.getenv("GITHUB_REPO");

  GithubConnector githubConnector = new GithubConnector(deepstreamURI, webhookURI, repo);
  githubConnector.start();
}
```

## Setting up API Objects

We first setup a connection to our deepstream client.

```java
private DeepstreamClient deepstreamClient = null;
...
try {
  deepstreamClient = new DeepstreamClient(deepstreamURI);
  deepstreamClient.login(new JsonObject());
} catch //...
```

... then setup a connection to GitHub...

```java
private GitHub gitHub;
...
gitHub = GitHub.connect();
GHRepository repository = gitHub.getRepository(repo);
```

## Initial State

Our connector will need to fetch any open issues from GitHub's API and
create corresponding records in deepstream for rendering in the client.

### Interesting Labels

We only care about certain labels, so we'll create a list of these and
add them to a deepstream list.

```java
List<String> interestingLabels = Arrays.asList(
        "roadmap", "ready", "in progress", "awaiting review", "in review");

// add label list to deepstream
deepstreamClient.record.getList("github-board-labels")
        .setEntries(interestingLabels);
```

### Issue Lists

Now we can start inserting issues into lists based on which labels they
have.

In
our `initializeIssueLists()` method,
we make deepstream lists for each of the labels and ensure that they're
empty.

```java
for (String labelName: interestingLabels) {
    deepstreamClient.record.getList(labelName).setEntries(new ArrayList<String>());
}
```

We get a list of open issues from GitHub.

```java
List<GHIssue> issues = repository.getIssues(GHIssueState.OPEN);
```

Then we add each issue to all the lists for each label it has.

```java
// put the issues into lists by label
for (GHIssue issue: issues){
    String issueId = Integer.toString(issue.getId());
    for (GHLabel label : issue.getLabels()) {
        // add the issue to the label list
    }
}
```

However, we're only interested in some of the labels. We also want to
create a record with our issue id to store the issue data.

```java
String labelName = label.getName();
if (interestingLabelSet.contains(labelName)){
    // add the issue id to the label list
    deepstreamClient.record.getList(labelName)
            .addEntry(issueId);

    // add a record for the issue
    deepstreamClient.record.getRecord(issueId)
            .set("title", issue.getTitle())
            .set("url", issue.getHtmlUrl())
            .discard();
}
```

We call this method from the constructor.

```java
initializeIssueLists(repository, interestingLabels);
```

### Coloring Labels

GitHub allows each label to have a color, so we get that from the API
and pass it to the client for rendering.

Inside
our `setupIssueColors` method,
we simply create a deepstream record that maps label names to hex
colors.

```java
// set the label colors
List<GHLabel> repoLabels = repository.listLabels().asList();
Record labelColorsRecord = deepstreamClient.record.getRecord("github-board-label-colors");

for (String labelName: interestingLabels) {
    GHLabel label = getLabelWithName(repoLabels, labelName);
    if (label != null)
        // add records for each label's color
        labelColorsRecord.set(labelName, label.getColor());
    else {
        System.out.printf("Label '%s' does not exist on the repository", labelName);
    }
}
```

## Realtime Updates

We use the GitHub webhook API to receive updates when issues are
modified.

### Event Listener

First, we start a server to listen for webhook events.

Our `startServer()` method
instantiates the RequestHandler, which we'll describe shortly.

### Subscribe to Issue Events

So that we are notified when the issues are modified, we subscribe
through the GitHub webhook API,
specifying `GHEvent.ISSUES`,
as this is the only event we're interested in.

```java
List<GHEvent> events = Arrays.asList(GHEvent.ISSUES);
repository.createWebHook(new URL(webhookURI), events);
```

### Handling Events

Events are handled in
the `RequestHandler.handle()` method.
GitHub [IssuesEvent](http://developer.github.com/v3/activity/events/types/#issuesevent)s
carry a JSON payload that gives details of the issue that triggered the
event.

The 'action' field shows what caused the event. The ones we're
interested in are label modifications and edits.

When an issue is edited, we update the corresponding record.

```java
if (action.equals("edited")){
    //...
    deepstreamClient.record.getRecord(issueId)
            .set("title", issueTitle)
            .set("url", issueUrl);
```

When an issue is labeled, we add the issue to the corresponding list.

```java
} else if (action.equals("labeled")) {
    deepstreamClient.record
            .getList(issueEvent.get("label").getAsJsonObject().get("name").getAsString())
            .addEntry(issueId);
```

Likewise, we remove issues from lists when they are unlabeled.

```java
} else if (action.equals("unlabeled")) {
    deepstreamClient.record
            .getList(issueEvent.get("label").getAsJsonObject().get("name").getAsString())
            .removeEntry(issueId);
}
```

Feel free to look through the rest of the code on GitHub. If you want a
challenge, perhaps try to allow moving cards on the frontend and modify the
corresponding issues on GitHub!
