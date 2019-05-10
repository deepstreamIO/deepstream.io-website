---
title: Realtime Cart using React
description: Realtime product sync with deepstream events
tags: Events, React, Javascript, Pub-Sub
navLabel: Realtime Cart
body_class: bright
---

Here is a common example of poor user experience in most E-Commerce websites, when two users are trying to purchase the same item(s) at the same time: 

Assume a merchant has 5 of a given items and User A tries to buy three while User B needs 3 or more as well. Both users won't be able to tell what is left while they are adding these items to their cart. A  situation like this could cause User B to order more than what the merchant can offer or have in stock because she was not aware that User A had already picked most of the items.

The only way to tell both users what is left is by updating the number of remaining products in realtime. This is where deepstream events shine. deepstream events are not just your regular pub/sub (though they can be used that way) but come with realtime capabilities. We will be building a bookshop where books can be purchased by adding them to a simple cart. The UI will be simple and made with React.

![Bookstream gif](/images/tutorial/realtime-cart/bookstream.gif)

## Setting Up React and deepstreamHub

The fastest way to create a React app is using the `create-react-app` CLI tool. `create-react-app` can be installed globally using npm:

```bash
# Install create-react-app
npm install -g create-react-app
```

You can create a new app using the CLI tool:

```bash
create-react-app book-stream
```

`book-stream` is what we name the app we are creating.

Now to deepstreamHub. deepstream is fast to setup. You just need an account by [signing up](https://dashboard.deepstreamhub.com/signup/) and an app with a URL:

{{> start-deepstream-server}}


## Presentation Components

![Presentation Components](/images/tutorial/realtime-cart/components.png)

From the image above, our app has 3 components -- two of which are presentation and one container (red). The presentation components are `BookList`(blue) and `BookItem`(green). This is because all they do is render information to the view. They don't handle any logic.

### BookItem Component

`BookItem` is the most atomic component in our app. It displays a card with information about a given book. The data for which these items depend on are passed down via props from a parent component which `BookItem` should be independent of:

```js
// ./src/components/BookItem/BookItem.js
import React, { Component } from 'react';

import './BookItem.css';

class BookItem extends Component {
    render() {
        const book = this.props.book;
        return (
            <div className="BookItem">
                <div className="BookItem__img"
                    style=\{{
                        backgroundImage: `url($\{book.image\})`,
                        width: '800px',
                        height: 300,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'top left'
                    \}}
                >
                    <img
                        src={book.image}
                        alt="Book Item"
                    />
                </div>
                <div className="BookItem__details">
                    <div className="BookItem__cat">
                        {book.category}
                    </div>
                    <h4>{book.title}</h4>
                    <h5>{book.author}</h5>
                    <div className="BookItem__price-cart">
                        <p>${book.price}</p>
                        <button
                            onClick={this.props.handleClick.bind(this, book)}
                        ><span className="fa fa-cart-plus"></span> Buy</button>
                    </div>
                    <div className="BootItem__description">
                        {book.description}
                    </div>
                    <div className="BookItem__stock" style=\{{color: book.inStock >= 5 ? '#417505' : '#CE0814'\}}>
                        {book.inStock} In Stock
                    </div>
                </div>
            </div>
        );
    }
}

export default BookItem;
```

Just a basic React component. The `book` binding is received via `props`. We will see how that is created in container component section.

`handleClick` is also received as a method being passed down from a parent component. We intentionally refuse to handle updating cart from this component because presentation components are best known for just displaying information.
Therefore, when the `add to cart` button is clicked, we send the particular book as payload to the `handleClick` event handler in the parent component.

### BookList Component

Of course, we're not dealing with just a single book. We are dealing with an array of books with a similar data structure. Therefore, we need to iterate over the list of books and render them using the `BookItem` component we saw earlier. Let's have a look at how `BookList` does that:

```js
// ./src/components/BookList/BookList.js
import React, { Component } from 'react';

import BookItem from '../BookItem/BookItem'
import './BookList.css';

class BookList extends Component {
    constructor(props) {
        super(props)
        this.renderBookItems = this.renderBookItems.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(book) {
        this.props.handleAddToCart(book)
    }

    renderBookItems(book) {
        return (
            <div className="col-md-6" key={book.id}>
            <BookItem
                book={book}
                handleClick={this.handleClick}
            ></BookItem>
            </div>
        );
    }
    render() {
        return (
            <div>
                {this.props.books.map(this.renderBookItems)}
            </div>
        );
    }
}

export default BookList;
```

`BookList`  is still a presentation component. The best it can do for us is receive books array which it iterates over and passes down to `BookItem` as well as calling the parent component `handleAddToCart` method to handle cart update.

We send event and data down `BookItem` by passing them as attribute via `BookList` iterated template:

```html
<BookItem
    book={book}
    handleClick={this.handleClick}
></BookItem>
```

### Nav Component

The navigation component displays the items in the cart. It is very simple with just a single value to bind -- the cart array length:

```js
// ./src/components/Nav/Nav.js
import React, { Component } from 'react';
import logo from '../../logo.svg';
import './Nav.css';

class Nav extends Component {
    render() {
        return (
            <div className="Nav">
            
                <div className="Nav-item Nav-logo">
                    <img src={logo} alt="logo" />
                </div>
                <div className="Nav-item Nav-cart">
                    <span className="fa fa-cart-plus"></span> {this.props.cart.length}
                </div>
            </div>
        );
    }
}

export default Nav;
```


## Container (App) Component
The container component is the guy responsible for knowing what the data is like as well as updating it. It's also responsible for passing it down to the child (presentation or another container) components. Let's start with recognizing and creating states:

```js
// ./src/App/App.js
import React, { Component } from 'react';

import Nav from './components/Nav/Nav'
import BookList from './components/BookList/BookList'
import data from './data'

import './App.css';

class App extends Component {

  constructor(props) {
      super(props)
      this.state = {
          books: data,
          cart: []
      }
}
```

Two state items -- the books array and the cart array. The books default to an array of fake books data just for this example. In real app, you will be expected to probably make a server request in `componentDidMount` lifecycle method and update the state with `setState()`. See React's guide on [state and lifecycle](https://facebook.github.io/react/docs/state-and-lifecycle.html) for more information.

This is what the fake books data looks like:
```js
// ./src/data.js
export default [
    {
        id: 101,
        title: 'Angular Router',
        author: 'Victor Savkin',
        description: `This book is a comprehensive guide to the Angular router written by its designer, who is a co-founder Nrwl - Angular Consulting for enterprise customers, from core contributors.`,
        price: 25,
        category: 'Angular',
        inStock: 5,
        image: 'https://s3.amazonaws.com/titlepages.leanpub.com/router/hero?1482615300.jpg'
    },
    {
        id: 201,
        title: 'Programming React Native',
        author: 'Dotan Nahum',
        description: `In this book, we aim to build cross-platform mobile apps, for Android and iOS, using React Native. We'll learn what it means to build a robust application architecture that will stay with you regardless of change in the tooling or ecosystem churn`,
        price: 11.99,
        category: 'React Native',
        inStock: 4,
        image: 'https://s3.amazonaws.com/titlepages.leanpub.com/programming-react-native/hero?1467374443.jpg'
    },
    {
        id: 301,
        title: 'SurviveJS - React',
        author: 'Juho Vepsäläinen',
        description: `SurviveJS - React shows you how to build a simple Kanban using React. The idea is that if you can build a simple application, you can probably build something more complex after that. The first application is always the hardest and that's where this book comes in.`,
        price: 15.99,
        category: 'React',
        inStock: 2,
        image: 'https://s3.amazonaws.com/titlepages.leanpub.com/survivejs-react/hero?1464783722.jpg'
    },
    {
        id: 401,
        title: 'The Majesty of Vue.js 2',
        author: 'Alex Kyriakidis et al',
        description: `This book will guide you through the path of the rapidly spreading Javascript Framework Vue.js! By the end of this book, you will be able to create fast front end applications and increase the performance of your existing projects with Vue.js 2 integration.`,
        price: 31.90,
        category: 'Vue',
        inStock: 6,
        image: 'https://s3.amazonaws.com/titlepages.leanpub.com/vuejs2/hero?1490059830.jpg'
    },
    {
        id: 501,
        title: 'Practical Vue.js',
        author: 'Daniel Schmitz et al',
        description: `Master this simple yet powerful framework to create reactive web interfaces with practical examples.`,
        price: 25.99,
        category: 'Vue',
        inStock: 1,
        image: 'https://s3.amazonaws.com/titlepages.leanpub.com/vue/hero?1468433813.jpg'
    },
    {
        id: 601,
        title: `Build APIs You Won't Hate`,
        author: 'Phil Sturgeon',
        description: `Tasked with building an API for your company but don't have a clue where to start? Taken over an existing API and hate it? Built your own API and still hate it? This book is for you.`,
        price: 29.99,
        category: 'Backend',
        inStock: 10,
        image: 'https://s3.amazonaws.com/titlepages.leanpub.com/build-apis-you-wont-hate/hero?1465835694.jpg'
    },
    {
        id: 801,
        title: 'Angular 2',
        author: 'Sebastian Eschweiler',
        description: `A Practical Introduction to the new Web Development Platform Angular 2 (Angular.js, Angular.js 2, AngularJS, AngularJS 2, ng2)`,
        price: 24.80,
        category: 'Angular',
        inStock: 0,
        image: 'https://s3.amazonaws.com/titlepages.leanpub.com/angular2-book/hero?1480420187.jpg'
    },
]
```

With the books data to display available and living in our state already, we can pass it down to the `BooksList` component to iterate over:

```js
// ./src/App/App.js
class App extends Component {

  constructor(props) {
      super(props)
      this.state = {
          books: data,
          cart: []
      }
  }

  

  render() {
    return (
      <div className="App">
        <Nav cart={this.state.cart}/>
        <div className="App-main">
            <BookList
                books={this.state.books}
                handleAddToCart={this.handleAddToCart}
            ></BookList>
        </div>
      </div>
    );
  }
}

export default App;
```

The only thing that is left for us is to start seeing books listed in our browser. This is because the `add to cart` event is yet to be handled. We already passed this event to `handleAddToCart` prop, but it's not created. Let's do that:

```js
// ./src/App/App.js
class App extends Component {

  constructor(props) {
      
      // ... truncated
      
      this.handleAddToCart = this.handleAddToCart.bind(this);

  }

  handleAddToCart(book) {
      const cartItem = this.state.cart.find(x => x.id === book.id);
      !cartItem && book.inStock > 0 && this.setState({cart: [...this.state.cart, book]})
  }

  render() {
    return (
      <div className="App">
        <Nav cart={this.state.cart}/>
        <div className="App-main">
            <BookList
                books={this.state.books}
                handleAddToCart={this.handleAddToCart}
            ></BookList>
        </div>
      </div>
    );
  }
}

export default App;
```

The method is bound to the right context via the constructor:

```js
  this.handleAddToCart = this.handleAddToCart.bind(this);
```

We first check if the book is already in the buyer's cart. If it is, we just do nothing and keep quiet (we can do better). Otherwise, we update the cart array with the book being added while checking if the book is still in stock.

## Realtime Updates with deepstreamHub

At this point, when two buyers are adding the same item to cart, each of them is unaware of the number of items left. This could lead them to buy an item that is out of stock. Let's use the deepstream event to update changes on all connected clients while purchases are made:

{{> glossary event=true noHeadline=true}}



You need to install the deepstream JS SDK:

```bash
npm install --save deepstream.io-client-js
```

and connect to deepstreamHub using the URL you got after signing up:

```js

// ...

import deepstream from 'deepstream.io-client-js'


class App extends Component {

  constructor(props) {
      // ...
      // Connect to deepstream using the deepstream instance
      this.dsClient = deepstream('<APP-URL>')
    // Login to deepstreamHub server
    .login();
      
  }
  
}

export default App;
```

Before the container component is rendered, we instantiate deepstream while passing it our app URL. The `login` method is what actually attempts a web socket connection.

Still in the constructor, we will subscribe to a `cart-event` event which will be triggered with an `emit` in the `handleAddToCart` function:

```js
this.dsEvent = this.dsClient.event;

this.dsEvent.subscribe('cart-event', (book) => {
    const newBooks = this.state.books.map(x => {
        if(x.id === book.id) {
            return Object.assign({}, x, {inStock: x.inStock - 1});
        }
        return x;
    });

    this.setState({books: newBooks})
});
```

When ever the event is emitted, we subtract one form the book's `inStock` integer value. This is done by iterating through the list of books and looking for which of them matches the book that was purchased.

Let's see how the event is emitted when adding items to cart:

```js
handleAddToCart(book) {
      // . . .
      // Emit deepstream event
      !cartItem && book.inStock > 0 && this.dsEvent.emit('cart-event', book);
  }
```
