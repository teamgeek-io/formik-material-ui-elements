import "./App.css";

import { Field, Formik } from "formik";
import { AutocompleteField, EmailField, PasswordField, RichTextField, SubmitButton, SwitchField, TextField } from "formik-material-ui-elements";
import gql from "graphql-tag"
import React from "react";

import { MockedProvider } from '@apollo/react-testing';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    backgroundColor: theme.palette.bgcolor
  }
}));

const GET_TAGS_QUERY = gql`
  query getAllTags(
    $filter: String
    $sort: [TagNodeSortEnum]
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    tags(
      filter: $filter
      sort: $sort
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          name
          id
        }
      }
    }
  }
`

const mocks = [
  {
    request: {
      query: GET_TAGS_QUERY,
      variables: {
        filter: 'a',
      },
    },
    result: {
      data: {
        tags: {
          edges: [
            { node: { id: "1", name: "Test" }},
            { node: { id: "2", name: "Test 2" }},
            { node: { id: "3", name: "Test 3" }}
          ]
        }
      },
    },
  },
];

function App() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Formik initialValues={{}}>
          {({ values }) => (
            <div className="form">
              <Field component={TextField} id="text" name="text" label="Text" />
              <Field component={EmailField} id="email" name="email" label="Email" />
              <Field component={PasswordField} id="password" name="password" label="Password" />
              <Field component={RichTextField} id="rich" name="rich" label="Rich Text" />
              <Field component={SwitchField} id="switch" name="switch" label="Switch" />
              <Field
                component={AutocompleteField}
                id="auto"
                name="auto"
                label="Auto"
                connectionName="tags"
                query={GET_TAGS_QUERY}
                labelPath="name"
              />
              <SubmitButton />
            </div>
          )}
        </Formik>
      </MockedProvider>
    </div>
  );
}

export default App;
