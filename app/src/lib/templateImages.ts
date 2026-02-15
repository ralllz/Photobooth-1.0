// Template images are in public/templates folder
// They will be served from /templates/ path in production (public is root)

export const getTemplateImage = (filename: string): string => {
  // Return the public path directly - Vite will resolve it
  // Make sure filename is just the filename, not a full path
  const cleanFilename = filename.split('/').pop() || filename;
  return `/templates/${cleanFilename}`;
};
