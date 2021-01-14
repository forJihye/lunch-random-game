export const createMenuData = (menus) => {
  const result = [];
  for(let i = 0; i < menus.length; i++){
    const data = {id: i, name: menus[i], select: false}
    result.push(data);
  }
  return result;
}

export function shuffleArray(a) { 
  var j, x, i; 
  for (i = a.length; i; i -= 1) { 
    j = Math.floor(Math.random() * i); 
    x = a[i - 1]; 
    a[i - 1] = a[j]; 
    a[j] = x; 
  } 
  return a;
}
