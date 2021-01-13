import styled from "styled-components";
// serialize deserialize

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

export const Neumorphism = (Component) => styled(Component)`
  background: #e0e0e0;
  box-shadow: 5px 5px 10px #bebebe, -5px -5px 10px #ffffff;
`;
export const NeumorphismActive = (Component) => styled(Component)`
  background: #e0e0e0;
  box-shadow: -5px -5px 10px #bebebe, 5px 5px 10px #ffffff;
`;
