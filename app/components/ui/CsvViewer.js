import { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  useToast,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";

const UploadCsvPage = () => {
  const toast = useToast();
  const [csvData, setCsvData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      console.log(text); // Log the CSV content to debug
      const parsedData = customCsvParser(text);
      if (parsedData) {
        setCsvData(parsedData);
      } else {
        toast({
          title: "Error",
          description: "Failed to parse CSV file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    reader.readAsText(file);
  };

  const customCsvParser = (csvString) => {
    const rows = csvString.split("\n").map((row) => row.split(","));
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });
    return data;
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = csvData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-400 mt-[6%] flex flex-col x-overflow justify-center mx-auto mb-[4%] ">
      <Box p={4} borderWidth="1px" borderRadius="lg">
        <Center>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </Center>
        {csvData.length > 0 && (
          <Box mt={4} overflowX="auto">
            <Table variant="unstyled" borderWidth="1px" borderRadius="lg">
              <Thead>
                <Tr>
                  {Object.keys(csvData[0]).map((header, index) => (
                    <Th
                      key={index}
                      bg={index % 2 === 0 ? "blue.500" : "green.500"}
                      color="white"
                      borderRadius="lg"
                    >
                      {header}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {currentRows.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <Td
                        key={cellIndex}
                        borderWidth="1px"
                        borderRadius="lg"
                        borderColor="black"
                      >
                        {cell}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <SimpleGrid mt={4} mb={10} columns={2} spacing={4}>
              <Button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={indexOfLastRow >= csvData.length}
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </Button>
            </SimpleGrid>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default UploadCsvPage;
