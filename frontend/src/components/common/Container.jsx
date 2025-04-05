export function Container({ style = {}, children }) {
  return (
    <div style={{
      maxWidth: "1400px",
      paddingInline: 20,
      margin: "0 auto",
      width: "100%",
      ...style,
    }}>
      {children}
    </div>
  )
}