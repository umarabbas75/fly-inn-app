import * as yup from "yup";

export const cancellationPolicySchema = yup.object().shape({
  type: yup.string().required("Type is required"),
  group_name: yup.string().required("Title is required"),
  before_check_in: yup.string().required("Before check in policy is required"),
  after_check_in: yup.string().required("After check in policy is required"),
});

export type CancellationPolicyFormData = yup.InferType<
  typeof cancellationPolicySchema
>;
