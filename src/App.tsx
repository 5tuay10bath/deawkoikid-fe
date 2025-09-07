
import TableCom from "@client/ui/components/table/TableCom";
import tenantcolumns from "@client/ui/components/table/tenantcolumn";
import tenantData from "./constant/tenantdata";
import contractColumns from "@client/ui/components/table/contractcolumn";
import contractData from "./constant/contractdata";

export default function App() {
  return (
    <>
      <TableCom columns={tenantcolumns} data={tenantData}></TableCom>
      <TableCom columns={contractColumns} data={contractData}></TableCom>
    </>
  );
}
