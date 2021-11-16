import * as React from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles  from '../stylesheets/SortableTableHeader.module.css'


export default function SortableTableHeader({title, active, sortDirection,hover}){
  return (
    <div 
    className = {styles.tableHeader}
    >
    
     <div>{title}</div>
     <div>
      {
        active ? (
          sortDirection === 'Asc' ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )
        ) : hover ? (
          <KeyboardArrowUpIcon />
        ) : null
      } 
     </div>

    </div>
  )
}