export const formatDate = (iso: string | number) => {
    const date = new Date(Number(iso));
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };