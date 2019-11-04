---
title: Getting started with Android
description: A getting started guide for deepstream with Android
tags: [Android, Java, pub-sub, data-sync, request-response]
wip: true
logoImage: android.png
---

This guide will take you through getting started on Android with deepstream's three core concepts: [Records](/tutorials/guides/records), [Events](/tutorials/guides/events) and [RPCs](/tutorials/guides/remote-procedure-calls/).

`markdown:setting-up-deepstream.md`

## Connect to deepstream and log in

The first thing to do is create a new Android application and include the following line in your `build.gradle` file.

```java
compile 'io.deepstream:deepstream.io-client-java:2.0.4'
```

Because we'll be needing to pass the same client between activities in our app, we can use the built-in `DeepstreamFactory` to create a client and keep a reference to it.

In your `MainActivity` you'll need to do the following:

```java
DeepstreamFactory factory = DeepstreamFactory.getInstance();
DeepstreamClient client = factory.getClient("<Your app url">);
client.login();
```

From here, whenever we have a reference to our factory we can do `factory.getClient()` and get the same client back. Our `MainActivity` is just a basic `Activity` with buttons pointing to our three pages `EventActivity`, `RpcActivity` and `RecordActivity`. So we'll ignore that for now and jump right into events.

## Event (publish-subscribe)
`markdown:glossary-event.md`



The event API is very simple and we'll be using it to transfer data between two devices. The Android specific components we need are an `EditText` for input, a `Button` for sending the data, and a `TextView` to display this data.

To send the data in the `EditText`, we can do the following:

```java
submitButton.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        String eventPayload = inputField.getText().toString();
        client.event.emit("test-event", eventPayload);
        inputField.setText("");
    }
});
```

And to display any incoming data in our `TextView`, we can do:

```java
client.event.subscribe("test-event", new EventListener() {
    @Override
    public void onEvent(String s, final Object o) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                outputField.setText((String) o);
            }
        });
    }
});
```

After this, we should have something that looks like the following:

![event-gif](event-demo.gif)

## Records (data-sync)
`markdown:glossary-record.md`


To sync data between our devices, we'll be using a `Record` with two fields, `firstname` and `lastname`. We also need two `EditText` fields in our `Activity`.

The first thing want to do is get a reference to our `Record`, with the Java SDK it looks like this:

```java
Record record = client.record.getRecord("test-record");
record.setMergeStrategy(MergeStrategy.REMOTE_WINS);
```

Next, we want to add a `TextWatcher` on the input fields, so that whenever new data is entered, the `Record` will be updated with these changes. To update the `Record` data, we'll be using the `Record.set(String path, Object data)` method.

```java
firstnameInputField.addTextChangedListener(new CustomTextChangedWatcher("firstname"));
lastnameInputField.addTextChangedListener(new CustomTextChangedWatcher("lastname"));
```

With our `CustomTextChangedWatcher` just being the following:

```java
 private class CustomTextChangedWatcher implements TextWatcher {

    private String field;

    CustomTextChangedWatcher(String recordField) {
        this.field = recordField;
    }
    @Override
    public void afterTextChanged(Editable s) {
        if (s.toString().length() == 0) {
            return;
        }
        record.set(field, s.toString());
    }
}
```

After this, we just need to subscribe to the `firstname` and `lastname` fields and update the `EditText`'s whenever they change. This is similar to the above code snippet where we're just wrapping the RecordPathChangedCallback in a class and keeping a reference to something (in this case the corresponding `EditText`).

```java
record.subscribe("firstname", new CustomRecordPathChangedCallback(firstnameInputField), true);
record.subscribe("lastname", new CustomRecordPathChangedCallback(lastnameInputField), true);
```

Where the CustomRecordPathChangedCallback is just the following:

```java
private class CustomRecordPathChangedCallback implements RecordPathChangedCallback {
    private EditText field;
    CustomRecordPathChangedCallback(EditText editTextField) {
        this.field = editTextField;
    }
    @Override
    public void onRecordPathChanged(String recordName, String path, final JsonElement data) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (data.isJsonNull()) {
                    return;
                }
                field.setText(data.getAsString());
                // this line just moves the cursor to the end of the text
                field.setSelection(field.getText().length());
            }
        });
    }
}
```

Finally, we should have something that looks like this:

![record-gif](record-demo.gif)

## RPCs (request-response)
`markdown:glossary-rpc.md`



Our simple demo app has one function, and that is to make a string of characters upper case. We do this by providing a method `to-uppercase` , and then calling that method with some string.

We need a few elements for this to work in our app, namely:

-`Button submitButton;` the button we click to call the RPC

-`CheckBox provideCheckBox;` a check box to say whether we're providing the RPC

-`EditText inputField;` the text field to enter our data

-`TextView outputField;` the text field to display the result of our method

Our code for providing the method is simple, if the box is checked we want to provide the RPC, otherwise we'll unprovide it.

```java
public void toggleProvide(View view) {
    if (provideCheckBox.isChecked()) {
        client.rpc.provide("to-uppercase", new RpcRequestedListener() {
            @Override
            public void onRPCRequested(String name, Object data, RpcResponse response) {
                String uppercaseResult = data.toString().toUpperCase();
                response.send(uppercaseResult);
            }
        });
    } else {
        client.rpc.unprovide("to-uppercase");
    }
}
```

When we click the button, we'll just get whatever is in the `EditText` and try make it upper case.

```java
public void makeToUppercase(View view) {
    String data = inputField.getText().toString();
    final RpcResult result = client.rpc.make("to-uppercase", data);
    if (result.success()) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                outputField.setText(result.getData().toString());
            }
        });
    } else {
        Toast.makeText(this, "Error making RPC", Toast.LENGTH_LONG).show();
    }
}
```

Keep in mind that if there is no RPC provider, the RPC won't be able to be completed and will return a `NO_RPC_PROVIDER` error. That being said, it should look like this:

![rpc-gif](rpc-demo.gif)
