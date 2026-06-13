export const matches = (value: string, query: string): boolean => {
      const serializedString = (val: string): string => val.toLowerCase().trim();
      return serializedString(value).includes(serializedString(query));
}

