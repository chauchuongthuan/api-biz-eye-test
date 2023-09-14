export enum StatusEnum {
   NEW = 1,
   IN_REVIEW = 2,
   CENSORSHIP = 3,
   PUBLISHED = 4,
}

export function StatusTrans(status = 1): string {
   return (
      {
         1: 'NEW',
         2: 'IN-REVIEW',
         3: 'CENSORSHIP',
         4: 'PUBLISHED',
      }[status] || ''
   );
}
