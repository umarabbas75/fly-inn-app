import { cn } from "@/lib/utils";
import { Fragment, InputHTMLAttributes } from "react";

interface PartialInputProps {
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}
type InputOneTimePasswordProps = {
  value: string;
  onChange(value: string): void;
  size?: number;
  pattern?: "numeric" | "alphanumeric";
} & PartialInputProps &
  InputHTMLAttributes<HTMLInputElement>;

export const OTPInputField = ({
  className = "",
  size = 4,
  pattern = "numeric",
  value = "",
  onChange,
  ...rest
}: InputOneTimePasswordProps) => {
  const validationPattern: RegExp = pattern ? /[0-9]{1}/ : /[0-9a-zA-Z]{1}/;
  // Create an array based on the size.
  const tempInputArr = new Array(size).fill("-");
  const InputOTPCustomClassName: string = cn(
    `w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-grey text-lg focus:ring-1 ring-primary outline-none`,
    className
  );
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const elem = e.target;
    const val = e.target.value;
    // check if the value is valid
    if (!validationPattern.test(val) && val !== "") return;

    // change the value of the upper state using onChange
    const valueArr = value.split("");
    valueArr[index] = val;
    const newVal = valueArr.join("").slice(0, 6);
    onChange && onChange(newVal);

    //focus the next element if there's a value
    if (val) {
      const next = elem.nextElementSibling as HTMLInputElement | null;
      next?.focus();
    }
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // handle backspace & remove value form input field
    const current = e.currentTarget;
    if (e.key === "ArrowLeft" || e.key === "Backspace") {
      const prev = current.previousElementSibling as HTMLInputElement | null;
      prev?.focus();
      prev?.setSelectionRange(0, 1);
      return;
    }

    if (e.key === "ArrowRight") {
      const prev = current.nextSibling as HTMLInputElement | null;
      prev?.focus();
      prev?.setSelectionRange(0, 1);
      return;
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // paste values into input fields
    e.preventDefault();
    const val = e.clipboardData.getData("text").substring(0, size);
    onChange(val);

    // select all input fields with attribute name equals to "pass code"
    const passCodeInputs = document.querySelectorAll<HTMLInputElement>(
      `input[name="passcode"]`
    );
    // focus on the last input field after pasting values
    const lastInput = passCodeInputs[passCodeInputs.length - 1];
    lastInput && lastInput?.focus();
  };
  return (
    <Fragment>
      <div className="flex gap-2">
        {tempInputArr.map((_, index) => (
          <input
            key={index}
            {...rest}
            className={InputOTPCustomClassName}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern={validationPattern.source}
            maxLength={1}
            value={value.at(index) ?? ""}
            onChange={(e) => handleInputChange(e, index)}
            onKeyUp={handleKeyUp}
            onPaste={handlePaste}
          />
        ))}
      </div>
    </Fragment>
  );
};
