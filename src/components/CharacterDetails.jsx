import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { toFeet } from "../utils";

const columns = [
  {
    field: "gender",
    headerClassName: "theme-header",
    cellClassName: "theme-cell",
    headerName: "Gender",
    width: 150,
    valueGetter: (params) =>
      params.row.gender === "none" || params.row.gender === "n/a"
        ? "haamaephrodite"
        : params.row.gender,
  },
  {
    field: "name",
    headerClassName: "theme-header",
    cellClassName: "theme-cell",
    headerName: "Full name",
    width: 200,
  },
  {
    field: "height",
    headerClassName: "theme-header",
    cellClassName: "theme-cell",
    headerName: "Height",
    type: "number",
    width: 200,
    valueFormatter: ({ value }) =>
      !value
        ? "______"
        : value === "unknown"
        ? "_________"
        : `${value || ""} cm (${toFeet(value)})ft`,
  },
];

export default function CharacterTable({ characters }) {
  const charCum = () => {
    let totalHeight = 0;
    for (let i = 0; i < characters.length; i++) {
      characters[i].height =
        characters[i].height === "unknown" ? 0 : characters[i].height;
      totalHeight += Number(characters[i].height);
    }
    return totalHeight;
  };

  const totalRow = {
    id: characters?.length ?? 1,
    gender: "TOTAL",
    name: !characters ? "___" : `${characters?.length} character(s)`,
    height: !characters ? "0" : charCum(),
  };
  return (
    <Box
      sx={{
        height: 400,
        margin: "auto",
        width: "50%",
        height: "30rem",
        "& .theme-header": {
          color: "yellow",
        },
        "& .theme-cell": {
          color: "yellow",
        },
        "& .MuiDataGrid-cell:hover": {
          color: "white",
        },
        "& .MuiDataGrid-cell": {
          color: "yellow",
        },
        "& .MuiDataGrid-selectedRowCount": {
          color: "yellow",
          border: "2px solid red",
        },
        "& .MuiDataGrid-sortIcon": {
          color: "lime",
          height: "1.5rem",
          width: "1.5rem",
        },
        "& .MuiDataGrid-menuIconButton": {
          backgroundColor: "maroon",
          color: "yellow",
          marginRight: "0.2rem",
        },
        "& .MuiTablePagination-root": {
          color: "yellow",
        },
      }}
    >
      <DataGrid
        rows={characters.concat(totalRow)}
        columns={columns}
        showColumnRightBorder={true}
        showCellRightBorder={true}
        getRowId={(characters) => characters.name}
        pageSize={10}
        hideFooterSelectedRowCount={true}
        rowsPerPageOptions={[10]}
        sx={{
          bgcolor: "black",
          color: "yellow",
        }}
      />
    </Box>
  );
}
