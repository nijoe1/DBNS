import { useState, useEffect } from "react";
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
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchCsvData();
  }, []);

  const fetchCsvData = async () => {
    try {
      const response = await fetch(
        "https://gateway.lighthouse.storage/ipfs/QmcucqWyBbpYBJQWxYGzoRddbVpVTupAahEzWso3FpehpQ",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch CSV file");
      }
      const text = await response.text();
      const parsedData = customCsvParser(text);
      if (parsedData) {
        setCsvData(parsedData);
      } else {
        throw new Error("Failed to parse CSV file");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
  let currentRows = csvData.slice(indexOfFirstRow, indexOfLastRow);

  // Sorting
  if (sortBy) {
    currentRows.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA < valB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnName);
      setSortOrder("asc");
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-400 mt-[6%] flex flex-col x-overflow justify-center mx-auto mb-[4%] ">
      <Box p={4} borderWidth="1px" borderRadius="lg">
        {csvData.length > 0 && (
          <Box mt={4} overflowX="auto">
            <Table variant="unstyled" borderWidth="1px" borderRadius="lg">
              <Thead>
                <Tr>
                  {Object.keys(csvData[0]).map((header, index) => (
                    <Th
                      key={index}
                      bg="#424242"
                      color="white"
                      borderRadius="lg"
                      onClick={() => handleSort(header)}
                      cursor="pointer"
                    >
                      {header}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {currentRows.map((row, rowIndex) => (
                  <Tr key={rowIndex} bg="#edf2f7" border="#424242" p={2}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <Td
                        key={cellIndex}
                        borderWidth="1px"
                        borderRadius="lg"
                        borderColor="#424242"
                        color="#424242"
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
