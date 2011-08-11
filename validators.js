(function() {
  /*
  AJAX/jQuery based validator library.
  License: BSD
  Author: Vivek Narayanan (mail@vivekn.co.cc)
  */  var EmptyValidator, LengthValidator, PassValidator, Validator, classes, exp, jValidator;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
    return Validator;
  })();
  jValidator = (function() {
    __extends(jValidator, Validator);
    function jValidator(cssClass, message, condition) {
      this.condition = condition;
      jValidator.__super__.constructor.call(this, cssClass, message);
    }
    jValidator.prototype.validate = function(selector, callback) {
      var flag, jqObj;
      if (callback == null) {
        callback = null;
      }
      jqObj = $(selector);
      this.clearErrors();
      flag = true;
      jqObj.each(function() {
        if (eval(this.condition)) {
          $(this).after(this.getDiv());
          return flag = false;
        }
      });
      if (flag && callback) {
        return callback();
      }
    };
    return jValidator;
  })();
  LengthValidator = (function() {
    __extends(LengthValidator, jValidator);
    function LengthValidator(min_length, message) {
      var condition;
      condition = "$(this).val().length < " + min_length;
      LengthValidator.__super__.constructor.call(this, "lengthVal", message, condition);
    }
    return LengthValidator;
  })();
  EmptyValidator = LengthValidator(1, "This field can't be empty");
  PassValidator = (function() {
    function PassValidator() {
      PassValidator.__super__.constructor.apply(this, arguments);
    }
    __extends(PassValidator, Validator);
    PassValidator.prototype.validate = function(field1, field2, callback) {
      var f1, f2, state, _ref;
      if (callback == null) {
        callback = null;
      }
      this.clearErrors();
      _ref = [$("#" + field1), $("#" + field2)], f1 = _ref[0], f2 = _ref[1];
      state = f1.val() === f2.val();
      if (state && callback) {
        return callback();
      } else if (!state) {
        return f2.after(this.getDiv());
      }
    };
    return PassValidator;
  })();
  /*
  Export to global name_space
  */
  classes = {
    Validator: Validator,
    jValidator: jValidator,
    LengthValidator: LengthValidator,
    EmptyValidator: EmptyValidator,
    PassValidator: PassValidator
  };
  for (exp in classes) {
    window[exp] = classes[exp];
  }
}).call(this);
