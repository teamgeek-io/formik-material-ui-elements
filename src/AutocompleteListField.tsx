import _ from "lodash"
import React, { useCallback, useState } from "react"

import { Chip } from "@material-ui/core"
import FormControl from "@material-ui/core/FormControl"
import { makeStyles } from "@material-ui/core/styles"

import Autocomplete, { Props as AutocompleteProps } from "./Autocomplete"

// TODO: Figure out how to type the Formik props
interface Props extends AutocompleteProps {
  field: {
    name: string
    value: any
  }
  form: {
    errors: { [key: string]: any }
    touched: { [key: string]: any }
    setFieldValue: (name: string, value: any) => void
    setFieldTouched: (name: string, touched: boolean) => void
  }
  normalize?: (value: string) => string
  listPath?: string
  [name: string]: any
  allowDuplicates: boolean
}

const useStyles = makeStyles((theme) => ({
  list: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}))

const AutocompleteListField: React.FC<Props> = ({
  field,
  form,
  label,
  listPath = "edges",
  labelPath = "name",
  allowDuplicates = false,
  ...props
}: Props) => {
  const classes = useStyles()
  const error = form.errors[field.name] && form.touched[field.name]
  const [autocompleteValue, setAutocompleteValue] = useState<any>()

  const handleBlur = (): void => {
    form.setFieldTouched(field.name, true)
  }

  const handleChange = useCallback(
    (val: any): void => {
      const list = _.get(field.value, listPath, [])
      const existing = _.find(list, ({ node }: { node: any }) => {
        return node.id === val.id
      })
      if (existing && !allowDuplicates) {
        return
      }
      const newList = [...list, { node: { ...val } }]
      const newValue = { ...field.value }
      newValue[listPath] = newList
      form.setFieldValue(field.name, newValue)
      setAutocompleteValue(undefined)
    },
    [field.name, field.value, form, listPath, allowDuplicates],
  )

  const handleDelete = useCallback(
    (idx: number): void => {
      const list = _.get(field.value, listPath, [])
      const newList = [...list]
      newList.splice(idx, 1)
      const newValue = { ...field.value }
      newValue[listPath] = newList
      form.setFieldValue(field.name, newValue)
    },
    [field.name, field.value, form, listPath],
  )

  const list = _.get(field.value, listPath, [])

  return (
    <FormControl fullWidth margin="normal">
      <Autocomplete
        value={autocompleteValue}
        error={error}
        onBlur={handleBlur}
        labelPath={labelPath}
        {...props}
        label={label}
        onChange={handleChange}
      />
      <div className={classes.list}>
        {list.map(({ node }: { node: any }, idx: number) => (
          <Chip
            label={_.get(node, labelPath, "")}
            key={node.id}
            onDelete={() => handleDelete(idx)}
          />
        ))}
      </div>
    </FormControl>
  )
}

export default AutocompleteListField
