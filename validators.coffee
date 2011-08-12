###
AJAX/jQuery based validator library.
License: BSD
Author: Vivek Narayanan (mail@vivekn.co.cc)
###

class Validator
    constructor: (@cssClass, @message) ->

    getDiv: =>
        "<span class='error #{ @cssClass }'>#{ @message }</span>"

    clearErrors: =>
        $('.' + @cssClass).html('')

    execute: (selectors..., callback) ->
        if @validate()
            callback(selectors...)

class PassValidator extends Validator
    # Checks if two passwords match
    constructor: (cssClass = "passwordErr", message = "The passwords don't match") ->
        super cssClass, message

    validate: (selectors...) =>
        @clearErrors()
        [f1, f2] = map(getSelector, selectors[0...1])
        state = f1.val() == f2.val()

        if not state
            f2.parent().append @getDiv()

        return state


class ValueValidator extends Validator
    constructor: (cssClass = "valErr", message, checkFunction) ->
        @checkFunction = checkFunction
        super cssClass, message

    validate: (selector) =>
        @clearErrors()
        jqObj = getSelector selector
        flag = true
        ###
        Due to the prototypal nature of 'this', 'this' in the jQuery each loop would refer to a DOM element
        instead of the class. To overcome that limitation, cf and gd reference checkFunction and getDiv methods of the class 
        ###
        cf = @checkFunction
        gd = @getDiv()
        jqObj.each ->
            if not cf $(this).val()
                $(this).parent().append gd
                flag = false
        return flag

class LengthValidator extends ValueValidator
    constructor: (min_length, message) ->
        check = (val) -> val.length >= min_length 
        super "lenErr", message, check
    
class EmptyValidator extends LengthValidator
    constructor: (message = "This field can't be empty") ->
        super 1, message
        @cssClass = "emptyErr"

class RegexValidator extends ValueValidator
    constructor: (cssClass = "regexErr", message, regex) ->
        check = (val) -> val.match(regex) != null
        super cssClass, message, check
        
class EmailValidator extends RegexValidator
    constructor: (message = "Please enter a valid email address") ->
        super "emailErr", message, /.+@.+\..+/


#Chain the results of multiple validiators and executing if all the validations have passed.
Validators = (mapping, callback) ->
    $('.error').html('')
    state = on
    for key of mapping
        selectors = key.split(',')

        if not mapping[key].validate.apply(null,selectors)
            state = off

    if state and callback
        callback()

    return state

###
Helper functions
###

#Check if all elements in a list are equal
equality = (list) ->
    init = list[0]
    for x in list
        if x != init
            return no
    return yes

#Map a function over a list
map = (func, list) ->
    results = []
    for key of list
        results[key] = func(list[key])

#Returns a jQuery object for a CSS/Xpath selector
getSelector = (selector) -> $(selector)

###
Export to global name_space
###
classes = { Validator, LengthValidator, EmptyValidator, PassValidator, Validators, ValueValidator, EmailValidator, RegexValidator }
for exp of classes
    window[exp] = classes[exp]

