export const getNameInitials = (fullname: string) => {
    const names = fullname.trim().split(' ');

    if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return fullname.slice(0, 2).toUpperCase();
};

export const selectRandomBg = (name: string) => {
    const colors = [
      "bg-indigo-500/70",
      "bg-buttons",
      "bg-texts-important",
      "bg-red-500",
      "bg-purple-500/80",
      "bg-yellow-500",
      "bg-alerts",
      "bg-ui-tertiary"
    ];
  
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }
  
    return colors[hash % colors.length];
  };