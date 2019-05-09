---
title: Valve Permissioning Advanced
description: Learn how to unlock the full potential of Valve
---

Ok, time for some advanced valve rules. To get up to speed with the basics, head over to the [simple permission rules example](/tutorials/core/permission-conf-simple/).

## Variables
Valve automatically injects a set of variables into its permission rules.

#### `data` & `oldData`
`data` contains the data for events and RPCs. It can be used to validate the payload.

```yaml
# make sure a tweet contains max 140 characters
    publish: "data.content.length < 140"
# make sure firstname is a string
    write: "typeof data.firstname === 'string'"
```

For records, `data` is the INCOMING data - the current data is available as `oldData`. This is helpful for comparisons:

```yaml
# make sure bids at an auction can only go up
    write: "data.price > oldData.price"
# make sure that `owner` can't be changed once written
    write: "!data.owner || data.owner == oldData.owner"
```

#### `user`
`user` is an object containing information about the user attempting the action. It offers `user.id` - the username that was provided at login and `user.data`.

`user.data` is the meta-data that was provided when the user logged in. This could be the data returned by the [http webhook](/tutorials/core/auth-http-webhook/) as `serverData` or the `data` field from the user file if you're using [file-based authentication](/tutorials/core/auth-file/). Data is a great place to store authentication data like roles (e.g. `{role: 'admin'}`), access-levels or flags like `{ canDeletePosts: false }`.

Permissioning also allows age based validation in conjunction with `now`, e.g.,
new users on a website may create new content and modify existing data only if
more than 24 hours passed since signing up:
```yaml
record:
    "*":
        record: "user.data.timestamp + 24*60*60*1000 < now"
        write: "user.data.timestamp + 24*60*60*1000 < now"
```

## String Functions
Valve supports a number of built-in string functions, namely `startsWith`, `endsWith`, `indexOf`, `match`, `toUpperCase`, `toLowerCase` and `trim`. They can be useful to normalize and compare values, e.g.

```yaml
rpc:
    book-purchase:
        request: "data.card.issuer.toLowerCase() == 'visa' && data.card.number.match(/^4[0-9]{12}(?:[0-9]{3})?$/)"
```

## Cross References
Cross references allow you to reference data from other records within deepstream. This is an incredibly versatile feature, allowing you to check states or user-data, make sure that an item that's being purchased is still in stock or verify pre-conditions, e.g. making sure a user can only vote once. Cross references are written as `_(recordName)`.

```yaml
make-call:
    request: _('shop-status').isOpen == true
```

Recordnames referrenced by the `_()` function can also be dynamically created, e.g. from strings and path-variables.

```yaml
# Make sure an item is still in stock
purchase/$itemId:
    request: _('item/' + $itemId ).inStock > 0
```

#### Nesting cross-references
It's even possible to nest cross references. Say we are running an online pharmacy and can only sell certain categories of drugs in countries they have clearance for. Here's the data we have to work with:

```javascript
// record drug/iqbxxluu-2lc9bl30t18
{
    name: 'Aprotinin',
    categoryId: 'iqbxyw8u-1e686wg77xk'
}

// record category/iqbxyw8u-1e686wg77xk
{
    name: 'general Antifibrinolytics'
    allowedCountries: [ 'FRA', 'SPA' ]
}

// user.data
{
    country: 'USA'
}
```

the rule below would now perform the following steps:

- load information about the drug the user is trying to purchase
- use the drug's `categoryId` to load the category it belongs to
- check if the user's country is in the list of countries this drug's category can be sold in

```yaml
# Make sure a drug's category is cleared for sale in the user's country
purchase/$drugId:
    request: _('category/' + _( 'drug/' + $drugId ).categoryId ).allowedCountries.indexOf( user.data.country ) > -1
```

In this case the purchase attempt would be declined as the drug's category is only cleared for sale in France and Spain, but the user is from the US.

#### Performance implications of cross-references
Every cross-reference executes an additional query against deepstream's cache for every permissioning step - which will slow message transactions down. Nested cross references in particular are loaded one after another, so can lead to noticeable delays. You can specify a maximal depth for nested cross references as `maxRuleIterations: 3` in deepstream's config file.
