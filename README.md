Validators.js 
====
Validators.js is a simple javascript/coffeescript framework for creating form validators. If a validation fails, it adds a
span or a div next to the form field which can be styled using CSS (Using the class 'error' or a custom tag for each type of validation).

Requires:

* jQuery

Installation
----
Add a __script__ tag reference to validators.js after the reference to the jQuery library.

Usage
----
See examples at this [blog post](http://v1v3kn.tumblr.com/post/8989495534/validators-js-javascript-based-form-validation-using)

API Reference
====

Functions
----

```javascript
Validators(mapping, callback)
```
* __mapping__ : It is a javascript object that is a mapping of the css selectors of the form fields (like ```input, .class, #field_id```) etc
* __callback__ : This is a function that is executed when the validation succeeds.

Objects
----

```coffeescript
class Validator
	constructor: (@cssClass, @message) ->
    getDiv: =>
    clearErrors: =>
    execute: (selectors..., callback) ->
```
This is the base class from which all other validators are derived from.

	* __cssClass__ : Its the name of the CSS class used to style the error messages. 
In addition to this all error elements are assigned the class 'error' as well. 
	* __message__ : Message to display when validation fails.
	* __getDiv()__ : Internal function used for generating the html element code.
	* __clearErrors__ : Removes all elements with the class = __cssClass__
	* __execute()__: Executes the callback if the elements that match the __selectors__ validate.

```coffeescript
class PassValidator extends Validator
    constructor: (cssClass = "passwordErr", message = "The passwords don't match") ->
    validate: (selectors...)
```
Checks if two passwords match.

* __validate()__ : returns true if the selected fields validate.

When using this validator with the __Validators()__ function, in the mapping, separate both the form field selectors with a comma
like ```"#field1,#field2```.

```coffeescript
class ValueValidator extends Validator
    constructor: (cssClass = "valErr", message, checkFunction) ->
    validate: (selector) =>
```
* __checkFunction__ is a user defined function that takes as input the form field's value and returns true or false 
	depending on the validation required.

```coffeescript
class LengthValidator extends ValueValidator
    constructor: (min_length, message) ->
```
Checks if the length of the field is more than the __min_length__ or not.

```coffeescript    
class EmptyValidator extends LengthValidator
    constructor: (message = "This field can't be empty") ->
```
Checks if a field is empty.

```coffeescript
class RegexValidator extends ValueValidator
    constructor: (cssClass = "regexErr", message, regex) ->
```
Matches the value of the field with the regular expression __regex__

```coffeescript
class EmailValidator extends RegexValidator
    constructor: (message = "Please enter a valid email address") ->
```
Checks if the form field value is a valid email address.


----
AUTHOR: Vivek Narayanan <mail@vivekn.co.cc>

LICENSE: BSD
