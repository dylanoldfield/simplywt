import * as React from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles  from '../stylesheets/SortableTableHeader.module.css'
import { Container } from '@mui/material';


export default function SortableTableHeader({title, active, sortDirection,hover}){
  return (
    <Container
    className = {styles.tableHeader}
    >
    
     <div>{title}</div>
     <div>
      {
        active ? (
          sortDirection === 'Asc' ? (
            <KeyboardArrowUpIcon className = {styles.arrow} />
          ) : (
            <KeyboardArrowDownIcon className = {styles.arrow} />
          )
        ) : hover ? (
          <KeyboardArrowUpIcon className = {styles.arrow} />
        ) : <KeyboardArrowUpIcon sx ={{color:'black'}} />
      } 
     </div>

    </Container>
  )
}