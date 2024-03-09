import { useState, useEffect } from "react";
import {
  Button,
  ChakraProvider,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Textarea,
  Tooltip,
  VStack,
  Box,
} from "@chakra-ui/react";
import "tailwindcss/tailwind.css";
import { ObjectMatcher } from "../utils/merge.js";
import axios from "axios";
const supportedTypes = ["string", "number", "boolean"];

// @ts-ignore
function StructuredObjectDefinition({ structuredObject, onChange }) {
  const handleChange = (e, key, field) => {
    const newStructuredObject = { ...structuredObject };
    newStructuredObject[key][field] = e.target.value;
    onChange(newStructuredObject);
  };

  const handleRemoveVariable = (key) => {
    const newStructuredObject = { ...structuredObject };
    delete newStructuredObject[key];
    onChange(newStructuredObject);
  };

  const handleAddVariable = () => {
    const newKey = prompt("Enter the variable name:");
    if (newKey && !structuredObject[newKey]) {
      const newStructuredObject = {
        ...structuredObject,
        [newKey]: { key: newKey, description: "", type: supportedTypes[0] },
      };
      onChange(newStructuredObject);
    }
  };

  return (
    <VStack spacing={4} align="flex-start">
      {/* @ts-ignore */}
      {Object.entries(structuredObject).map(([key, { description, type }]) => (
        <HStack key={key}>
          <FormControl>
            <FormLabel>
              <Tooltip label={`${description} (${type})`} aria-label="tooltip">
                <span>{key}</span>
              </Tooltip>
            </FormLabel>
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => handleChange(e, key, "description")}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select value={type} onChange={(e) => handleChange(e, key, "type")}>
              {supportedTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button onClick={() => handleRemoveVariable(key)}>Remove</Button>
        </HStack>
      ))}
      <Button onClick={handleAddVariable}>Add Variable</Button>
    </VStack>
  );
}

// @ts-ignore
function StructuredObjectForm({ structuredObject, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e, key) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({});
  };

  return (
    <VStack spacing={4} align="flex-start">
      {/* @ts-ignore */}
      {Object.entries(structuredObject).map(([key, { description, type }]) => (
        <FormControl key={key}>
          <FormLabel>
            <Tooltip label={`${description} (${type})`} aria-label="tooltip">
              <span>{key}</span>
            </Tooltip>
          </FormLabel>
          <Input
            placeholder={`Enter ${key}`}
            // @ts-ignore
            value={formData[key] || ""}
            onChange={(e) => handleChange(e, key)}
          />
        </FormControl>
      ))}
      <Button onClick={handleSubmit}>Submit Structured Object</Button>
    </VStack>
  );
}

function MergerPage() {
  const [structuredObject, setStructuredObject] = useState({});
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);
  const [array3, setArray3] = useState([]);
  const [mergedArray, setMergedArray] = useState([]);

  const handleAddToArray1 = (object) => {
    // @ts-ignore
    setArray1((prevArray1) => [...prevArray1, object]);
  };

  const handleAddToArray2 = (object) => {
    // @ts-ignore
    setArray2((prevArray2) => [...prevArray2, object]);
  };

  //   const handleAddToArray3 = (object) => {
  //     // @ts-ignore
  //     setArray3((prevArray3) => [...prevArray3, object]);
  //   };

  const handleMergeArrays = () => {
    const matcher = new ObjectMatcher(array1[0]);
    const merged = matcher.mergeMatching(array1, array2, array3);
    setMergedArray(merged);
    downloadCsv(merged, "merged.csv");
    console.log("Merged Array:", merged);
  };

  const handleUploadCSV = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvString = e.target.result;
      const arrayFromCsv = csvToObjectArray(csvString);
      // @ts-ignore
      setArray3(arrayFromCsv);
    };
    reader.readAsText(file);
  };

  const csvToObjectArray = (csvString) => {
    const lines = csvString.trim().split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());
    const objects = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const obj = {};
      values.forEach((value, index) => {
        // @ts-ignore
        obj[headers[index]] = value.trim();
      });
      objects.push(obj);
    }
    return objects;
  };

  function objectToCsv(data) {
    const keys = Object.keys(data[0]);
    const headerRow = keys.map((key) => key).join(",");
    const rows = data.map((obj) => {
      return keys
        .map((key) => {
          const cell =
            obj[key] === null || obj[key] === undefined ? "" : obj[key];
          return typeof cell === "string" && cell.includes(",")
            ? `"${cell}"`
            : cell;
        })
        .join(",");
    });
    return headerRow + "\n" + rows.join("\n");
  }

  function downloadCsv(data, filename) {
    const csvString = objectToCsv(data);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("File download not supported on this browser.");
    }
  }

  async function fetch() {
    const axiosResponse = await axios.get(
      "https://testnets.tableland.network/api/v1/query?statement=SELECT * FROM pools_reviews_421614_402",
    );
    console.log(axiosResponse);
  }

  return (
    <Box mt={"20"} mb={"20"}>
      <Container maxW="container.lg">
        <VStack spacing={8}>
          <StructuredObjectDefinition
            structuredObject={structuredObject}
            onChange={setStructuredObject}
          />
          <StructuredObjectForm
            structuredObject={structuredObject}
            onSubmit={handleAddToArray1}
          />
          <Textarea
            placeholder="Array 1"
            value={JSON.stringify(array1, null, 2)}
            readOnly
            rows={8}
          />
          <Button
            onClick={async () => {
              await fetch();
            }}
          >
            Fetch
          </Button>
          <StructuredObjectForm
            structuredObject={structuredObject}
            onSubmit={handleAddToArray2}
          />
          <Textarea
            placeholder="Array 2"
            value={JSON.stringify(array2, null, 2)}
            readOnly
            rows={8}
          />
          <Input type="file" onChange={handleUploadCSV} />
          <Textarea
            placeholder="Array 3 (Uploaded CSV)"
            value={JSON.stringify(array3, null, 2)}
            readOnly
            rows={8}
          />
          <Button onClick={handleMergeArrays}>Merge Arrays</Button>
          <Textarea
            placeholder="Merged Array"
            value={JSON.stringify(mergedArray, null, 2)}
            readOnly
            rows={8}
          />
        </VStack>
      </Container>
    </Box>
  );
}

export default MergerPage;
