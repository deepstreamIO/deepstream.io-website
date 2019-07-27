---
title: Getting started with Swift
description: Learn how to add realtime features to your iOS app
tags: [Swift, iOS,data-sync, pub-sub, request-response, RPCs]
deepstreamVersion: V3
---

This guide will take you through deepstream's three core concepts: [Records](/tutorials/guides/records/), [Events](/tutorials/guides/events/) and [RPCs](/tutorials/guides/remote-procedure-calls/).

We'll use just the <a href="/docs/client-swift/DeepstreamClient/">iOS client SDK</a> in this tutorial.

## Prerequisites

Before you begin, you'll need a few things set up:

* Xcode 8.0 or later
* An Xcode project targeting iOS 8.3 or above
* [CocoaPods](https://cocoapods.org/) 1.0.0 or later

## Add the deepstream SDK to your iOS project

If you are setting up a new project, you need to install the SDK.

We recommend using CocoaPods to install the libraries. You can install Cocoapods by following the [installation instructions](https://guides.cocoapods.org/using/getting-started.html#getting-started).

To integrate the deepstream SDK into one of your own projects, you will need to initialise a `Podfile` and then install the pods for the libraries that you want to use. To do this:

1. If you don't have an Xcode project yet, create one now.

2. Create a `Podfile` if you don't have one:

```shell
$ cd your-project directory
$ pod init
```

3. Add the pod to your Podfile:

```ruby
pod 'DeepstreamIO'
```

A full example can be seen [here](https://github.com/deepstreamIO/getting-started-app-swift/blob/master/deepstream%20iOS/Podfile).

4. Install the pods and open the `.xcworkspace` file to see the project in Xcode.

```shell
$ pod install
$ open your-project.xcworkspace
```

_NOTE:_ From now on, you'll need to use the `.xcworkspace` file when opening your project.

5. Add a [bridging header](https://developer.apple.com/library/content/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html) to your project to let your Swift code use an Objective-C library.

You can create a bridging header by choosing _File > New > File > (iOS, watchOS, tvOS, or macOS) > Source > Header File_.

6. In your bridging header file, we import the DeepstreamIO Objective-C header for the library we want to expose to Swift. For example:

```c++
#ifndef YourProject_Bridging_Header_h
#define YourProject_Bridging_Header_h

#import <DeepstreamIO/DeepstreamIO.h>

#endif /* YourProject_Bridging_Header_h */
```

Now, in _Build Settings_, in _Swift Compiler - Code Generation_, make sure the Objective-C Bridging Header build setting has a path to the bridging header file.

The path should be relative to your project, similar to the way your `Info.plist` path is specified in Build Settings. e.g. `${PROJECT_DIR}/YourProject/YourProject-Bridging-Header.h`

## Adding Swift extensions

To make working with deepstream as seamless as possible, there are a few Swift extensions that accompany the Cocoapod.
These help bridge between Swift and the deepstream SDK. The rest of the guide will assume you've carried out these steps:

1. In Xcode, in the _Project Navigator_ on the left, expand the _Pods_ project and then _Pods > DeepstreamIO_

<img src="/assets/img/tutorial/ios-app/swift-extensions-1.png" height="300">

2. Drag the directory _Resources_ to the your project and ensure _Create groups_ is selected and your project's target is too.

<img src="/assets/img/tutorial/ios-app/swift-extensions-2.png" height="100">

`markdown:setting-up-deepstream.md`

## Connect to deepstream and log in

In the project's `AppDelegate.swift` or perhaps in the `func viewDidLoad()` method of your `ViewController`.

Get your app url from the dashboard and establish a connection to deepstream

```swift
guard let client = DeepstreamClient("<YOUR APP URL>") else {
	// failed to connect to setup a DeepstreamClient
    return
}
```

and log in (we didn't configure any authentication, so there are no credentials required)

```swift
guard let loginResult = client.login() else {
	// failed to login
    return
}

if (loginResult.getErrorEvent() == nil) {
    print("Successfully logged in")
}
```

## Records (realtime datastore)
`markdown:glossary-record.md`

Creating a new record or retrieving an existent one works the same way

```swift
guard let record = self.client?.record.getRecord("test/johndoe") else {
    // failed to get record handler
    return
}
```

Values can be stored using the `.set()` method

```swift
record.set(["firstname" : "John", "lastname": "Doe"].jsonElement)
```

In a UI based application, our ViewController will look like this:

```swift
class ViewController: UIViewController {

	// Properties
	private var client : DeepstreamClient?
	private var record : Record?

	override func viewDidLoad() {
	    super.viewDidLoad()

	    // Get the pre-configured client
	    guard let client = DeepstreamClient("<YOUR APP URL>") else {
	        // failed to connect to setup a DeepstreamClient
	        return
	    }

	    self.client = client

	    guard let loginResult = client.login() else {
			// failed to login
		    return
		}

		if (loginResult.getErrorEvent() == nil) {
		    print("Successfully logged in")
		}

	    // Create or retrieve a record with the name test/johndoe

	    // Get record handler
	    guard let record = self.client?.record.getRecord("test/johndoe") else {
		    // failed to get record handler
		    return
		}

		// Make a reference for later
	    self.record = record

	    self.record.set(["firstname" : "John", "lastname": "Doe"].jsonElement)
	}
}
```

Now that we have initialised our DeepstreamClient and we've established a record handler, which we've then set with some values, let's set up two-way bindings with a UITextField.

Whenever a path within our record, e.g. `firstname` changes we want to update the `UITextField`. Whenever a user types, we want to update the record.

![Two-way realtime bindings](/assets/img/tutorial/ios-app/realtime-datastore.gif)

Add a UITextField to our `ViewController` in the `Storyboard` and with a reference to it in our `ViewController` class (e.g. ni the `ViewController.swift` file).

You'll need to drag the outlet from the `Storyboard to your `ViewController` class to hook this up.

```swift
// ViewController properties
@IBOutlet weak var firstnameTextField: UITextField!
```

We can subscribe to changes for a record path by creating a callback that will handle such.
We are going to create a generic `RecordPathChangedCallback` that we can pass a `UITextField` to and it will update it with.

```swift
// Create a generic RecordPathChangedCallback that will handle changes to a record path
final class NameRecordPathChangedCallback : NSObject, RecordPathChangedCallback {

    var textField : UITextField!

    init(textField: UITextField) {
        self.textField = textField
        super.init()
    }

    func onRecordPathChanged(_ recordName: String!, path: String!, data: JsonElement!) {
        print("Record '\(recordName!)' changed, data is now: \(data)")

        // Update text field in main thread
        DispatchQueue.main.async {
            self.textField.text = "\(data.getAsString()!)"
        }
    }
}
```

With this `RecordPathChangedCallback`, we can subscribe to changes for the `firstname`

```swift
record.subscribe("firstname", recordPathChangedCallback: NameRecordPathChangedCallback(textField: self.firstnameTextField))
```

If we want to update the record path when the user types, we can setup a target on the `UITextField` that listens when the user types like this in our `viewDidLoad()` method.

```swift
self.firstnameTextField.addTarget(self, action: #selector(editingChanged(_:)), for: .editingChanged)
```

Later in our `ViewController` class we can add the action to handle this.

```swift
func editingChanged(_ sender: UITextField) {
    if let record = self.record {
        record.set("firstname", value: sender.text)
    }
}
```

## Events (publish-subscribe)
`markdown:glossary-event.md`

![Publish-Subscribe](/assets/img/tutorial/ios-app/pubsub.gif)

Clients and backend processes can receive events using `.subscribe()`.

Like before, we can create a custom implementation of `EventListener` that takes a `UITextView` or perhaps `UITextField` and appends new events. We can then subscribe to a given event name (e.g. `test-event`) and pass this custom `EventListener`.

You'll need to drag an outlet from the UI object in the `Storyboard` to your `ViewController` class to hook the `UITextView` to the class.

```swift

@IBOutlet weak var subscribeTextView: UITextView!

final class DSEventListener : NSObject, EventListener {
    private var textView : UITextView!

    init(textView: UITextView) {
        self.textView = textView
        super.init()
    }

    func onEvent(_ eventName: String!, args: Any!) {
        guard let value = args as? String else {
            print("Error: Unable to cast args as String")
            return
        }

        print("Subscriber: Event '\(eventName!)' occurred with '\(value)'")
        self.textView.text?.append("Received test-event with \(value)\n")
    }
}

self.client?.event.subscribe("test-event", eventListener: DSEventListener(textView: self.subscribeTextView))
```
We can publish events with `.emit()`.

Let's add a `UIButton`, an publish `UITextField` and an subscribe `UITextView` to our `ViewController` in `the Storyboard`, which will we create references for.

Like before, you'll need to drag the outlet from the `Storyboard` to your `ViewController` class to hook these up.

```swift
@IBOutlet weak var publishButton: UIButton!
@IBOutlet weak var publishTextField: UITextField!
@IBOutlet weak var subscribeTextView: UITextView!

func viewDidLoad() {
	// setup DeepstreamClient and subscribe to event

	...

	self.publishButton.addTarget(self, action: #selector(publishButtonPressed(_:)), for: .touchUpInside)
}

func publishButtonPressed(_ sender: Any) {
    guard let text = publishTextField.text, text.characters.count > 0 else {
        return
    }
    self.client?.event.emit("test-event", data: text)
}
```

## RPCs (request-response)
`markdown:glossary-rpc.md`

![Request Response](/assets/img/tutorial/ios-app/request-response.gif)

You answer requests for methods using `.provide()`

First, we'll create an implementation of an `RpcRequestedListener` so that we can pass in a custom method that will handle the response from an RPC. On each call to the passed in rpc name, this will be run.

```swift
// Convenience typealias to simplify the parameters in DSRpcRequestedListener - not required

typealias RpcRequestedListenerHandler = ((String, Any, RpcResponse) -> Void)

final class DSRpcRequestedListener : NSObject, RpcRequestedListener {
    private var handler : RpcRequestedListenerHandler!

    init(handler: @escaping RpcRequestedListenerHandler) {
        self.handler = handler
    }

    func onRPCRequested(_ rpcName: String!, data: Any!, response: RpcResponse!) {
        self.handler(rpcName, data, response)
    }
}
```

We can provide a specific method to handle an rpc call for the name `multiply-number`

Then we can setup a Target-Action so when the button is tapped, an rpc call will be made.

Don't forget to connect your `UIButton` and `UITextField`'s to the `ViewController` class.

```swift
@IBOutlet weak var makeMultiplyButton: UIButton!
@IBOutlet weak var requestValueTextField: UITextField!
@IBOutlet weak var displayResponseTextField: UITextField!
@IBOutlet weak var multiplyNumberTextField: UITextField!

func viewDidLoad() {
	// setup DeepstreamClient and provide rpc method

	...

	client.rpc.provide("multiply-number",
	   rpcRequestedListener: DSRpcRequestedListener { (rpcName, data, response) in
	    print("RPC Provider: Got an RPC request")

	    guard let value = (data as? Float) else {
	        print("Error: Unable to cast data to Float")
	        return
	    }

	    guard let multiplyValue = self.multiplyNumberTextField.text,
	        multiplyValue.characters.count > 0 else {
	        print("Error: No multiple number provided")
	        return
	    }

	    guard let multiplyValueFloat = Float(multiplyValue) else {
	        print("Error: Unable to convert multiple value to Float")
	        return
	    }

	    response.send(value * multiplyValueFloat)
    })

    self.publishButton.addTarget(self, action: #selector(publishButtonPressed(_:)), for: .touchUpInside)
}

```

Finally, we can make a request using `.make()` in the button method we connected the Target-Action to.

```swift

makeMultiplyRequestButtonPressed(_ sender: Any) {
    guard let value = self.requestValueTextField.text,
        value.characters.count > 0 else {
        print("Error: No multiply number to request")
        return
    }

    guard let valueFloat = Float(value) else {
        print("Error: Unable to convert multiple value to Float")
        return
    }

    guard let rpcResponse = self.client?.rpc.make("multiply-number", data: valueFloat) else {
        print("Error: RPC failed")
        self.displayResponseTextField.text = "Error"
        return
    }

    guard let data = rpcResponse.getData() else {
        print("Error: Unable to parse RPC data")
        return
    }

    self.displayResponseTextField.text = "\(data)"
}
```