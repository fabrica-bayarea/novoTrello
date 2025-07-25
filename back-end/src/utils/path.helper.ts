import { join } from 'path';

export const resolveTemplatePath = (templateName: string): string => {
  return join(process.cwd(), 'src', 'mail', 'templates', templateName);
};
