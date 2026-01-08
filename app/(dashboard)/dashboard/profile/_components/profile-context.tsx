import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bffQuery, bffMutation } from "@/lib/bff-client";
import { useApp } from "@/providers/AppMessageProvider";
import * as yup from "yup";
import PhoneInput, {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";

interface ProfileContextType {
  // Form methods
  methods: any;
  control: any;
  handleSubmit: any;
  setValue: any;
  reset: any;
  errors: any;
  isValid: boolean;

  // API state
  userData: any;
  loadingUserData: boolean;
  updatingProfile: boolean;

  // Profile state
  profileComplete: any;
  profileStatus: "incomplete" | "in-review" | "verified";

  // Functions
  onSubmit: (values: any, event: any) => void;
  onError: (errors: any) => void;

  // Form data
  defaultValues: any;
  documentStatuses: any;

  // API endpoints for child components
  userId?: string | number;
  isAdminEdit: boolean;
  bffEndpoint: string; // Dynamic BFF endpoint for profile updates
  licenseBffEndpoint: string; // Dynamic BFF endpoint for license updates
  queryKey: any; // Dynamic query key for cache invalidation

  // Email validation state
  isCheckingEmail: boolean;
  setIsCheckingEmail: (value: boolean) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
  userId?: string | number; // Optional userId for admin editing
  isAdminEdit?: boolean; // Flag to indicate admin editing mode
}

type DocumentStatus =
  | "not-submitted"
  | "under-review"
  | "rejected"
  | "verified";
interface DocumentSection {
  status: DocumentStatus;
  lastUpdated?: string;
  adminNotes?: string;
}
export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
  userId,
  isAdminEdit = false,
}) => {
  const { message } = useApp();
  const queryClient = useQueryClient();
  const [profileComplete, setProfileComplete] = useState<{
    percentage: number;
    remaining_fields: string[];
  }>({
    percentage: 0,
    remaining_fields: [],
  });
  const [profileStatus, setProfileStatus] = useState<
    "incomplete" | "in-review" | "verified"
  >("verified");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Determine the BFF endpoint based on whether it's admin edit or user edit
  const bffEndpoint =
    isAdminEdit && userId
      ? `/api/admin/users/${userId}`
      : "/api/users/current-user";

  const queryKey = isAdminEdit && userId ? ["user", userId] : ["user-profile"];

  // BFF endpoint for license uploads
  const licenseBffEndpoint =
    isAdminEdit && userId
      ? `/api/admin/users/${userId}/licenses`
      : "/api/users/current-user/licenses";
  // Mock status data - in real app this would come from API
  const [documentStatuses, setDocumentStatuses] = useState<{
    airmen: DocumentSection;
    driver: DocumentSection;
  }>({
    airmen: {
      status: "under-review",
      lastUpdated: "2024-01-15",
      adminNotes:
        "Front certificate looks good. Back certificate needs better image quality.",
    },
    driver: {
      status: "not-submitted",
    },
  });
  const defaultValues = {
    // Basic profile information
    image: null,
    first_name: null,
    last_name: null,
    display_name: null,
    middle_name: null,
    native_language: [],
    other_language: [],
    phone: null,
    other_phone: null,
    email: null,
    additional_email: null,
    bio: null,

    // Address information (flat structure)
    address: null,
    unit_no: null,
    city: null,
    state: null,
    zip_code: null,
    neighbourhood: null,
    country: null,

    // Emergency contact information (flat structure)
    contact_name: null,
    contact_phone: null,
    contact_email: null,
    contact_relationship: null,

    // Social media links (flat structure)
    facebook_url: null,
    instagram_url: null,
    airbnb_url: null,
    youtube_url: null,
    twitter_url: null,
    linkedin_url: null,
    pinterest_url: null,
    vimeo_url: null,
    top_advisor_url: null,
    google_plus_url: null,
    vrbo_url: null,
  };

  const profileSchema = yup.object().shape({
    // Basic profile information
    first_name: yup
      .string()
      .nullable()
      .required("First name is required")
      .test(
        "first-last-not-same",
        "First name and Last name cannot be the same",
        function (value) {
          const { last_name } = this.parent;

          if (!value || !last_name) return true;

          return value.trim().toLowerCase() !== last_name.trim().toLowerCase();
        }
      ),
    last_name: yup
      .string()
      // .nullable()
      .required("Last name is required")
      .test(
        "last-first-not-same",
        "Last name and First name cannot be the same",
        function (value) {
          const { first_name } = this.parent;

          if (!value || !first_name) return true;

          return value.trim().toLowerCase() !== first_name.trim().toLowerCase();
        }
      )
      .nullable(),

    display_name: yup
      .string()
      .required("Display name is required")
      .min(3, "Display name must be at least 4 characters")
      .test(
        "names-required-first",
        "Please enter your first and last name before setting a display name",
        function (value) {
          if (!value) return true;
          const { first_name, last_name } = this.parent;
          return !!first_name && !!last_name;
        }
      )
      .test(
        "not-similar-to-other-names",
        "Display name cannot be similar to your first name, last name, or email",
        function (value) {
          if (!value) return true;

          const { first_name, last_name, email } = this.parent;
          const normalizedValue = value.toLowerCase().trim();

          if (
            first_name &&
            (normalizedValue.includes(first_name.toLowerCase().trim()) ||
              first_name.toLowerCase().trim().includes(normalizedValue))
          ) {
            return false;
          }

          if (
            last_name &&
            (normalizedValue.includes(last_name.toLowerCase().trim()) ||
              last_name.toLowerCase().trim().includes(normalizedValue))
          ) {
            return false;
          }

          // Check against email (before the @ symbol)
          if (email) {
            const emailUsername = email.toLowerCase().trim().split("@")[0];
            if (
              normalizedValue.includes(emailUsername) ||
              emailUsername.includes(normalizedValue)
            ) {
              return false;
            }
          }

          return true;
        }
      ),

    middle_name: yup.string().nullable().optional(),

    // Languages
    native_language: yup
      .array()
      .of(yup.string().required())
      .min(1, "At least one native language is required")
      .test(
        "languages-not-overlap",
        "Native languages cannot overlap with other languages",
        function (value) {
          const { other_language } = this.parent;
          if (!value || !Array.isArray(value) || value.length === 0)
            return true;
          if (
            !other_language ||
            !Array.isArray(other_language) ||
            other_language.length === 0
          )
            return true;

          // Check if any native language is also in other languages
          const hasOverlap = value.some((lang) =>
            other_language.includes(lang)
          );
          return !hasOverlap;
        }
      )
      .transform((value) =>
        value === null || value === undefined ? [] : value
      )
      .default([])
      .nullable(),

    other_language: yup
      .array()
      .of(yup.string().required())
      .test(
        "languages-not-overlap",
        "Other languages cannot overlap with native languages",
        function (value) {
          const { native_language } = this.parent;
          if (!value || !Array.isArray(value) || value.length === 0)
            return true;
          if (
            !native_language ||
            !Array.isArray(native_language) ||
            native_language.length === 0
          )
            return true;

          // Check if any other language is also in native languages
          const hasOverlap = value.some((lang) =>
            native_language.includes(lang)
          );
          return !hasOverlap;
        }
      )
      .transform((value) =>
        value === null || value === undefined ? [] : value
      )
      .default([])
      .nullable(),

    // Phone numbers — FIXED ✅
    phone: yup
      .string()
      .required("Phone is required")
      .test(
        "is-valid-phone",
        "Please enter all required digits and make it valid",
        (value) =>
          !value ||
          (isPossiblePhoneNumber(value) && isValidPhoneNumber(value || ""))
      )
      .test(
        "unique-phone",
        "Primary phone cannot be the same as other phone or contact phone",
        function (value) {
          const { other_phone, contact_phone } = this.parent;

          if (!value) return true;

          if (other_phone && value === other_phone) return false;
          if (contact_phone && value === contact_phone) return false;

          return true;
        }
      ),

    other_phone: yup
      .string()

      .optional()
      .test(
        "is-valid-phone",
        "Please enter all required digits and make it valid",
        (value) =>
          !value ||
          (isPossiblePhoneNumber(value) && isValidPhoneNumber(value || ""))
      )
      .test(
        "unique-other-phone",
        "Other phone cannot be the same as primary phone or contact phone",
        function (value) {
          const { phone, contact_phone } = this.parent;

          if (!value) return true;

          if (phone && value === phone) return false;
          if (contact_phone && value === contact_phone) return false;

          return true;
        }
      )
      .nullable(),

    contact_phone: yup
      .string()

      .required("Contact phone is required")
      .test(
        "is-valid-phone",
        "Please enter all required digits and make it valid",
        (value) =>
          !value ||
          (isPossiblePhoneNumber(value) && isValidPhoneNumber(value || ""))
      )
      .test(
        "unique-contact-phone",
        "Contact phone cannot be same as primary phone or other phone",
        function (value) {
          const { phone, other_phone } = this.parent;

          if (!value) return true;

          if (phone && value === phone) return false;
          if (other_phone && value === other_phone) return false;

          return true;
        }
      )
      .nullable(),

    additional_email: yup
      .string()
      .email("Please enter a valid email address")
      .optional()
      .test(
        "different-from-main-email",
        "Additional email cannot be the same as your primary email",
        function (value) {
          const { email } = this.parent;

          if (!value || !email) return true; // allow empty & only check when both exist

          return value !== email;
        }
      )
      .nullable(),
    email: yup.string().email().required("Email is required"),
    bio: yup.string().required("Biography is required").nullable(),

    // Address information
    address: yup.string().required("Address is required").nullable(),
    unit_no: yup.string().nullable().optional(),
    city: yup.string().required("City is required").nullable(),
    state: yup.string().required("State is required").nullable(),
    zip_code: yup.string().required("ZIP code is required").nullable(),
    neighbourhood: yup.string().optional().nullable(),
    country: yup.string().required("Country is required").nullable(),

    // Emergency contact info
    contact_name: yup.string().required("Contact name is required").nullable(),
    contact_email: yup
      .string()
      .email("Please enter a valid email address")

      .required("Contact email is required")
      .test(
        "unique-contact-email",
        "Contact email cannot be the same as your primary or additional email",
        function (value) {
          const { email, additional_email } = this.parent;

          if (!value) return true; // empty allowed

          if (email && value === email) return false;
          if (additional_email && value === additional_email) return false;

          return true;
        }
      )
      .nullable(),
    contact_relationship: yup
      .string()

      .required("Contact relationship is required")
      .nullable(),

    // Social links
    facebook_url: yup
      .string()
      .url("Please enter a valid URL")
      .test(
        "is-facebook-url",
        "Please enter a valid Facebook URL ",
        function (value) {
          if (!value) return true;
          return value.toLowerCase().includes("facebook.com");
        }
      )
      .nullable()
      .optional(),
    instagram_url: yup
      .string()
      .url("Please enter a valid URL")
      .test(
        "is-instagram-url",
        "Please enter a valid Instagram URL ",
        function (value) {
          if (!value) return true;
          return value.toLowerCase().includes("instagram.com");
        }
      )
      .nullable()
      .optional(),
    airbnb_url: yup
      .string()
      .url("Please enter a valid URL")
      .test(
        "is-airbnb-url",
        "Please enter a valid Airbnb URL ",
        function (value) {
          if (!value) return true;
          return value.toLowerCase().includes("airbnb.com");
        }
      )
      .nullable()
      .optional(),
    youtube_url: yup
      .string()
      .url("Please enter a valid URL")
      .test(
        "is-youtube-url",
        "Please enter a valid YouTube URL ",
        function (value) {
          if (!value) return true;
          const lowerUrl = value.toLowerCase();
          return (
            lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")
          );
        }
      )
      .nullable()
      .optional(),
    twitter_url: yup
      .string()
      .url("Please enter a valid URL")
      .test(
        "is-twitter-url",
        "Please enter a valid X/Twitter URL ",
        function (value) {
          if (!value) return true;
          const lowerUrl = value.toLowerCase();
          return lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com");
        }
      )
      .nullable()
      .optional(),
    linkedin_url: yup
      .string()
      .url("Please enter a valid URL")
      .test(
        "is-linkedin-url",
        "Please enter a valid LinkedIn URL ",
        function (value) {
          if (!value) return true;
          return value.toLowerCase().includes("linkedin.com");
        }
      )
      .nullable()
      .optional(),
    pinterest_url: yup
      .string()
      .url("Please enter a valid URL")
      .test(
        "is-pinterest-url",
        "Please enter a valid Pinterest URL ",
        function (value) {
          if (!value) return true;
          return value.toLowerCase().includes("pinterest.com");
        }
      )
      .nullable()
      .optional(),
    vimeo_url: yup
      .string()
      .url("Please enter a valid URL")
      .test(
        "is-vimeo-url",
        "Please enter a valid Vimeo URL ",
        function (value) {
          if (!value) return true;
          return value.toLowerCase().includes("vimeo.com");
        }
      )
      .nullable()
      .optional(),
    top_advisor_url: yup
      .string()
      .url("Please enter a valid URL")
      .test(
        "is-tripadvisor-url",
        "Please enter a valid TripAdvisor URL ",
        function (value) {
          if (!value) return true;
          return value.toLowerCase().includes("tripadvisor.com");
        }
      )
      .nullable()
      .optional(),
    google_plus_url: yup
      .string()
      .url("Please enter a valid URL")
      .test(
        "is-google-url",
        "Please enter a valid Google URL",
        function (value) {
          if (!value) return true;
          return value.toLowerCase().includes("google.com");
        }
      )
      .nullable()
      .optional(),
    vrbo_url: yup
      .string()
      .url("Please enter a valid URL")
      .test("is-vrbo-url", "Please enter a valid VRBO URL", function (value) {
        if (!value) return true;
        return value.toLowerCase().includes("vrbo.com");
      })
      .nullable()
      .optional(),
  });

  const methods = useForm({
    resolver: yupResolver(profileSchema) as any,
    defaultValues: defaultValues,
    mode: "onChange",
  });

  console.log("form values", methods.getValues());

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isValid },
  } = methods;

  const { data: userData, isLoading: loadingUserData } = useQuery({
    queryKey: queryKey,
    queryFn: () => bffQuery(bffEndpoint),
    select: (res: any) => res?.data,
  });
  useEffect(() => {
    if (userData) {
      const { user_name, ...data } = userData || {};
      setProfileComplete({
        percentage: data?.profile_completeness,
        remaining_fields: data?.missing_fields,
      });
      setProfileStatus(data?.profile_status || "incomplete");
      setDocumentStatuses({
        airmen: {
          status: !data?.air_men
            ? "not-submitted"
            : data?.arimen_license_verified
            ? "verified"
            : data?.arimen_license_rejected
            ? "rejected"
            : "under-review",
          adminNotes: data?.arimen_license_verified
            ? data?.arimen_license_accept_reason
            : data?.arimen_license_rejected
            ? data?.arimen_license_reject_reason
            : undefined,
        },
        driver: {
          status: !data?.driving_license
            ? "not-submitted"
            : data?.driver_license_verified
            ? "verified"
            : data?.driver_license_rejected
            ? "rejected"
            : "under-review",
          adminNotes: data?.driver_license_verified
            ? data?.driver_license_accept_reason
            : data?.driver_license_rejected
            ? data?.driver_license_reject_reason
            : undefined,
        },
      });

      // Reset form with flat structure
      reset({
        // Basic profile information
        email: data?.email,
        first_name: data?.first_name,
        last_name: data?.last_name,
        display_name: data?.display_name,
        middle_name: data?.middle_name,
        native_language: Array.isArray(data?.native_language)
          ? data.native_language
          : data?.native_language
          ? [data.native_language]
          : [],
        other_language: Array.isArray(data?.other_language)
          ? data.other_language
          : data?.other_language
          ? [data.other_language]
          : [],
        phone: data?.phone,
        other_phone: data?.other_phone,
        additional_email: data?.additional_email,
        bio: data?.bio,

        // Address information (flat structure)
        address: data?.address,
        unit_no: data?.unit_no,
        city: data?.city,
        state: data?.state,
        zip_code: data?.zip_code,
        neighbourhood: data?.neighbourhood,
        country: data?.country,

        // Emergency contact information (flat structure)
        contact_name: data?.contact_name,
        contact_phone: data?.contact_phone,
        contact_email: data?.contact_email,
        contact_relationship: data?.contact_relationship,

        // Social media links (flat structure)
        facebook_url: data?.facebook_url,
        instagram_url: data?.instagram_url,
        airbnb_url: data?.airbnb_url,
        youtube_url: data?.youtube_url,
        twitter_url: data?.twitter_url,
        linkedin_url: data?.linkedin_url,
        pinterest_url: data?.pinterest_url,
        vimeo_url: data?.vimeo_url,
        top_advisor_url: data?.top_advisor_url,
        google_plus_url: data?.google_plus_url,
        vrbo_url: data?.vrbo_url,
      });
    }
  }, [userData, reset]);

  const { mutate: updateProfile, isPending: updatingProfile } = useMutation({
    mutationFn: (data: any) =>
      bffMutation(bffEndpoint, {
        method: "PATCH",
        body: data,
      }),
    onSuccess: (res: any) => {
      console.log({ res });
      if (res?.statusCode === 500) {
        return message.error(res?.message);
      }
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      message.success("Profile updated successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (errRes: any) => {
      message.error(
        errRes?.message || "An error occurred while updating the user"
      );
    },
  });

  const convertEmptyToNull = (obj: any) => {
    const result: any = {};

    for (const key in obj) {
      const value = obj[key];

      if (value === "") {
        result[key] = null;
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        result[key] = convertEmptyToNull(value); // recursively handle nested objects
      } else {
        result[key] = value;
      }
    }

    return result;
  };
  const onSubmit = useCallback(
    async (values: any, event: any) => {
      event.preventDefault();

      // Convert empty strings to null BEFORE removing fields
      const cleanedValues = convertEmptyToNull(values);

      // Exclude fields that shouldn't be sent to backend
      const {
        image,
        email, // Email updates handled separately
        ...payload
      } = cleanedValues;

      updateProfile(payload);
    },
    [updateProfile]
  );

  const onError = (errors: any) => {
    console.log({ errors });
  };

  const contextValue: ProfileContextType = {
    methods,
    control,
    handleSubmit,
    setValue,
    reset,
    errors,
    isValid,
    userData,
    loadingUserData,
    updatingProfile,
    profileComplete,
    profileStatus,
    onSubmit,
    onError,
    defaultValues,
    documentStatuses,
    userId,
    isAdminEdit,
    bffEndpoint,
    licenseBffEndpoint,
    queryKey,
    isCheckingEmail,
    setIsCheckingEmail,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};
