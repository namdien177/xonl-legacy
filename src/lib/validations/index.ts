import { extend } from "vee-validate";
import { email, max, max_value, min, required } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This field is required",
});

extend("email", {
  ...email,
  message: "This field must be a valid email",
});

extend("max", {
  ...max,
  message: "This field must have {length} characters or less",
});

extend("min", {
  ...min,
  message: "This field must have {length} characters or more",
});

extend("max_value", {
  ...max_value,
  message: "This field must be {max} or less",
});
