import * as React from 'react';
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {withStyles} from '@material-ui/core';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import TableFooter from '@mui/material/TableFooter';
import getReq from './getReq.js';
import { TextField } from '@mui/material';
import SortableTableHeader from './SortableTableHeader.jsx';


// imported from material ui example
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    width: '20vw'
  },
  body:{
    fontSize: 14,
  }
}))(TableCell);

export const FilterTableRow = withStyles(() => ({
  root: {
    height: 'auto',
  }
}))(TableRow);

export const FilterTableCell = withStyles(() => ({
  root: {
    height: "100%",
    padding: "0px !important",
    fontSize: "8px",
  }
}))(TableCell);

export default function StockTable() {
  const [loading, setLoading] = React.useState(true);
  const [numStocks, setNumStocks] = React.useState(0);
  const [stocks, setStocks] = React.useState([]);
  const [rowsPerPage] = React.useState(15);   // limted to 15 on the backend would need to call and merge if more than 15
  const [page, setPage] = React.useState(0);
  const [order, setOrder] = React.useState(null);
  const [orderDirection, setOrderDirection] = React.useState('Asc');
  const [scoreActive, setScoreActive] = React.useState(false);
  const [volActive, setVolActive] = React.useState(false);
  const [filtered, setFiltered] = React.useState(false);
  const [filteredStocks, setFilteredStocks] = React.useState([]);
  const [scoreFilter, setScoreFilter] = React.useState("");
  const [tickerFilter, setTickerFilter] = React.useState("");
  const [volHover, setVolHover] = React.useState(false);
  const [scoreHover, setScoreHover] = React.useState(false);

  const orders = {
    'Snowflake Score' : 'score',
    'Price Volatility' : 'vol',
  }
  // use effect to pull stocks from backend
  useEffect(() => { async function fetchData() {
    const n = await getReq('stocks/number');
    setNumStocks(n ? n.number[0]['count(name)'] : 0); 
    const stockPath = order ? `stocks/${page * rowsPerPage}/sorted/${order}${orderDirection}` : `stocks/${page * rowsPerPage}`;
    const s = await getReq(stockPath);
    setStocks(s ? s.stocks.splice(0,rowsPerPage): []);
    setLoading(false);
  }
  fetchData();
}
, [page, rowsPerPage, order, orderDirection]);



  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

// toggles the sort order
  const handleHeaderClick = (obj) => {
  clearFilters();
  // if the order is the same, toggle the direction
  orders[obj] === order ? setOrderDirection(orderDirection === 'Asc' ? 'Dsc' : 'Asc'): setOrderDirection('Asc');
  
  // activate the order, deactivate the other
  orders[obj] === 'score' ? setScoreActive(true) : setScoreActive(false);
  orders[obj] === 'vol' ? setVolActive(true) : setVolActive(false); 

  // set the order
  setOrder(orders[obj]);
  setPage(0);
  
}

// Local filter of result scores
const handleScoreFilter= (obj, column) => {
  // allows for compound filtering with tickers
  const toFilter = filtered && tickerFilter ? filteredStocks : stocks;
  setScoreFilter(obj);
  const symbol = obj[0];
  const number = obj.substring(1).replace(/\D/g,'').trim();

  // empty filter
  if(obj === ""){
    if(!tickerFilter) setFiltered(false);
    return;
  }

  // filter
  let fs = [];
  switch(symbol){
    case '>': {
      fs = toFilter.filter(stock => stock[column] > Number(number));
      break;
    }
    case '<': {
      fs = toFilter.filter(stock => stock[column] < Number(number));
      break;
    }
    case '=': {
      fs = toFilter.filter(stock => stock[column] === Number(number));
      break;
    }
    default: {
      setFiltered(false);
      return;
    }
  }
  setFiltered(true);
  setFilteredStocks(fs);
}

// Local filters of tickers
const handleTickerFilter= (obj, column) => {
  // allows for compound filtering with score filter
  const toFilter = filtered && scoreFilter ? filteredStocks : stocks;
  setTickerFilter(obj);
  if(obj === ""){
    if(!scoreFilter) setFiltered(false);
    return;
  }
  const fs = toFilter.filter(stock => stock[column].toLowerCase().includes(obj.toLowerCase()));
  setFiltered(true);
  setFilteredStocks(fs);
}

const clearFilters = () => {
  setFiltered(false);
  setScoreFilter("");
  setTickerFilter("");
}
  return (
    <>
    {
      loading ? 
      <p>Loading...</p> 
      :
      <Box 
        fullWidth
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          }}> 
        <h1> SimplyWS Stock Information</h1>
        <TableContainer component={Paper} sx ={{width: "80%"}}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Company Name</StyledTableCell>
                <StyledTableCell align="left">Ticker</StyledTableCell>
                <StyledTableCell align="left">Last Price</StyledTableCell>
                <StyledTableCell 
                  align="left" 
                  onClick={(e) => handleHeaderClick(e.target.innerText)}
                  onMouseEnter={() => setScoreHover(true)}
                  onMouseLeave = {() => setScoreHover(false)}
                  >
                  <SortableTableHeader 
                    title = "Snowflake Score" 
                    sortField= "score" 
                    active = {scoreActive}
                    sortDirection={orderDirection} 
                    hover={scoreHover}
                    />
                </StyledTableCell>
                <StyledTableCell 
                  align="left" 
                  onClick={(e) => handleHeaderClick(e.target.innerText)}
                  onMouseEnter={() => setVolHover(true)}
                  onMouseLeave={() => setVolHover(false)}
                >
                 <SortableTableHeader 
                  title = "Price Volatility" 
                  sortField= "vol" 
                  active = {volActive}
                  sortDirection={orderDirection}
                  hover={volHover}
                  />
                </StyledTableCell>
              </StyledTableRow>
              <FilterTableRow >
                <FilterTableCell />
                <FilterTableCell >
                  <TextField 
                      size = "small"
                      variant = 'filled'
                      label = "filter (e.g ASX)"
                      align = "left"
                      onChange = {(e) => handleTickerFilter(e.target.value, 'Ticker')}
                      value = {tickerFilter}
                    />
                </FilterTableCell>
                <FilterTableCell />
                <TextField 
                    size = "small"
                    variant = 'filled'
                    label = "filter (<>=)"
                    align = "left"
                    onChange = {(e) => handleScoreFilter(e.target.value, 'Score')}
                    value={scoreFilter}
                 />
                <FilterTableCell />
                  
                <FilterTableCell />
              </FilterTableRow>
            </TableHead>
            <TableBody>
              {(filtered? filteredStocks : stocks).map((row) => (
                <StyledTableRow key={row.Name}>
                  <StyledTableCell component="th" scope="row">
                    {row.Name}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.Ticker}</StyledTableCell>
                  <StyledTableCell align="left">{row.Price}</StyledTableCell>
                  <StyledTableCell align="left" >{row.Score}</StyledTableCell>
                  <StyledTableCell align="left" >{row['Price Volatility'].toFixed(4)}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
            <TableFooter>
              <StyledTableRow>
                <TablePagination
                  colSpan={3}
                  count={numStocks}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[]}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  />
                </StyledTableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    }
  </> 
    
  );
}
/*
    Note this component was largely taken from a MaterialUI example and modified for purpose
*/

