export function aggregateData<T, Extras extends Record<string, any >>(
    data: T,
    extras: Extras
  ): T & Extras {
    return {
      ...data,
      ...extras,
    };
  }