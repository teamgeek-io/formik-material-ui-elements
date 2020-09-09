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

export interface Props extends OutlinedTextFieldProps {
  connectionName: string
  resultPath: string
  query: DocumentNode
  labelExtractor?(item: any): string
  labelPath?: string
  searchVariable?: string
  valueExtractor?(item: any): any
  valuePath?: string
  onChange(value: any): void
  error?: any
}

const Autocomplete: React.FC<Props> = ({
  connectionName,
  resultPath,
  value,
  error,
  labelExtractor,
  labelPath = "name",
  placeholder = "Search",
  query,
  searchVariable = "filter",
  valueExtractor,
  valuePath = "id",
  onBlur,
  onChange,
  ...props
}: Props) => {
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
      if (connectionName) {
        const edges = _.get(result.data, `${connectionName}.edges`)
        suggestions = _.map(edges, (edge: any) => ({
          label: extractLabel(edge.node),
          value: extractValue(edge.node),
        }))
      }
      else if (resultPath) {
        const list = _.get(result.data, `${resultPath}`)
        suggestions = _.map(list, (item: any) => ({
          label: extractLabel(item),
          value: extractValue(item),
        }))
      }
      else {
        console.warn(
          "Neither connection path nor result path have been set \
          on the autocomplete field, so the options can't be fetched."
        )
      }
    }
    setSuggestions(suggestions)
  }, [connectionName, resultPath, extractLabel, extractValue, result])

  useEffect(() => {
    let item = null
    if (value) {
      item = {
        label: extractLabel(value),
        value: extractValue(value),
      }
    }
    setSelectedItem(item)
  }, [extractLabel, extractValue, value])

  const handleChange = (selectedItem: any): void => {
    let value = null
    if (selectedItem) {
      value = {}
      _.set(value, labelPath, selectedItem.label)
      _.set(value, valuePath, selectedItem.value)
    }
    onChange(value)
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

    const {
      onBlur: handleBlur,
      onChange,
      onFocus,
      ...inputProps
    } = getInputProps({
      onBlur,
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
          helperText={error ? error : ""}
          InputLabelProps={getLabelProps()}
          InputProps={{
            onBlur: handleBlur,
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
          margin="normal"
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

export default Autocomplete
