import { DocumentNode } from "apollo-boost";
import React from "react";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
export interface Props extends OutlinedTextFieldProps {
    connectionName: string;
    resultPath: string;
    query: DocumentNode;
    labelExtractor?(item: any): string;
    labelPath?: string;
    searchVariable?: string;
    valueExtractor?(item: any): any;
    valuePath?: string;
    onChange(value: any): void;
    error?: any;
}
declare const Autocomplete: React.FC<Props>;
export default Autocomplete;
