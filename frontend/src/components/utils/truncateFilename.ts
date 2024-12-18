 export const truncateFileName = (name) => {     if (name.length > 10) {       return `${name.slice(0, 10)}...`;     }     return name; };
