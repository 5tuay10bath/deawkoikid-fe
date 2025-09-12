import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table/Table"
import { Badge } from '../Badge'
import { Button } from '../Button'
import { Edit } from 'lucide-react'
import { useUnitStore } from "@core/application/libs/store/units.store"
import axios from "axios";
import { useEffect, useState } from "react"
type Unit = {
  id: number;
  unitNumber: number;
  isActive: boolean;
  latestAirconService: string | null; 
};
const TableCompo = () => {

    const [units, setUnits] = useState<Unit[]>([]);

  useEffect(()=>{
    loadUnits();
  },[]);
  const loadUnits=async ()=>{
    const result = await axios.get("http://localhost:8080/units");
   setUnits(result.data);
   
  }

  return (
    <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit Number</TableHead>
                <TableHead>isActive</TableHead>
                <TableHead>Aircon</TableHead>
            
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit:Unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.unitNumber}</TableCell>
                  <TableCell>{unit.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell>{unit.latestAirconService}</TableCell>
                
    
                </TableRow>
              ))}
            </TableBody>
          </Table>
  )
}

export default TableCompo