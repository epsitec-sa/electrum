'use strict';

export default function setComponentDisplayName (component, name) {
  component.prototype.displayName = name;
  return component;
}
