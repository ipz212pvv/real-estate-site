export function formatDate(pattern, date) {
  switch (pattern) {
    case 'DD.MM.YYYY HH:MM':
      return new Intl.DateTimeFormat("uk-UA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    default:
      return '';
  }
}