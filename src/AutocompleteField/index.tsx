import { DocumentNode } from "apollo-boost"
import Downshift, { ControllerStateAndHelpers } from "downshift"
import _ from "lodash"
import React, { useCallback, useEffect, useRef, useState } from "react"

import { useQuery } from "@apollo/react-hooks"
import Paper from "@material-ui/core/Paper"
import Popper from "@material-ui/core/Popper"
import { OutlinedTextFieldProps } from "@material-ui/core/TextField"
import makeStyles from "@material-ui/core/styles/makeStyles"

import Input from "./Input"
import Suggestion from "./Suggestion"

const useStyles = makeStyles({
  container: {
    flexGrow: 1,
    position: "relative",
  },
  inputRoot: {
    flexWrap: "wrap",
  },
  inputInput: {
    width: "auto",
    flexGrow: 1,
  },
})

interface Props extends OutlinedTextFieldProps {
  connectionName: string
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
  query: DocumentNode
  labelExtractor?(item: any): string
  labelPath?: string
  searchVariable?: string
  valueExtractor?(item: any): any
  valuePath?: string
}

const AutocompleteField: React.FC<Props> = ({
  connectionName,
  field,
  form,
  labelExtractor,
  labelPath = "name",
  placeholder = "Search",
  query,
  searchVariable = "filter",
  valueExtractor,
  valuePath = "id",
  ...props
}: Props) => {
  const error = form.errors[field.name] && form.touched[field.name]

  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const inputEl = useRef<HTMLElement>(null)

  const classes = useStyles()

  const result = useQuery(query, {
    variables: {
      [searchVariable]: "",
    },
    notifyOnNetworkStatusChange: true,
  })

  const refetch = _.debounce(result.refetch, 300)

  const extractLabel = useCallback(
    (item): string => {
      let label
      if (typeof labelExtractor === "function") {
        label = labelExtractor(item)
      }
      if (!label) {
        label = _.get(item, labelPath)
      }
      return label
    },
    [labelPath, labelExtractor],
  )

  const extractValue = useCallback(
    (item) => {
      let value
      if (typeof valueExtractor === "function") {
        value = valueExtractor(item)
      }
      if (!value) {
        value = _.get(item, valuePath)
      }
      return value
    },
    [valuePath, valueExtractor],
  )

  useEffect(() => {
    let suggestions: any[] = []
    if (!result.loading && result.data) {
      const edges = _.get(result.data, `${connectionName}.edges`)
      suggestions = _.map(edges, (edge: any) => ({
        label: extractLabel(edge.node),
        value: extractValue(edge.node),
      }))
    }
    setSuggestions(suggestions)
  }, [connectionName, extractLabel, extractValue, result])

  useEffect(() => {
    let item = null
    if (field.value) {
      item = {
        label: extractLabel(field.value),
        value: extractValue(field.value),
      }
    }
    setSelectedItem(item)
  }, [extractLabel, extractValue, field.value])

  const handleBlur = (): void => {
    form.setFieldTouched(field.name, true)
  }

  const handleChange = (selectedItem: any): void => {
    let value = null
    if (selectedItem) {
      value = {}
      _.set(value, labelPath, selectedItem.label)
      _.set(value, valuePath, selectedItem.value)
    }
    form.setFieldValue(field.name, value)
  }

  const renderDownshift = (
    downshift: ControllerStateAndHelpers<any>,
  ): React.ReactNode => {
    const {
      clearSelection,
      getInputProps,
      getItemProps,
      getLabelProps,
      getMenuProps,
      highlightedIndex,
      isOpen,
      openMenu,
      selectedItem,
    } = downshift

    const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
      onBlur: handleBlur,
      onChange: (event: any) => {
        if (event.target.value === "") {
          clearSelection()
        } else {
          refetch({
            [searchVariable]: event.target.value,
          })
        }
      },
      onFocus: openMenu,
      placeholder,
    })

    return (
      <div className={classes.container}>
        <Input
          error={error}
          fullWidth
          // eslint-disable-next-line react/prop-types
          helperText={error ? form.errors[field.name] : ""}
          InputLabelProps={getLabelProps()}
          InputProps={{
            onBlur,
            onChange,
            onFocus,
            classes: {
              root: classes.inputRoot,
              input: classes.inputInput,
            },
          }}
          inputProps={inputProps}
          inputRef={inputEl}
          loading={result.loading}
          onClear={clearSelection}
          {...props}
        />
        <Popper
          anchorEl={inputEl.current}
          open={isOpen}
          style={{ zIndex: 1400 }}
        >
          <div
            {...(isOpen ? getMenuProps({}, { suppressRefError: true }) : {})}
          >
            <Paper
              square
              style={{
                marginTop: 8,
                width: inputEl.current
                  ? inputEl.current.clientWidth
                  : undefined,
              }}
            >
              {suggestions.map((suggestion, index) => (
                <Suggestion
                  highlightedIndex={highlightedIndex}
                  index={index}
                  itemProps={getItemProps({ item: suggestion })}
                  key={suggestion.value}
                  label={suggestion.label}
                  selectedItem={selectedItem}
                  value={suggestion.value}
                />
              ))}
            </Paper>
          </div>
        </Popper>
      </div>
    )
  }

  return (
    <Downshift
      itemToString={(item): string => (item ? item.label : "")}
      onChange={handleChange}
      selectedItem={selectedItem}
    >
      {renderDownshift}
    </Downshift>
  )
}

export default AutocompleteField
