(function() {
  /*
  AJAX/jQuery based validator library.
  License: BSD
  Author: Vivek Narayanan (mail@vivekn.co.cc)
  */  var EmailValidator, EmptyValidator, LengthValidator, PassValidator, RegexValidator, Validator, Validators, ValueValidator, classes, equality, exp, getSelector, map;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Validator = (function() {
    function Validator(cssClass, message) {
      this.cssClass = cssClass;
      this.message = message;
      this.clearErrors = __bind(this.clearErrors, this);;
      this.getDiv = __bind(this.getDiv, this);;
    }
    Validator.prototype.getDiv = function() {
      return "<span class='error " + this.cssClass + "'>" + this.message + "</span>";
    };
    Validator.prototype.clearErrors = function() {
      return $('.' + this.cssClass).html('');
    };
    Validator.prototype.execute = function() {
      var callback, selectors, _i;
      selectors = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), callback = arguments[_i++];
      if (this.validate()) {
        return callback.apply(null, selectors);
      }
    };
    return Validator;
  })();
  PassValidator = (function() {
    __extends(PassValidator, Validator);
    function PassValidator(cssClass, message) {
      if (cssClass == null) {
        cssClass = "passwordErr";
      }
      if (message == null) {
        message = "The passwords don't match";
      }
      this.validate = __bind(this.validate, this);;
      PassValidator.__super__.constructor.call(this, cssClass, message);
    }
    PassValidator.prototype.validate = function() {
      var f1, f2, selectors, state, _ref;
      selectors = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.clearErrors();
      _ref = map(getSelector, selectors.slice(0, 1)), f1 = _ref[0], f2 = _ref[1];
      state = f1.val() === f2.val();
      if (!state) {
        f2.parent().append(this.getDiv());
      }
      return state;
    };
    return PassValidator;
  })();
  ValueValidator = (function() {
    __extends(ValueValidator, Validator);
    function ValueValidator(cssClass, message, checkFunction) {
      if (cssClass == null) {
        cssClass = "valErr";
      }
      this.validate = __bind(this.validate, this);;
      this.checkFunction = checkFunction;
      ValueValidator.__super__.constructor.call(this, cssClass, message);
    }
    ValueValidator.prototype.validate = function(selector) {
      var cf, flag, gd, jqObj;
      this.clearErrors();
      jqObj = getSelector(selector);
      flag = true;
      /*
      Due to the prototypal nature of 'this', 'this' in the jQuery each loop would refer to a DOM element
      instead of the class. To overcome that limitation, cf and gd reference checkFunction and getDiv methods of the class
      */
      cf = this.checkFunction;
      gd = this.getDiv();
      jqObj.each(function() {
        if (!cf($(this).val())) {
          $(this).parent().append(gd);
          return flag = false;
        }
      });
      return flag;
    };
    return ValueValidator;
  })();
  LengthValidator = (function() {
    __extends(LengthValidator, ValueValidator);
    function LengthValidator(min_length, message) {
      var check;
      check = function(val) {
        return val.length >= min_length;
      };
      LengthValidator.__super__.constructor.call(this, "lenErr", message, check);
    }
    return LengthValidator;
  })();
  EmptyValidator = (function() {
    __extends(EmptyValidator, LengthValidator);
    function EmptyValidator(message) {
      if (message == null) {
        message = "This field can't be empty";
      }
      EmptyValidator.__super__.constructor.call(this, 1, message);
    }
    return EmptyValidator;
  })();
  RegexValidator = (function() {
    __extends(RegexValidator, ValueValidator);
    function RegexValidator(cssClass, message, regex) {
      var check;
      if (cssClass == null) {
        cssClass = "valErr";
      }
      check = function(val) {
        return val.match(regex !== null);
      };
      RegexValidator.__super__.constructor.call(this, cssClass, message, check);
    }
    return RegexValidator;
  })();
  EmailValidator = (function() {
    __extends(EmailValidator, RegexValidator);
    function EmailValidator(message) {
      if (message == null) {
        message = "Please enter a valid email address";
      }
      EmailValidator.__super__.constructor.call(this, "valErr", message, /.+@.+\..+/);
    }
    return EmailValidator;
  })();
  Validators = function(mapping, callback) {
    var key, selectors, state;
    $('.error').html('');
    state = true;
    for (key in mapping) {
      selectors = key.split(',');
      if (!mapping[key].validate.apply(null, selectors)) {
        state = false;
      }
    }
    if (state) {
      return callback();
    }
  };
  /*
  Helper functions
  */
  equality = function(list) {
    var init, x, _i, _len;
    init = list[0];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      x = list[_i];
      if (x !== init) {
        return false;
      }
    }
    return true;
  };
  map = function(func, list) {
    var key, results, _results;
    results = [];
    _results = [];
    for (key in list) {
      _results.push(results[key] = func(list[key]));
    }
    return _results;
  };
  getSelector = function(selector) {
    return $(selector);
  };
  /*
  Export to global name_space
  */
  classes = {
    Validator: Validator,
    LengthValidator: LengthValidator,
    EmptyValidator: EmptyValidator,
    PassValidator: PassValidator,
    Validators: Validators,
    ValueValidator: ValueValidator,
    EmailValidator: EmailValidator,
    RegexValidator: RegexValidator
  };
  for (exp in classes) {
    window[exp] = classes[exp];
  }
}).call(this);
