import { Card,CardContent,CardDescription,CardFooter,CardTitle,CardHeader} from "./outbound/ui/components/mock/card"
export default function App() {
  return ( 
    <>
 <Card className="w-1/5">
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main</p>
      </CardContent>
      <CardFooter>
        <button className="px-3 py-1 bg-blue-500 text-white rounded">
         Some button
        </button>    
      </CardFooter>
    </Card>
    </>
  )
}
