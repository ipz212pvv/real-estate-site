export function NextArrow(props) {
  const { className, style, onClick } = props;

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
  }

  return (
    <div className={className} style={style} onClick={handleClick} />
  );
}

export function PrevArrow(props) {
  const { className, style, onClick } = props;

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
  }

  return (
    <div className={className} style={style} onClick={handleClick} />
  );
}