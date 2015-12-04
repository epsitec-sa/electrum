'use strict';

export default function extendComponentDisplayName (component, name) {
  component.displayName = name;
  return component;
}
