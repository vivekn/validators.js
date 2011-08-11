(function() {
  /*
  AJAX/jQuery based validator library.
  License: BSD
  Author: Vivek Narayanan (mail@vivekn.co.cc)
  */  var EmailValidator, EmptyValidator, LengthValidator, PassValidator, RegexValidator, Validator, Validators, ValueValidator, classes, equality, exp, getSelector, jValidator, map;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
    }
    Validator.prototype.getDiv = function() {
      return "<div class='error " + this.cssClass + "'>" + this.message + "</div>";
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
  jValidator = (function() {
    __extends(jValidator, Validator);
    function jValidator(cssClass, message, condition) {
      this.condition = condition;
      jValidator.__super__.constructor.call(this, cssClass, message);
    }
    jValidator.prototype.validate = function(selector) {
      var flag, jqObj;
      jqObj = getSelector(selector);
      this.clearErrors();
      flag = true;
      jqObj.each(function() {
        if (eval(this.condition)) {
          $(this).after(this.getDiv());
          return flag = false;
        }
      });
      return flag;
    };
    return jValidator;
  })();
  LengthValidator = (function() {
    __extends(LengthValidator, jValidator);
    function LengthValidator(min_length, message) {
      var condition;
      condition = "$(this).val().length < " + min_length;
      LengthValidator.__super__.constructor.call(this, "lengthErr", message, condition);
    }
    return LengthValidator;
  })();
  EmptyValidator = new LengthValidator(1, "This field can't be empty");
  PassValidator = (function() {
    __extends(PassValidator, Validator);
    function PassValidator(cssClass, message) {
      if (cssClass == null) {
        cssClass = "passwordErr";
      }
      if (message == null) {
        message = "The passwords don't match";
      }
      PassValidator.__super__.constructor.call(this, cssClass, message);
    }
    PassValidator.prototype.validate = function() {
      var f1, f2, selectors, state, _ref;
      selectors = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.clearErrors();
      _ref = map(getSelector, selectors.slice(0, 1)), f1 = _ref[0], f2 = _ref[1];
      state = f1.val() === f2.val();
      if (!state) {
        f2.after(this.getDiv());
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
      this.checkFunction = checkFunction;
      ValueValidator.__super__.constructor.call(this, cssClass, message);
    }
    ValueValidator.prototype.validate = function(selector) {
      var flag, jqObj;
      jqObj = getSelector(selector);
      flag = true;
      jqObj.each(function() {
        if (this.checkFunction($(this).val())) {
          $(this).after(this.getDiv());
          return flag = false;
        }
      });
      return flag;
    };
    return ValueValidator;
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
      var regex;
      if (message == null) {
        message = "Please enter a valid email address";
      }
      EmailValidator.__super__.constructor.call(this, message = message, regex = /.+@.+\..+/);
    }
    return EmailValidator;
  })();
  Validators = function(mapping, callback) {
    var key, selectors, state;
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
    jValidator: jValidator,
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
