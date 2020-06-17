import React from "react";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
interface Props extends OutlinedTextFieldProps {
    loading: boolean;
    onClear(): void;
}
declare const Input: React.FC<Props>;
export default Input;
