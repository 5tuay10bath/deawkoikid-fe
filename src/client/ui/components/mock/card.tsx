import { cn } from "@core/application/libs/cn/cn";
import * as React from "react";
// import styled from 'styled-components'
function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
    />
  );
}
function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
    />
  );
}
function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
    />
  );
}
function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...props} className={cn("text-sm text-muted-foreground", className)} />
  );
}
function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("p-6 pt-0", className)} />;
}
function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("flex items-center p-6 pt-0", className)} />
  );
}
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

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
