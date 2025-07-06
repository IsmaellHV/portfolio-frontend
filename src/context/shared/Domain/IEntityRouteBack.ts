import { LazyExoticComponent } from 'react';

type JSXComponent = () => JSX.Element;

export interface IEntityRoute {
  to: string;
  path: string;
  Component: LazyExoticComponent<() => JSX.Element> | JSXComponent;
  name: string;
}
