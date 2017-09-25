# ChangeHistory for ConboJS 4

The `ChangeHistory` class is a simple object state history manager for [ConboJS](https://conbo.mesmotronic.com/) that enables you to navigate back and forward through the history of every property change made to any object that extends the `EventDispatcher` class, including `Hash`, `Application` and `View`, effectively making it possible to return to any of an object's past states.

The `ChangeHistory` object is modelled on the built-in browser `History` class, offering the following properties and methods:

* `back()` moves back 1 step into history
* `forward()` moved forward 1 step in hisyory
* `go(n)` moves `n` steps backwards or forwards in history
* `currentIndex` is the current place in history
* `beforeFirst` indicates whether you are at a point in history before any changes were made
* `atLast` indicates that you are at the end of history

Initialising `ChangeHistory` for an object couldn't be easier:

```javascript
var histrory = new ChangeHistory(obj);
```
