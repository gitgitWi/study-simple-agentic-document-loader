const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * 1024;

export const convertSize = (size: number) => {
  if (size < BYTES_PER_KB) {
    return `< 1 KB`;
  }
  if (size < BYTES_PER_MB) {
    return `${(size / BYTES_PER_KB).toFixed(1)} KB`;
  }
  return `${(size / BYTES_PER_MB).toFixed(1)} MB`;
};
