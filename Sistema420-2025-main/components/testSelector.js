import React, { useEffect, useState } from "react";
import { useTestsStore } from "../store/testsContext";
import {
  Checkbox,
  TextField,
  Paper,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

export default function TestSelector() {
  const { currentSearch, toggleTestSelection } = useTestsStore();
  const [inputValue, setInputValue] = useState("");
  if (!currentSearch.tests || currentSearch.tests.length === 0) {
    return <p>No tests available</p>;
  }

  const handleChange = (event, newSelected) => {
    // Siempre usa los objetos originales
    const selected = currentSearch.tests.filter(test =>
      newSelected.some(sel => sel.id === test.id)
    );
    toggleTestSelection(selected);
  };
  // Selects every test initially since the user usually uses all the tests selected.
  const selectAll = () => {
    const selected = currentSearch.tests;
    toggleTestSelection(selected);
  }
  useEffect(() => {
    selectAll();
  }, [])
  // Filtra las opciones según el inputValue
  const filteredOptions = currentSearch.tests.filter(
    (test) =>
      `${test.id} ${test.pn} ${test.application} ${test.revision} ${test.plt}`
        .toLowerCase()
        .includes(inputValue.toLowerCase())
  );
  return (
    <div>
      <TextField
        id="test-search"
        variant="outlined"
        label="Search tests..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ marginBottom: 16, fontSize: 18, minWidth: 420, maxWidth: 600 }}
        InputProps={{
          style: { fontSize: 18, minHeight: 56 },
        }}
      />

      <Autocomplete
        multiple
        options={filteredOptions}
        getOptionLabel={(test) => `FILENAME: ${test.filename} - PN: ${test.pn}`}
        value={currentSearch.selectedTests || []}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={handleChange}
        disableCloseOnSelect
        inputid="test-select"
        PaperComponent={({ children, ...props }) => (
          <Paper
            {...props}
            style={{
              minWidth: 280,
              maxWidth: 380,
              width: "100%",
              maxHeight: 320, // Limita la altura total del dropdown
              overflow: "auto",
            }}
          >
            {children}
          </Paper>
        )}
        ListboxProps={{
          style: {
            maxHeight: 220, // Limita la altura de la lista de opciones (con scroll)
          },
        }}
        renderOption={(props, option, { selected }) => (
          <li
            {...props}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: 8,
              fontSize: 15,
              minWidth: 260,
              maxWidth: 300,
              width: "100%",
              wordBreak: "break-word",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Checkbox checked={selected} style={{ marginRight: 8, padding: 4 }} size="small" />
              <span style={{ fontWeight: 600, marginRight: 8, fontSize: 16 }}>
                FILENAME: {option.filename}
              </span>
              <span style={{ color: "#888", fontSize: 15 }}>PN: {option.pn}</span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#666",
                marginLeft: 28,
                marginTop: 2,
              }}
            >
              APPL: {option.application} | REV: {option.revision} | PLT: {option.plt}
            </div>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            id="test-select"
            variant="outlined"
            label="Select Tests"
            placeholder="Select from filtered tests..."
            InputProps={{
              ...params.InputProps,
              style: { fontSize: 16, minHeight: 40 },
            }}
          />
        )}
      />
    </div>
  );
}