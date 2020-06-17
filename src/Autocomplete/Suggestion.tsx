import React from "react"

import MenuItem from "@material-ui/core/MenuItem"

interface Props {
  highlightedIndex: null | number
  index: number
  itemProps: {}
  label: string
  selectedItem?: any
  value: any
}

const Suggestion: React.FC<Props> = ({
  highlightedIndex,
  index,
  itemProps,
  label,
  selectedItem,
  value,
}: Props) => {
  const isHighlighted = highlightedIndex === index
  const isSelected = selectedItem && selectedItem.value === value
  return (
    <MenuItem
      {...itemProps}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 600 : 400,
      }}
    >
      {label}
    </MenuItem>
  )
}

export default Suggestion
