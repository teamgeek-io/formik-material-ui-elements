import React from "react";
import { Props as AutocompleteProps } from "./Autocomplete";
interface Props extends AutocompleteProps {
    field: {
        name: string;
        value: any;
    };
    form: {
        errors: {
            [key: string]: any;
        };
        touched: {
            [key: string]: any;
        };
        setFieldValue: (name: string, value: any) => void;
        setFieldTouched: (name: string, touched: boolean) => void;
    };
    normalize?: (value: string) => string;
    [name: string]: any;
}
declare const AutocompleteField: React.FC<Props>;
export default AutocompleteField;
