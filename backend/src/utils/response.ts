export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Formats the API response in a consistent structure.
 * @param status - 'success' or 'error'
 * @param data - The data to return in the response (for success)
 * @param message - A message describing the response (for error)
 * @param error - Error details (for error)
 * @returns An object representing the API response.
 */
export const formatResponse = <T>(
  status: "success" | "error",
  data?: T,
  message?: string,
  error?: string,
): ApiResponse<T> => {
  return {
    status,
    ...(status === "success" ? { data } : { message, error }),
  };
};
