"use client"

type ErrorProps = {
  error: Error & { digest?: string }; // Add `digest` for Next.js error boundaries
};
const Error = ({ error }: ErrorProps) => {
  console.log(error)
  return (
    <div>Error {error.message}</div>
  )
}

export default Error
