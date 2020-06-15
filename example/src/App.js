import "./App.css";

import { Field, Form, Formik } from "formik";
import { EmailField, TextField } from "formik-material-ui-elements";
import React from "react";

import { makeStyles } from '@material-ui/core/styles';

import logo from "./logo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    backgroundColor: theme.palette.bgcolor
  }
}));

function App() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Formik>
          {() => (
            <div className="form">
              <Field component={TextField} id="text" name="text" label="Text" />
              <Field component={EmailField} id="email" name="email" label="Email" />
            </div>
          )}
        </Formik>
    </div>
  );
}

export default App;
