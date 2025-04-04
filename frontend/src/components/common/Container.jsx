export function Container({ children }) {
  return (
    <div style={{
      maxWidth: "1400px",
      padding: "0 20px",
      margin: "0 auto",
      width: "100%",
    }}>
      {children}
    </div>
  )
}