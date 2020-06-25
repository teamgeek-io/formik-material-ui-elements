import React from "react"

import Autocomplete, { Props as AutocompleteProps } from "./Autocomplete"

// TODO: Figure out how to type the Formik props
interface Props extends AutocompleteProps {
  field: {
    name: string
    value: any
  }
  form: {
    values: { [key: string]: any }
    errors: { [key: string]: any }
    touched: { [key: string]: any }
    setFieldValue: (name: string, value: any) => void
    setFieldTouched: (name: string, touched: boolean) => void
  }
  normalize?: (value: string) => string
  [name: string]: any
}

const identity = (value: string): string => value

const AutocompleteField: React.FC<Props> = ({
  field,
  form,
  normalize = identity,
  ...props
}: Props) => {
  const error = form.errors[field.name] && form.touched[field.name]

  const handleBlur = (): void => {
    form.setFieldTouched(field.name, true)
  }

  const handleChange = (val: any): void => {
    const value = normalize(val)
    form.setFieldValue(field.name, value)
  }

  return (
    <Autocomplete
      value={form.values[field.name]}
      error={error}
      onBlur={handleBlur}
      {...props}
      onChange={handleChange}
    />
  )
}

export default AutocompleteField
