import React, { useEffect, useState } from "react"

import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import InputLabel from "@material-ui/core/InputLabel"
import { makeStyles } from "@material-ui/core/styles"

const RichTextEditor =
  typeof window !== `undefined` ? require("react-rte").default : null

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    "& > div": {
      background: "transparent",
    },
  },
}))

type Props = {
  autoFocus?: boolean
  disabled?: boolean
  field: { [key: string]: any }
  form: { [key: string]: any }
  format?: "html" | "markdown"
  label?: string
  placeholder?: string
}

const RichTextEditorField: React.FC<Props> = ({
  autoFocus = false,
  disabled = false,
  field,
  form,
  format = "html",
  label,
  placeholder,
  ...props
}: Props) => {
  const classes = useStyles()

  const [value, setValue] = useState(RichTextEditor.createEmptyValue())

  useEffect(() => {
    if (field.value && typeof field.value === "string") {
      setValue(RichTextEditor.createValueFromString(field.value, format))
    }
  }, [field.value, format])

  const error = form.errors[field.name] && form.touched[field.name]

  const handleChange = (value: any): void => {
    setValue(value)
    form.setFieldValue(field.name, value)
  }

  const renderEditor = (): React.ReactNode => {
    return (
      <RichTextEditor
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={disabled}
        {...props}
      />
    )
  }

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel htmlFor={field.name} shrink>
        {label}
      </InputLabel>
      <div className={classes.container}>{renderEditor()}</div>
      {error && (
        <FormHelperText error={error}>{form.errors[field.name]}</FormHelperText>
      )}
    </FormControl>
  )
}

const RichTextField = (props: Props): React.ReactNode => {
  return RichTextEditor ? <RichTextEditorField {...props} /> : null
}

export default RichTextField
