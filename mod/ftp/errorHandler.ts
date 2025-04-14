// ./backend/utils/errorHandler.ts
export const handleError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  return "Nieznany błąd";
};
