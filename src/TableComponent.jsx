import React, { useMemo } from "react";
import {
  // MRT_TableBodyCellValue,
  MRT_TablePagination,
  // MRT_ToolbarAlertBanner,
  flexRender,
  // MaterialReactTable,
  useMaterialReactTable
} from "material-react-table";
import {
  Box,
  Avatar,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const tableConfig = {
  "columns": [
    { "accessorKey": "name", "header": "Name" },
    { "accessorKey": "status", "header": "Status" },
    { "accessorKey": "role", "header": "Role" },
    { "accessorKey": "email", "header": "Email" },
    { "accessorKey": "teams", "header": "Teams" }
  ]
};

const tableData = [
  ...Array.from({ length: 100 }, (_, i) => ({
    "name": `User ${i + 1}`,
    "username": `user${i + 1}`,
    "image": `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${(i % 100) + 1}.jpg`,
    "status": "Working",
    "role": "Product Manager",
    "email": `user${i + 1}@company.com`,
    "teams": "Design, Product, Development, DevOps, Cyber Security, Marketing, Sales, Support"
  }))
];

const visibleTeamChipStyles = [
  { color: '#0080FF', backgroundColor: '#CCE6FF' },
  { color: '#004D99', backgroundColor: '#99CCFF' },
  { color: '#003366', backgroundColor: '#66B3FF' }
]

const TableComponent = () => {
  const columns = useMemo(() => [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllRowsSelected()}
    //       indeterminate={table.getIsSomeRowsSelected()}
    //       onChange={table.getToggleAllRowsSelectedHandler()}
    //     />
    //   ),
    //   size: 50,
    //   Cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onChange={row.getToggleSelectedHandler()}
    //     />
    //   ),
    // },
    ...tableConfig.columns.map(col => ({
      accessorKey: col.accessorKey,
      header: col.header,
      size: col.size,
      Cell: ({ row }) => {
        const value = row.original[col.accessorKey];
        if (col.accessorKey === "name") {
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src={row.original.image} alt={row.original.name} />
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {row.original.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  @{row.original.username}
                </Typography>
              </Box>
            </Box>
          );
        } else if (col.accessorKey === "status") {
          return <Chip label={value} color="primary" size="small" />;
        } else if (col.accessorKey === "teams") {
          const teams = value.split(", ");
          const maxVisibleTeams = 3;
          const visibleTeams = teams.slice(0, maxVisibleTeams);
          const hiddenTeamsCount = teams.length - maxVisibleTeams;
          return (
            <Box display="flex" flexWrap="wrap" gap={1}>
              {visibleTeams.map((team, index) => (
                <Chip
                  key={team}
                  label={team}
                  sx={visibleTeamChipStyles[index]}
                  size="small"
                  style={{ marginRight: 5 }}
                />
              ))}
              {hiddenTeamsCount > 0 && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={`+${hiddenTeamsCount}`}
                />
              )}
            </Box>
          );
        }
        return value;
      },
    })),
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableRowSelection: true,
    enablePagination: true,
    initialState: {
      pagination: { pageSize: 12, pageIndex: 0 },
    },
    muiPaginationProps: {
      showFirstButton: false,
      showLastButton: false,
      showRowsPerPage: false,
    },
    paginationDisplayMode: "pages",
  });

  return (
    <Stack sx={{ m: "2rem 0", backgroundColor: "white", borderRadius: 2 }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell align="left" variant="head" key={header.id} >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id} selected={row.getIsSelected()}>
                {row.getVisibleCells().map(cell => (
                  <TableCell align="left" variant="body" key={cell.id} size="small">
                    {flexRender(cell.column.columnDef.Cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <MRT_TablePagination
        sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        table={table}
      />
    </Stack>
  );
};

export default TableComponent;