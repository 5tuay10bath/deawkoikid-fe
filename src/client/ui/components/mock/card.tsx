import * as React from "react"

import { cn } from "@core/application/libs/cn/cn"

// import styled from 'styled-components'
function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-card text-card-foreground rounded-lg border shadow-sm", className)} {...props} />
}
function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
}
function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
}
function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-muted-foreground text-sm", className)} {...props} />
}
function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}
function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
}
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

// export const Test = ({Title} : {Title : string}) => {
//     return (
//         <Custom.Card>
//             <Custom.CardHeader>
//                 <Custom.CardTitle>{Title}</Custom.CardTitle>
//                 <Custom.CardTitle></Custom.CardTitle>
//             </Custom.CardHeader>
//         </Custom.Card>
//     )
// }

// const Custom = {
//   Card: styled.div.attrs({
//     className: cn("rounded-lg border bg-black text-card-foreground shadow-sm"),
//   })``,

//   CardHeader: styled.div.attrs({
//     className: cn("flex flex-col space-y-1.5 p-6"),
//   })``,

//   CardTitle: styled.div.attrs({
//     className: cn("text-2xl font-semibold leading-none tracking-tight"),
//   })``,
// };
