/******************************************************************************/

export function wrap (wrappers, component) {
  for (let wrapper of wrappers) {
    component = wrapper.wrap (component);
  }
  return component;
}

/******************************************************************************/
