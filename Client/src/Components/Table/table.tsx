import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import "./table.css";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "center" | "right" | "left";
}

interface Data {
  [key: string]: any;
}

interface TableProps {
  columns: Column[];
  data: Data[];
  filters: { [key: string]: string };
}

export default function CustomTable({
  columns,
  data,
  filters,
}: TableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredRows = data.filter((row) => {
    return Object.keys(filters).every((key) => {
      return (
        !filters[key] ||
        String(row[key]).toLowerCase().includes(filters[key].toLowerCase())
      );
    });
  });

  const handleDownloadCSV = () => {
    const csvHeaders = columns.map((col) => col.label).join(",") + "\n";

    const csvRows = filteredRows
      .map((row, rowIndex) => {
        return columns
          .map((col) => {
            let cellValue = row[col.id] || "";

            if (
              col.id === "entity_name" &&
              cellValue &&
              typeof cellValue === "object" &&
              "props" in cellValue &&
              "children" in cellValue.props
            ) {
              cellValue = cellValue.props.children;
            }

            return `"${cellValue}"`;
          })
          .join(",");
      })
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + csvHeaders + csvRows;
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "table_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box className="table-container">
      <TableContainer className="table-content">
        <Table stickyHeader className="custom-table" aria-label="table">
          <TableHead className="custom-table-head">
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className="custom-table-cell-head"
                  align={column.align}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className="custom-table-body">
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={index}
                  className="custom-table-row"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className="custom-table-cell"
                      align={column.align}
                    >
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        className="table-footer"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        {/* ✅ Download CSV Button */}
        <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button>

        {/* ✅ Table Pagination */}
        <TablePagination
          className="custom-table-pagination"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
}
