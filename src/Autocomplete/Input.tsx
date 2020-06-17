import clsx from "clsx"
import React from "react"

import CircularProgress from "@material-ui/core/CircularProgress"
import IconButton from "@material-ui/core/IconButton"
import TextField, { OutlinedTextFieldProps } from "@material-ui/core/TextField"
import makeStyles from "@material-ui/core/styles/makeStyles"
import ClearIcon from "@material-ui/icons/Clear"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    position: "relative",
  },
  fullWidth: {
    width: "100%",
  },
  progress: {
    color: theme.palette.primary.main,
    position: "absolute",
    top: 44,
    right: 12,
    marginTop: -12,
    marginLeft: -12,
  },
  button: {
    color: theme.palette.primary.main,
    position: "absolute",
    top: 44,
    right: 12,
    marginTop: -12,
    marginLeft: -12,
    padding: 0,
  },
}))

interface Props extends OutlinedTextFieldProps {
  loading: boolean
  onClear(): void
}

const Input: React.FC<Props> = ({
  loading,
  margin = "dense",
  onClear,
  inputProps,
  variant = "outlined",
  ...props
}: Props) => {
  const classes = useStyles()

  if (inputProps && !inputProps.value) {
    inputProps.value = ""
  }

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.wrapper, {
          [classes.fullWidth]: props.fullWidth,
        })}
      >
        <TextField
          inputProps={inputProps}
          margin={margin}
          variant={variant}
          {...props}
        />
        {loading && <CircularProgress size={24} className={classes.progress} />}
        {!loading && onClear && inputProps?.value ? (
          <IconButton
            aria-label="clear"
            className={classes.button}
            onClick={onClear}
            size="small"
          >
            <ClearIcon />
          </IconButton>
        ) : null}
      </div>
    </div>
  )
}

export default Input
