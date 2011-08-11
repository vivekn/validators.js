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

    execute: (callback) ->
        if @validate()
            callback()

class jValidator extends Validator
    constructor: (cssClass, message, @condition) ->
        super(cssClass, message)

    validate: (selector) ->
        #selector is any valid css/xpath selector
        jqObj = $(selector)
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
        super "lengthVal", message, condition

EmptyValidator = new LengthValidator 1, "This field can't be empty"

class PassValidator extends Validator
    # Checks if two passwords match
    validate: (field1, field2, callback = null) ->
        @clearErrors()
        [f1, f2] = [$("##{field1}"), $("##{field2}")]
        state = f1.val() == f2.val()

        if not state
            f2.after @getDiv()

        return state

chain_validators = (mapping, callback) ->
    state = on
    for key of mapping
        if not mapping[key].validate()
            state = off

    if state
        callback()

        

###
Export to global name_space
###
classes = { Validator, jValidator, LengthValidator, EmptyValidator, PassValidator }
for exp of classes
    window[exp] = classes[exp]

