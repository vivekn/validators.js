###
AJAX/jQuery based validator library.
License: BSD
Author: Vivek Narayanan (mail@vivekn.co.cc)
###

class Validator
    constructor: (@cssClass, @message) ->

    getDiv: ->
        "<div class='error #{ @cssClass }'>#{ @message }</div>"

    clearErrors: ->
        $('.' + @cssClass).html('')

    execute: (selectors..., callback) ->
        if @validate()
            callback(selectors...)


class jValidator extends Validator
    constructor: (cssClass, message, @condition) ->
        super(cssClass, message)

    validate: (selector) ->
        #selector is any valid css/xpath selector
        jqObj = getSelector selector
        @clearErrors()
        flag = true
        jqObj.each ->
            if eval(@condition)
                $(this).after @getDiv()
                flag = false
        return flag


class LengthValidator extends jValidator
    constructor: (min_length, message) ->
        condition = "$(this).val().length < #{min_length}"
        super "lengthErr", message, condition

EmptyValidator = new LengthValidator 1, "This field can't be empty"


class PassValidator extends Validator
    # Checks if two passwords match
    constructor: (cssClass = "passwordErr", message = "The passwords don't match") ->
        super cssClass, message

    validate: (selectors...) ->
        @clearErrors()
        [f1, f2] = map(getSelector, selectors[0...1])
        state = f1.val() == f2.val()

        if not state
            f2.after @getDiv()

        return state


class ValueValidator extends Validator
    constructor: (cssClass = "valErr", message, @checkFunction) ->
        super cssClass, message

    validate: (selector) ->
        jqObj = getSelector selector
        flag = true
        jqObj.each ->
            if @checkFunction $(this).val()
                $(this).after @getDiv()
                flag = false
        return flag


class RegexValidator extends ValueValidator
    constructor: (cssClass = "valErr", message, regex) ->
        check = (val) -> val.match regex != null
        super cssClass, message, check
        
class EmailValidator extends RegexValidator
    constructor: (message = "Please enter a valid email address") ->
        super(message = message, regex = /.+@.+\..+/) 


#Chain the results of multiple validiators and executing if all the validations have passed.
Validators = (mapping, callback) ->
    state = on
    for key of mapping
        selectors = key.split(',')
        if not mapping[key].validate.apply(null,selectors)
            state = off

    if state
        callback()

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
classes = { Validator, jValidator, LengthValidator, EmptyValidator, PassValidator, Validators, ValueValidator, EmailValidator, RegexValidator }
for exp of classes
    window[exp] = classes[exp]

