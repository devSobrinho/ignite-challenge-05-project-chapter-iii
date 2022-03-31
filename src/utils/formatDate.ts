import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formateDate(date: Date | string): string {
  const dataFormated = format(new Date(date), 'dd MMM yyyy', {
    locale: ptBR,
  });

  return dataFormated;
}
