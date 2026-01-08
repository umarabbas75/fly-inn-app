import ImageDropzone from "@/components/shared/image-drop-zone";
import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";

const Step5Media = () => {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext(); // Access form context

  return (
    <div className="max-w-3xl min-h-[70vh] mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-4">
        <span>
          Lets upload some <span className="text-red-600">pictures</span> of the
          property{" "}
        </span>
      </h1>

      <Controller
        name="images"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <div className="flex flex-col gap-1 relative" id="images">
            <ImageDropzone
              imagesMultiple={value}
              onChange={(files) => {
                onChange(files);
              }}
            />
            {errors?.images?.message && (
              <span
                style={{ textAlign: "start" }}
                className="text-red-500 text-start"
              >
                {errors?.images?.message?.toString()}
              </span>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default memo(Step5Media);
