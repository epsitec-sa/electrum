'use strict';

export default function setComponentDisplayName (component, name) {
  component.displayName = name;
  return component;
}
