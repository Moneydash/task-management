export const formatDateToYMD = (dateStr: string) => {
    // Expects "YYYY-DD-MM", returns "YYYY-MM-DD"
    const [year, day, month] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }